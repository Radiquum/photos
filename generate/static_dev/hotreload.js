let webSocket = new WebSocket(`ws://${window.location.hostname}:3001`);
webSocket.onmessage = function (e) {
  if (e.data == "RELOAD") {
    console.log("Reloading page after build");
    location.reload();
  } else if (e.data == "CONNECTED") {
    console.log("Connected to server");
  } else {
    console.warn(`unknown data received: ${e}`);
  }
};
