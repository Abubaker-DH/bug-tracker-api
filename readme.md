This project is a backend of bugs tracker app,

Setup
Make sure to follow all these steps exactly as explained below. Do not miss any steps or you won't be able to run this application.

Install MongoDB
To run this project, you need to install the latest version of MongoDB Community Edition first.

https://docs.mongodb.com/manual/installation/

Once you install MongoDB, make sure it's running.

Install the Dependencies
Next, from the project folder, install the dependencies:

npm i

You need to add .env file in the root of project with this key=> value
(JWT_SECRIT) This key is used to encrypt JSON web tokens. So, for security reasons, it should not be checked into the source control. I've set a default value here to make it easier for you to get up and running with this project.For a production scenario, you should store this keys as an environment variable.

PORT=3000
JWT_SECRIT=qweqwdlij55wq2ds53f5fa35fa335af53  
MONGO_URI=mongodb://localhost/bug-tracker

i use transaction for mulitple doc change so:
you need to allowed replica set member, mongos when u use mongodb in localhost
Or use mongodb in atals so will not have problem with transactions

Start the Server
node index.js
This will launch the Node server on port 3000. .

Open up your browser and head over to:

http://localhost:3000/api/v1/bugs
http://localhost:3000/api/v1/projects
http://localhost:3000/api/v1/users
http://localhost:3000/api/v1/auth

You should see an empty arry []. That confirms that you have set up everything successfully.

You can access the api over Heroku with:
https://bugs-tracker-api-1.herokuapp.com/
https://web-production-e081.up.railway.app/api-docs/
