import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

const EmailVerificationPage = () => {
  const { token } = useParams(); // Assuming you're using React Router and the token is part of the URL
  const [verificationStatus, setVerificationStatus] = useState("");

  useEffect(() => {
    // Verify the email
    fetch(`http://localhost:8000/api/verify_email/${token}`)
      .then((response) => response.json())
      .then((data) => {
        if (data.message) {
          setVerificationStatus("Email verified successfully!");
        } else {
          setVerificationStatus(
            "Failed to verify email. The link may be expired or invalid."
          );
        }
      });
  }, [token]);

  return (
    <div>
      <h1>Email Verification</h1>
      <p>{verificationStatus}</p>
    </div>
  );
};

export default EmailVerificationPage;
