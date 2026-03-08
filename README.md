API: It is a service from which we can re*uest some data.
IDEA: We are going to build an API that will simply manage the complaints raise by the students of the college.

### PART O(BEGINEER)

## Phase _01
# Step_01: Install Node Project.
-> npm init -y
-> npm install express

# Step_02: Create server.
-> server.js

# Step_03: Run it.
-> node server.js
-> http://localhost:5000

## Phase_02
# Connect MongoDB
-> npm install mongoose dotenv
-> create config.env file
# Phase _03
 Create Simple user model
# Phase _04
-> Save one user
-> the saved data will be stored in the actual MongoDB(local) database.
# Create a complaint.

### PART 01
 ## Login + Bcrypt + JWT
 -> Install (npm install bcryptjs jsonwebtoken)
 -> Hash password(In DB, actual passwords are never stored rather the hashed one.)