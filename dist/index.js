"use strict";

var _websocket = require("websocket");

var _http = require("http");

var _uuid = require("uuid");

var webSocketsServerPort = 8000;
var serverContainers = new Array();
var dataMockers = new Array();

function serverContainer() {
  server: _http.httpServer;

  wsServer: _websocket.server;

  clients: {}

  ;
}

; // This code generates unique userid for everyuser.

var getUniqueID = function getUniqueID() {
  return (0, _uuid.v4)();
}; //spin up 3 socket servers 8000, 8001, 8002


var i = 0;

var _loop = function _loop() {
  var servContainer = new serverContainer(); // Spinning the http server and the websocket server.
  //const clients = {};

  servContainer.clients = {};
  var httpserver = (0, _http.createServer)();
  httpserver.listen(webSocketsServerPort);
  console.log("listening on port " + webSocketsServerPort + " ip: " + httpserver.address());
  var wsServer = new _websocket.server({
    httpServer: httpserver
  });
  wsServer.on("request", function (request) {
    var userID = getUniqueID();
    console.log(new Date() + " Recieved a new connection from origin " + request.origin + "."); // You can rewrite this part of the code to accept only the requests from allowed origin

    var connection = request.accept(null, request.origin);
    servContainer.clients[userID] = connection;
    console.log("connected: " + userID + " in " + Object.getOwnPropertyNames(servContainer.clients));
    connection.on("message", function (message) {
      if (message.type === "utf8") {
        console.log("Received Message: ", message);
        var key; // broadcasting message to all connected clients

        for (key in servContainer.clients) {
          servContainer.clients[key].sendUTF(message.utf8Data);
          console.log("sent " + message.utf8Data + " Message to: ", servContainer.clients[key].remoteAddress);
        }
      }
    });
  });
  servContainer.Server = httpserver;
  servContainer.wsServer = wsServer;
  serverContainers.push(servContainer);

  var mdata = require('./mockasync'); //port 3000+n, maxvalue 


  var mocker = new mdata(webSocketsServerPort, 80); //timout milliseconds, number of iterations

  mocker.runMocker(200, 1000, i);
  webSocketsServerPort = webSocketsServerPort + 1;
};

for (i = 0; i < 3; i++) {
  _loop();
}

; //to do how to return the whole program when done