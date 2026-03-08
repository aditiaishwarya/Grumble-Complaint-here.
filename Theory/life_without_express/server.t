// Express
-> A framework for node.js used to build web servers and APIs easily.

// What is framework?
-> ready-made structure that helps us build application faster.
-> Instead of writing everything from zero. the framework already gives you:
 1) routing system
 2) re*uest handling
 3) response handling
 4) middleware system
 5) server setup
 etc.

 -> without this building something would have been too long and complicated.

// LIFE WITHOUT EXPRESS:
@PART_01 (creating a server)
-> check: life_without_express/server.js


// OVERALL: 
-> code looks cleaner 
-> easier routing
->faster development
-> middleware support

// MIDDLEWARE:
->In express.js, middleware is a function that runs between the request and the response.
->It is like a checkpoint the request must pass through before reaching youur route.
-> It can 
        1) Modify request
        2) check something (e.g. Token expired or no)
        3) stop request
        4) pass request forward

-> Common Middlewares
        1) Body Parse: app.use(express.json()); 
        // Reads JSON from requests.
        // Without this we can not read "req.body"
        2) Logger: console.log(req.method, req.url);
        3) Authentication: Check user "token";
        // With this we check the authentication once that whether the user is logged in or no and then provide the route.
        // Otherwise we have to check the token in every route.
        // Request---> Authentication check---> Route ---> Response
        4) Error handling