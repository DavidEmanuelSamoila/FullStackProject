Log in with username: admin and password: 1234 for full access

This is a mock website that represents a mock consulting company called Royal Consulting.

Was a college project where Royal Consulting is making a computer system for Best Computer Store, but I'm making it so that it can be for other companies too.


Description:

Royal Consulting is currently working for a computer store to make a website that the employees can use to manage orders, inventory, and more.


About the Server:

The website is found on royal-consulting.ca and it's running on a Raspberry Pi 4 (4GB) running Ubuntu Server v22.04lts. Server is most likely active, if not, contact me.



Important code directories:

I'm using a local MySQL server and to find the Add, Remove, and Edit functionality, go to src/routers/authrouter.js

Go to src/views to see EJS pages

To see how I access the local MySQL server go to src/config/database



Main features:

When a user signs up, that creates a user request that only 'managers' can see and accept or deny. 0 for employees, 1 for managers. Will be fixed/changed.

Managers have access to more features than 'normal' employees. Make a user request and see.

Some features are not ready yet, some tabs may just redirect you to the profile page.



TODOs:

I used some CSS but I need to redo the design for a responsive design and mobile accessible.

Change privilliges from 0-1 to yes-no or something like that.

Fix the Manufacturer Information page.

Create Sales page.

Create Documents page.

Finish Pricing page.

Add useful data to Profile page.
    -Latest sale/s
    -Number of sales
    -Revenue made so far
    -Employee activity -- for managers

Add progress graphs where you can choose what data/info to see.

Add the capability to use different companies.

Add password hashing.

Change queries to prevent possible injection.

Change admin account to manage all other companies.