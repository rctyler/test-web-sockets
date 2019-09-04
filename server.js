function handleSubmit() {
    event.preventDefault();
    return false;
}

var WebSocketServer = require('websocket').server;
var http = require('http');

var server = http.createServer(function handleRequest(request, response) {
    response.writeHead(200, {
        'Content-Type': 'text/html'
    });

    require('fs').readFile('./index.html', null, function (error, data) {
        if (error) {
            response.writeHcead(404);
            respone.write('Whoops! File not found!');
        } else {
            response.write(data);
        }
        response.end();
    });
});

server.listen(1337, function() { 
    console.log("Server listening on port 1337.");
});


// create the server
wsServer = new WebSocketServer({
  httpServer: server
});

// WebSocket server
wsServer.on('request', function(request) {
  var connection = request.accept(null, request.origin);

  // This is the most important callback for us, we'll handle
  // all messages from users here.
  connection.on('message', function(message) {
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

  connection.on('close', function(connection) {
    // close user connection
  });
});