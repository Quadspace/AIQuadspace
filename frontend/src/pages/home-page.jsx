import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";

export default function AIResponse({ openModal }) {
  const key = import.meta.env.VITE_OPENAI_API_KEY;
  const navigate = useNavigate();
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [inputText, setInputText] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showTyping, setShowTyping] = useState(true);
  const [userEmail, setUserEmail] = useState("");
  const [threadIdentifier, setThreadIdentifier] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [agreementChecked, setAgreementChecked] = useState(false);


  const [chatHistory, setChatHistory] = useState([
    {
      role: "assistant",
      content:
        "Hi! I'm Quad, here to chat with you about your warehouse processes and help you with your needs! ☀️<br><br> Let's chat about what's going on.",
    },
  ]);


  const handleAdminButtonClick = async () => {
    try {
      const accessToken = localStorage.getItem("accessToken");
      const response = await fetch("https://quadbot-rt.onrender.com/api/check_admin/", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
      });

      const data = await response.json();
      if (response.ok && data.isAdmin) {
        navigate("/admin");
      } else {
        setErrorMessage("Access denied. You must have admin access.");
      }
    } catch (error) {
      console.error("Error:", error);
      setErrorMessage("An error occurred. Please try again later.");
    }
  };



  const chatContentRef = useRef(null);
  const inputRef = useRef(null);


  function linkify(inputText) {

    const urlMappings = {
      "https://forms.office.com/r/HKjacNXHCd": "Details Form",
      "https://quadspace.us/": "Quadspace",
    };

    const urlRegex =
      /(\b(https?|ftp|file):\/\/[-A-Z0-9+&@#/%?=~_|!:,.;]*[-A-Z0-9+&@#/%=~_|])/gi;

    return inputText.replace(urlRegex, function (url) {

      if (urlMappings[url]) {
        return `<a href="${url}" target="_blank" rel="noopener noreferrer" style="color: blue; text-decoration: underline;">${urlMappings[url]}</a>`;
      }

      return `<a href="${url}" target="_blank" rel="noopener noreferrer" style="color: blue; text-decoration: underline;">${url}</a>`;
    });
  }

  const handleChatStart = async () => {
    if (!agreementChecked) {
      setErrorMessage("You must select the checkbox to agree");
      return;
    }
    setIsChatOpen(true);
    setShowTyping(true);

    const accessToken = localStorage.getItem("accessToken");

    try {
      const response = await fetch(
        "https://quadbot-rt.onrender.com/api/create_chat_thread/",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to create chat thread");
      }

      const data = await response.json();
      setThreadIdentifier(data.threadIdentifier);


      setTimeout(() => {
        setShowTyping(false);
        appendToChatHistory({
          role: "assistant",
          content: "Who do I have the pleasure of speaking with?",
        });
      }, 3500);
    } catch (error) {
      console.error("Error creating chat thread:", error);

    }
  };


  useEffect(() => {
    if (chatContentRef.current) {
      chatContentRef.current.scrollTop = chatContentRef.current.scrollHeight;
    }
    if (inputRef.current && !isLoading) {
      inputRef.current.focus();
    }
  }, [chatHistory, isLoading]);

  const handleInputChange = (e) => {
    setInputText(e.target.value);
    setErrorMessage("");
    const textarea = e.target;
    textarea.style.height = "auto";
    textarea.style.height = `${textarea.scrollHeight}px`;
  };
  const clearErrorMessage = () => {
    setErrorMessage("");
  };

  const handleInputKeyDown = (e) => {
    if (e.key === "Enter" && !isLoading) {
      handleSubmit();
    }
  };

  const appendToChatHistory = (message) => {
    setChatHistory((prevChatHistory) => [...prevChatHistory, message]);
  };

  const formatList = (content) => {
    const lines = content.split("\n");
    let formattedContent = "";
    let inList = false;
    let isSubBullet = false;

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i].trim();
      if (line.startsWith("**")) {

        const title = line.replace(/\*\*/g, "").trim();
        formattedContent += `${inList ? "<br><br>" : ""
          }<strong>${title}:</strong> `;
        inList = false;
        isSubBullet = false;
      } else if (line.startsWith("-")) {

        formattedContent += `<br>${isSubBullet ? "" : "<br>"}${line}`;
        inList = true;
        isSubBullet = true;
      } else if (line.length > 0) {

        formattedContent += `${inList ? "<br><br>" : ""}${line}`;
        inList = true;
        isSubBullet = false;
      }
    }

    return formattedContent;
  };

  const fetchFileContent = async () => {
    try {
      const response = await fetch("/knowledge.txt");
      if (!response.ok) {
        throw new Error("Failed to fetch file");
      }
      return await response.text();
    } catch (error) {
      console.error("Error reading file:", error);
      return "";
    }
  };

  const handleSubmit = async () => {
    setIsLoading(true);
    setShowTyping(true);

    const userMessageContent = {
      role: "user",
      content: inputText,
      userEmail: localStorage.getItem("userEmail"),
      threadIdentifier,
    };

    appendToChatHistory({ role: "user", content: inputText });
    setInputText("");

    try {
      const accessToken = localStorage.getItem("accessToken");


      await fetch("https://quadbot-rt.onrender.com/api/save_chat_message/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify(userMessageContent),
      });

      const knowledgeText = await fetchFileContent();


      const response = await fetch(
        "https://api.openai.com/v1/chat/completions",
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${key}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            model: "gpt-4-1106-preview",
            messages: [
              { role: "system", content: knowledgeText },
              ...chatHistory,
              { role: "user", content: inputText },
            ],
          }),
        }
      );

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      const data = await response.json();
      const assistantResponse = data.choices[0].message.content;

      appendToChatHistory({
        role: "assistant",
        content: assistantResponse,
      });


      const assistantMessageContent = {
        role: "assistant",
        content: assistantResponse,
        userEmail: localStorage.getItem("userEmail"),
        threadIdentifier,
      };

      await fetch("https://quadbot-rt.onrender.com/api/save_chat_message/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify(assistantMessageContent),
      });
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setShowTyping(false);
      setIsLoading(false);
      if (inputRef.current) {
        inputRef.current.focus();
      }
    }
  };

  const handleCheckboxChange = (e) => {
    setAgreementChecked(e.target.checked);
    clearErrorMessage();

  };

  return (
    <>
      {!isChatOpen ? (
        <div className="disclaimer-wrapper">
          <div className="disclaimer-container">
            <img
              src="/logofull.png"
              alt="Quadspace Logo"
              style={{ maxWidth: "100%", height: "auto" }}
            />
            <div className="privacy-policy-container">

              <h2>Privacy Policy</h2>
              <div className="privacy-policy-content">

                <p>
                  1. Personal information we collect We collect personal
                  information relating to you (“Personal Information”) as
                  follows: Personal Information You Provide: We collect Personal
                  Information if you create an account to use our Services or
                  communicate with us as follows: Account Information: When you
                  create an account with us, we will collect information
                  associated with your account, including your name, contact
                  information, account credentials, payment card information,
                  and transaction history, (collectively, “Account
                  Information”). User Content: When you use our Services, we
                  collect Personal Information that is included in the input,
                  file uploads, or feedback that you provide to our Services
                  (“Content”). Communication Information: If you communicate
                  with us, we collect your name, contact information, and the
                  contents of any messages you send (“Communication
                  Information”). Social Media Information: We have pages on
                  social media sites like Instagram, Facebook, Medium, Twitter,
                  YouTube and LinkedIn. When you interact with our social media
                  pages, we will collect Personal Information that you elect to
                  provide to us, such as your contact details (collectively,
                  “Social Information”). In addition, the companies that host
                  our social media pages may provide us with aggregate
                  information and analytics about our social media activity.
                  Other Information You Provide: We collect other information
                  that you may provide to us, such as when you participate in
                  our events or surveys or provide us with information to
                  establish your identity (collectively, “Other Information You
                  Provide” Personal Information We Receive Automatically From
                  Your Use of the Services: When you visit, use, or interact
                  with the Services, we receive the following information about
                  your visit, use, or interactions (“Technical Information”):
                  Log Data: Information that your browser or device
                  automatically sends when you use our Services. Log data
                  includes your Internet Protocol address, browser type and
                  settings, the date and time of your request, and how you
                  interact with our Services. Usage Data: We may automatically
                  collect information about your use of the Services, such as
                  the types of content that you view or engage with, the
                  features you use and the actions you take, as well as your
                  time zone, country, the dates and times of access, user agent
                  and version, type of computer or mobile device, and your
                  computer connection. Device Information: Includes name of the
                  device, operating system, device identifiers, and browser you
                  are using. Information collected may depend on the type of
                  device you use and its settings. Cookies: We use cookies to
                  operate and administer our Services, and improve your
                  experience. A “cookie” is a piece of information sent to your
                  browser by a website you visit. You can set your browser to
                  accept all cookies, to reject all cookies, or to notify you
                  whenever a cookie is offered so that you can decide each time
                  whether to accept it. However, refusing a cookie may in some
                  cases preclude you from using, or negatively affect the
                  display or function of, a website or certain areas or features
                  of a website. For more details on cookies, please visit All
                  About Cookies. Analytics: We may use a variety of online
                  analytics products that use cookies to help us analyze how
                  users use our Services and enhance your experience when you
                  use the Services. 2. How we use personal information We may
                  use Personal Information for the following purposes: To
                  provide, administer, maintain and/or analyze the Services; To
                  improve our Services and conduct research; To communicate with
                  you; including to send you information about our Services and
                  events; To develop new programs and services; To prevent
                  fraud, criminal activity, or misuses of our Services, and to
                  protect the security of our IT systems, architecture, and
                  networks; To carry out business transfers; and To comply with
                  legal obligations and legal process and to protect our rights,
                  privacy, safety, or property, and/or that of our affiliates,
                  you, or other third parties. Aggregated or De-Identified
                  Information. We may aggregate or de-identify Personal
                  Information so that it may no longer be used to identify you
                  and use such information to analyze the effectiveness of our
                  Services, to improve and add features to our Services, to
                  conduct research and for other similar purposes. In addition,
                  from time to time, we may analyze the general behavior and
                  characteristics of users of our Services and share aggregated
                  information like general user statistics with third parties,
                  publish such aggregated information or make such aggregated
                  information generally available. We may collect aggregated
                  information through the Services, through cookies, and through
                  other means described in this Privacy Policy. We will maintain
                  and use de-identified information in anonymous or
                  de-identified form and we will not attempt to reidentify the
                  information, unless required by law. As noted above, we may
                  use Content you provide us to improve our Services, for
                  example to train the models that power ChatGPT. Read our
                  instructions on how you can opt out of our use of your Content
                  to train our models. 3. Disclosure of personal information In
                  certain circumstances we may provide your Personal Information
                  to third parties without further notice to you, unless
                  required by the law: Vendors and Service Providers: To assist
                  us in meeting business operations needs and to perform certain
                  services and functions, we may provide Personal Information to
                  vendors and service providers, including providers of hosting
                  services, customer service vendors, cloud services, email
                  communication software, web analytics services, and other
                  information technology providers, among others. Pursuant to
                  our instructions, these parties will access, process, or store
                  Personal Information only in the course of performing their
                  duties to us. Business Transfers: If we are involved in
                  strategic transactions, reorganization, bankruptcy,
                  receivership, or transition of service to another provider
                  (collectively, a “Transaction”), your Personal Information and
                  other information may be disclosed in the diligence process
                  with counterparties and others assisting with the Transaction
                  and transferred to a successor or affiliate as part of that
                  Transaction along with other assets. Legal Requirements: We
                  may share your Personal Information, including information
                  about your interaction with our Services, with government
                  authorities, industry peers, or other third parties (i) if
                  required to do so by law or in the good faith belief that such
                  action is necessary to comply with a legal obligation, (ii) to
                  protect and defend our rights or property, (iii) if we
                  determine, in our sole discretion, that there is a violation
                  of our terms, policies, or the law; (iv) to detect or prevent
                  fraud or other illegal activity; (v) to protect the safety,
                  security, and integrity of our products, employees, or users,
                  or the public, or (vi) to protect against legal liability.
                  Affiliates: We may disclose Personal Information to our
                  affiliates, meaning an entity that controls, is controlled by,
                  or is under common control with OpenAI. Our affiliates may use
                  the Personal Information we share in a manner consistent with
                  this Privacy Policy. Business Account Administrators: When you
                  join a ChatGPT Enterprise or business account, the
                  administrators of that account may access and control your
                  OpenAI account. In addition, if you create an account using an
                  email address belonging to your employer or another
                  organization, we may share the fact that you have an OpenAI
                  account and certain account information, such as your email
                  address, with your employer or organization to, for example,
                  enable you to be added to their business account. Other Users
                  and Third Parties You Share Information With: Certain features
                  allow you to display or share information with other users or
                  third parties. For example, you may share ChatGPT
                  conversations with other users via shared links or send
                  information to third-party applications via custom actions for
                  GPTs. Be sure you trust any user or third party with whom you
                  share information. 4. Your rights Depending on location,
                  individuals may have certain statutory rights in relation to
                  their Personal Information. For example, you may have the
                  right to: Access your Personal Information and information
                  relating to how it is processed. Delete your Personal
                  Information from our records. Rectify or update your Personal
                  Information. Transfer your Personal Information to a third
                  party (right to data portability). Restrict how we process
                  your Personal Information. Withdraw your consent—where we rely
                  on consent as the legal basis for processing at any time.
                  Object to how we process your Personal Information. Lodge a
                  complaint with your local data protection authority. You can
                  exercise some of these rights through your OpenAI account. If
                  you are unable to exercise your rights through your account,
                  please submit your request through privacy.openai.com or to
                  dsar@openai.com. A note about accuracy: Services like ChatGPT
                  generate responses by reading a user’s request and, in
                  response, predicting the words most likely to appear next. In
                  some cases, the words most likely to appear next may not be
                  the most factually accurate. For this reason, you should not
                  rely on the factual accuracy of output from our models. If you
                  notice that ChatGPT output contains factually inaccurate
                  information about you and you would like us to correct the
                  inaccuracy, you may submit a correction request through
                  privacy.openai.com or to dsar@openai.com. Given the technical
                  complexity of how our models work, we may not be able to
                  correct the inaccuracy in every instance. In that case, you
                  may request that we remove your Personal Information from
                  ChatGPT’s output by filling out this form. For information on
                  how to exercise your rights with respect to data we have
                  collected from the internet to train our models, please see
                  this help center article. 5. Additional U.S. state disclosures
                  The following table provides additional information about the
                  categories of Personal Information we collect and how we
                  disclose that information. You can read more about the
                  Personal Information we collect in “Personal information we
                  collect” above, how we use Personal Information in “How we use
                  personal information” above, and how we retain Personal
                  Information in “Security and Retention” below. Category of
                  Personal Information Disclosure of Personal Information
                  Identifiers, such as your name, contact details, IP address,
                  and other device identifiers We may disclose this information
                  to our affiliates, vendors and service providers to process in
                  accordance with our instructions; to law enforcement and other
                  third parties for the legal reasons described above; to
                  parties involved in Transactions; to corporate administrators
                  of enterprise or team accounts; and to other users and third
                  parties you choose to share it with. Commercial Information,
                  such as your transaction history We may disclose this
                  information to our affiliates, vendors and service providers
                  to process in accordance with our instructions; to law
                  enforcement and other third parties for the legal reasons
                  described above; to parties involved in Transactions; and to
                  corporate administrators of enterprise or team accounts.
                  Network Activity Information, such as Content and how you
                  interact with our Services We may disclose this information to
                  our affiliates, vendors and service providers to process in
                  accordance with our instructions; to law enforcement and other
                  third parties for the legal reasons described above; to
                  parties involved in Transactions; and to other users and third
                  parties you choose to share it with. Geolocation Data We may
                  disclose this information to our affiliates, vendors and
                  service providers to process in accordance with our
                  instructions; to law enforcement and other third parties for
                  the legal reasons described above; and to parties involved in
                  Transactions. Your account login credentials and payment card
                  information (Sensitive Personal Information) We disclose this
                  information to our affiliates, vendors and service providers,
                  law enforcement, and parties involved in Transactions. To the
                  extent provided for by local law and subject to applicable
                  exceptions, individuals may have the following privacy rights
                  in relation to their Personal Information: The right to know
                  information about our processing of your Personal Information,
                  including the specific pieces of Personal Information that we
                  have collected from you; The right to request deletion of your
                  Personal Information; The right to correct your Personal
                  Information; and The right to be free from discrimination
                  relating to the exercise of any of your privacy rights. We
                  don’t “sell” Personal Information or “share” Personal
                  Information for cross-contextual behavioral advertising (as
                  those terms are defined under applicable local law). We also
                  don’t process sensitive Personal Information for the purposes
                  of inferring characteristics about a consumer. Exercising Your
                  Rights. To the extent applicable under local law, you can
                  exercise privacy rights described in this section by
                  submitting a request through privacy.openai.com or to
                  dsar@openai.com. Verification. In order to protect your
                  Personal Information from unauthorized access, change, or
                  deletion, we may require you to verify your credentials before
                  you can submit a request to know, correct, or delete Personal
                  Information. If you do not have an account with us, or if we
                  suspect fraudulent or malicious activity, we may ask you to
                  provide additional Personal Information and proof of residency
                  for verification. If we cannot verify your identity, we will
                  not be able to honor your request. Authorized Agents. You may
                  also submit a rights request through an authorized agent. If
                  you do so, the agent must present signed written permission to
                  act on your behalf and you may also be required to
                  independently verify your identity and submit proof of your
                  residency with us. Authorized agent requests can be submitted
                  to dsar@openai.com. Appeals. Depending on where you live, you
                  may have the right to appeal a decision we make relating to
                  requests to exercise your rights under applicable local law.
                  To appeal a decision, please send your request to
                  dsar@openai.com. 6. Children Our Service is not directed to
                  children under the age of 13. OpenAI does not knowingly
                  collect Personal Information from children under the age of
                  13. If you have reason to believe that a child under the age
                  of 13 has provided Personal Information to OpenAI through the
                  Service, please email us at legal@openai.com. We will
                  investigate any notification and if appropriate, delete the
                  Personal Information from our systems. If you are 13 or older,
                  but under 18, you must have permission from your parent or
                  guardian to use our Services. 7. Links to other websites The
                  Service may contain links to other websites not operated or
                  controlled by OpenAI, including social media services (“Third
                  Party Sites”). The information that you share with Third Party
                  Sites will be governed by the specific privacy policies and
                  terms of service of the Third Party Sites and not by this
                  Privacy Policy. By providing these links we do not imply that
                  we endorse or have reviewed these sites. Please contact the
                  Third Party Sites directly for information on their privacy
                  practices and policies. 8. Security and Retention We implement
                  commercially reasonable technical, administrative, and
                  organizational measures to protect Personal Information both
                  online and offline from loss, misuse, and unauthorized access,
                  disclosure, alteration, or destruction. However, no Internet
                  or email transmission is ever fully secure or error free. In
                  particular, email sent to or from us may not be secure.
                  Therefore, you should take special care in deciding what
                  information you send to us via the Service or email. In
                  addition, we are not responsible for circumvention of any
                  privacy settings or security measures contained on the
                  Service, or third-party websites. We’ll retain your Personal
                  Information for only as long as we need in order to provide
                  our Service to you, or for other legitimate business purposes
                  such as resolving disputes, safety and security reasons, or
                  complying with our legal obligations. How long we retain
                  Personal Information will depend on a number of factors, such
                  as the amount, nature, and sensitivity of the information, the
                  potential risk of harm from unauthorized use or disclosure,
                  our purpose for processing the information, and any legal
                  requirements. 9. International users By using our Service, you
                  understand and acknowledge that your Personal Information will
                  be processed and stored in our facilities and servers in the
                  United States and may be disclosed to our service providers
                  and affiliates in other jurisdictions. Legal Basis for
                  Processing. Our legal bases for processing your Personal
                  Information include: Performance of a contract with you when
                  we provide and maintain our Services. When we process Account
                  Information, Content, and Technical Information solely to
                  provide our Services to you, this information is necessary to
                  be able to provide our Services. If you do not provide this
                  information, we may not be able to provide our Services to
                  you. Our legitimate interests in protecting our Services from
                  abuse, fraud, or security risks, or in developing, improving,
                  or promoting our Services, including when we train our models.
                  This may include the processing of Account Information,
                  Content, Social Information, and Technical Information. Read
                  our instructions on how you can opt out of our use of your
                  information to train our models. Your consent when we ask for
                  your consent to process your Personal Information for a
                  specific purpose that we communicate to you. You have the
                  right to withdraw your consent at any time. Compliance with
                  our legal obligations when we use your Personal Information to
                  comply with applicable law or when we protect our or our
                  affiliates’, users’, or third parties’ rights, safety, and
                  property. Data Transfers. Where required, we will use
                  appropriate safeguards for transferring Personal Information
                  outside of certain countries. We will only transfer Personal
                  Information pursuant to a legally valid transfer mechanism.
                  Data Protection Officer. You can contact our data protection
                  officer at privacy@openai.com in matters related to Personal
                  Information processing. 10. Changes to the privacy policy We
                  may update this Privacy Policy from time to time. When we do,
                  we will post an updated version on this page, unless another
                  type of notice is required by applicable law.
                </p>

              </div>
            </div>
            {errorMessage && (
              <div style={{ color: "red", marginTop: "10px" }}>
                {errorMessage}
              </div>
            )}
            <label className="privacy-agreement">
            <input
                type="checkbox"
                name="agreement"
                checked={agreementChecked}
                onChange={handleCheckboxChange}
              />
              I agree to the Privacy Policy
            </label>

            <button onClick={handleChatStart}>I give permission</button>
          </div>
        </div>
      ) : (
        <div className="chat-container">
          <img
            src="/logofull.png"
            alt="Quadspace Logo"
            style={{
              maxWidth: "80%",
              height: "auto",
              display: "block",
              margin: "0 auto",
            }}
          />

          <div className="chat-box" ref={chatContentRef}>
            {errorMessage && (
              <div style={{ color: "red", padding: "10px" }}>
                {errorMessage}
              </div>
            )}

            <div className="chat-content">
              {chatHistory.map((message, index) => (
                <p
                  key={index}
                  className={`message ${message.role === "user"
                      ? "user-message"
                      : "assistant-message"
                    }`}
                  dangerouslySetInnerHTML={{ __html: linkify(message.content) }}
                />
              ))}
              {showTyping && (
                <div className="chat-bubble">
                  <div className="loading">
                    <div className="dot one"></div>
                    <div className="dot two"></div>
                    <div className="dot three"></div>
                  </div>
                  <div className="tail"></div>
                </div>
              )}
            </div>
          </div>
          <div className="input-container">
            <textarea
              ref={inputRef}
              className="chat-input"
              placeholder="Type a message..."
              value={inputText}
              onChange={handleInputChange}
              onKeyDown={handleInputKeyDown}
              disabled={isLoading}
            />
            <button
              className="send-button"
              onClick={handleSubmit}
              disabled={isLoading}
            >
              {isLoading ? <div className="loader"></div> : "Send"}
            </button>
          </div>
        </div>
      )}
 <div style={{ 
      position: "fixed", 
      bottom: 0, 
      left: "50%", 
      transform: "translateX(-50%)", 
      fontSize: "20px", 
      color: "black", 
      textAlign: "center",
      marginBottom: "10px"     }}>
      Visit us at www.Quadspace.us
    </div>

      <div style={{ position: "fixed", bottom: 20, right: 20 }}>
        <button onClick={handleAdminButtonClick} className="small-admin-button">
          A
        </button>
      </div>
    </>
  );
}
