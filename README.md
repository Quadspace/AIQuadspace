Quad AI Chat Documentation
Last updated: 1/19/2024

Specifications
Frontend
React.js with React Router hosted on Netlfiy.com
Backend
Django with Django Rest Framework hosted on Render.com
Database
PostgreSQL hosted on Render.com
AI Chat
OpenAI API 
Using "gpt-4-1106-preview" model

User Stories
As a warehouse owner/leaser, I want to be able to learn more about how to maximize my warehouse production and efficiency.

As a warehouse owner/leaser, I want to be able to be contacted by someone with expertise on the subject should I desire.

As someone looking to lease warehouse space, I want to have one place where I can learn more about what it takes to efficiently run the logistics of the warehouse.

As a user I want to feel as if the chat is the expert on warehouse logistics and will provide me with accurate answers and resources.

As a user, I want to not feel pressured to use Quadspace’s services or be pushed towards their website, unless I desire.

As an admin for Quadspace, I want to be able to gather data for learning and lead generation from other user’s chat conversations.

As an admin for Quadspace, I want to know only registered users can enter into the admin panel.


Workflow
User is presented with a login page for username and password.  If they have an account they may log in.  If they do not have an account, they can create an account by clicking the corresponding button.  On the create account page they will be required to enter a username and a password and then confirm it.  If there are no errors it will log the user in. 

Once the user is logged in they will be presented with the privacy policy and a checkbox stating they have read the policy, and a button that allows them to agree and move on to the chat.  

Clicking this is the user’s agreement to have their chat messages recorded for Quadspace’s use. 
Clicking the button takes the user to the chat interface.  The first 2 messages will load from the Quad Assistant before the user types in anything. Quad will ask for the name of the user. 
Quad will greet the user by the name that was given in the first prompt.  Then say "In a sentence or two, tell me [insert user's name here] what challenges you are facing in regards to your warehouse needs. Feel free to be casual like this is a discussion between friends or coworkers."
After this, Quad will respond with something nice and appropriate.  Then ask the user to think of a time in the past when they had to deal with this issue.  Ask them "What have you done to try to fix this problem so far?"  This is to determine what they have already tried or if they have not tried much at all so this isn't actually that big of a deal for them.  
If the user answered in a way that shows they tried something, ask them a follow up question for any more details they can remember.  If not, then move on to the next step.
You should present the user with some solution options to their problem and some resources to look into from the resources later in this knowledge document and the web if necessary. Then ask if they want to go into more detail about any of them.
Give the user 3-4 more prompts to ask follow up questions.  If they do not ask anything, give them leading questions. 
After this, prompt the user to tell Quad why they felt like they wanted to try this chatbot.  Keep it casual in an open roundtable style discussion.
Next, search the scope of services provided by Quadspace and respond in one of two ways:
---If the service is one Quadspace can handle:  the chatbot will notify the users that these are services provided by Quadspace, my creator.  The link for the quadspace website is:  https://quadspace.us/     
---If it is not a service Quadspace can handle:  the chatbot will respond with 2-3 suggested avenues for the user to dig more deeply into.  Information will be obtained via the information in the uploaded files or  reputable supply chain sources on the internet. 
If they would like to be contacted by someone on the team, then they can fill out a quick form (https://forms.office.com/r/ManC4Y7ZA8) and someone will reach out to help shortly after submission.
Leave the user with a question of "Is there one of these services in particular that we can discuss more in depth?"
The user may continue to ask more questions if desired.




UI
Color theme matching Quadspace branding
Home page with disclaimer message and agreement button
Chat interface mimicking older iPhone Messages with “typing” bubbles
Embedded (clickable) links within the assistant chat messages
Small “A” button in bottom right of screen for admin login panel
Admin login page with username and password with error handling
Admin page with similar chat interface, but also Select Thread dropdown for admin to review all messages 



Data Models

Tables

EmailUser
- email
- is_active
- is_admin

ChatMessage
- user
--linked to email from EmailUser table
- thread
- role
- content
- timestamp

ChatThread
- user
-- linked to email from EmailUser table via thread identifier



How To:

Login as admin:
Click “A” button in button right hand corner of screen 
--If logged in user is administrator the chat logs will be shown

Access chat logs:
Log into admin page and select thread name from dropdown menu to read through chats

Create new admin:
Create new account or log in with created account.
View EmailUser table is Postico,
Find column labeled "is_admin"
Change to "True"
Save changes


Access PostgreSQL databases (raw chat data):
Connect database to Postico application and view from there

Upload more knowledge base for AI chat:
Copy text from desired files into the bottom of knowledge.txt
The more files added, the slower response time will be
This could even stop OpenAI API request entirely due to size of requests
There can be possible next steps to make this more Admin friendly



	
