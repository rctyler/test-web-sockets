'use strict';

var WebSocketServer = require('websocket').server;
var http = require('http');

var server = http.createServer(function handleRequest(request, response) {
    console.log('request ', request.url);

    var supportedMimeTypes = {
        '.html': 'text/html',
        '.js': 'text/javascript',
    };

    var filePath = request.url;
    if (filePath === '/') {
        console.log('index.html');
        filePath = 'index.html';
    }

    var extName = String(require('path').extname(filePath)).toLowerCase();
    var contentType = supportedMimeTypes[extName] || 'text/html';

    console.log(extName);
    switch (extName) {
    case '.html':
        filePath = `./public/html/${filePath}`;
        break;
    case '.js':
        filePath = `./public/js/${filePath}`;
        break;
    default:
        filePath = `./${filePath}`
    }

    console.log(filePath);

    require('fs').readFile(filePath, function(error, content) {
        if (error) {
            if(error.code == 'ENOENT') {
                require('fs').readFile('./public/html/404.html', function(error, content) {
                    response.writeHead(404, { 'Content-Type': contentType });
                    response.end(content, 'utf-8');
                });
            } else {
                response.writeHead(500);
                response.end(`Sorry, check with the site admin for error: ${error.code}...\n`);
            }
        } else {
            response.writeHead(200, { 'Content-Type': contentType });
            response.end(content, 'utf-8');
        }
    });
});

server.listen(1337, function() { 
    console.log("Server listening on port 1337.");
});

// create the server
var wsServer = new WebSocketServer({
    httpServer: server
});

var connections = [];

// WebSocket server
wsServer.on('request', function(request) {
    var connection = request.accept(null, request.origin);
    connections.push(connection);

    // This is the most important callback for us, we'll handle
    // all messages from users here.
    connection.on('message', function(message) {
        connections.forEach((connection) => {
            if (message.type === 'utf8') {
                // process WebSocket message
                if (!message.utf8Data) {
                    connection.sendUTF("Hey! Send me something next time.")
                } else if (message.utf8Data.toLowerCase().includes("hello")) {
                    connection.sendUTF("Message received, hello to you too!")
                } else {
                    connection.sendUTF("Message received.")
                }
            }
        });
    });

    connection.on('close', function(connection) {
        // close user connection
        connections = connections.filter(c => c !== connection);
    });
});
