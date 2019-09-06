var ws = new WebSocket("ws://localhost:1337");

ws.onmessage = function(event) {
    console.log(`Message received by web worker: ${event.data}`)
    postMessage(event.data); 
};