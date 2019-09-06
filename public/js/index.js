'use strict';

var ws = new WebSocket("ws://localhost:1337");

Notification.requestPermission().then(function(result) {
    console.log(result);
});

var worker = new Worker("worker.js");

worker.onmessage = function(event) {
    if (!document.hasFocus()) {
        var n = new Notification('Incoming message', {
            body: event.data,
        });

        n.onclick = function(event) {
            event.preventDefault();
            window.focus();
            n.close();
        };
    }

    var lastChild = document.getElementById("ws-msg-pull").lastChild;
    lastChild.innerHTML += `<span>${event.data}</span>`;
}

function handleSubmit() {
    var msgInput = document.getElementById("ws-msg-push");
    console.log(`Push message across web socket: ${msgInput.value}`);
    var child = document.createElement("div");
    child.innerHTML = `<span>CLIENT: "${document.getElementById("ws-msg-push").value}"&nbsp;&nbsp;&nbsp;...&nbsp;&nbsp;&nbsp;</span>`;

    document.getElementById("ws-msg-pull").appendChild(child);

    setTimeout(() => ws.send(JSON.stringify(msgInput.value)), 3000);

    return false;
}
