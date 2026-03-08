// LIFE WITHOUT EXPRESS.
const http = require('http');
const server = http.createServer((req, res) =>{
    if(req.method == "GET" && req.url === "/"){
        res.write("Life without express...");
        res.end();
    }
});

server.listen(5000,()=>{
    console.log("Server runnning on port 5000");
});
