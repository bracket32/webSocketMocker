let webSocketsServerPort = 8000;

import { server as webSocketServer } from "websocket";
import { createServer, httpServer } from "http";

import { v4 as uuidv4 } from 'uuid';

let serverContainers = new Array();
let dataMockers = new Array();

function serverContainer() {
    server: httpServer;
    wsServer: webSocketServer;
    clients: {};
};

// This code generates unique userid for everyuser.
const getUniqueID = () => {
  return uuidv4();
};

//spin up 3 socket servers 8000, 8001, 8002
let i = 0;
for (i = 0; i < 3; i++) {

  const servContainer = new serverContainer();
  // Spinning the http server and the websocket server.
    //const clients = {};
    servContainer.clients = {};

  const httpserver = createServer();
  httpserver.listen(webSocketsServerPort);
  console.log(
    "listening on port " + webSocketsServerPort + " ip: " + httpserver.address()
  );

  const wsServer = new webSocketServer({
    httpServer: httpserver,
  });

  wsServer.on("request", function (request) {
    var userID = getUniqueID();
    console.log(
      new Date() +
        " Recieved a new connection from origin " +
        request.origin +
        "."
    );

    // You can rewrite this part of the code to accept only the requests from allowed origin
    const connection = request.accept(null, request.origin);
    servContainer.clients[userID] = connection;
    console.log(
      "connected: " + userID + " in " + Object.getOwnPropertyNames(servContainer.clients)
    );

    connection.on("message", function (message) {
      if (message.type === "utf8") {
        console.log("Received Message: ", message);
        let key;
        // broadcasting message to all connected clients
        for (key in servContainer.clients) {
            servContainer.clients[key].sendUTF(message.utf8Data);
          console.log("sent " +  message.utf8Data + " Message to: ", 
          servContainer.clients[key].remoteAddress);
        }
      }
    });


  });

  servContainer.Server = httpserver;
  servContainer.wsServer = wsServer;

  serverContainers.push(servContainer);

  let mdata = require('./mockasync');
  //port 3000+n, maxvalue 
  let mocker = new mdata(webSocketsServerPort, 80);
  //timout milliseconds, number of iterations
  mocker.runMocker(200, 1000, i);
  webSocketsServerPort = webSocketsServerPort + 1;
  
};

//to do how to return the whole program when done


