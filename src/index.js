let webSocketsServerPort = 8000;

import { server as webSocketServer } from "websocket";
import { createServer, httpServer } from "http";

import { v4 as uuidv4 } from 'uuid';

let serverContainers = new Array();

function serverContainer() {
    server: httpServer;
    wsServer: webSocketServer;
    clients: {}
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
  //ut says youcan put in t a host ip
  // httpserver.listen(webSocketsServerPort. "127.0.0.1");
  //and then you'll get a value in address().address but when I do that it says its not listening an the httpserver.address() fails
  console.log(
    "listening on port " + httpserver.address().port + " ip: " + httpserver.address().address
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

  servContainer.server = httpserver;
  servContainer.wsServer = wsServer;

  serverContainers.push(servContainer);

  let mdata = require('./mockasync');
  //port 3000+n, maxvalue 
  let mocker = new mdata(webSocketsServerPort, 80);

  //timout milliseconds, number of iterations, startat
  let startAt = Math.floor(Math.random() * 100);
  mocker.runMocker(200, 1000, startAt, mockerIsDone);
  webSocketsServerPort = webSocketsServerPort + 1;
  
};

//callback to shut down the server once the mocker is done
function mockerIsDone(portNumber) { 
  serverContainers.forEach( (item, index) => {
    debugger;
    if (item.server.address() !== null && item.server.address().port == portNumber)
    {
      console.log("mocker at" + portNumber + "is done");
      item.server.close(); //once you close it, you cant find it again, so address() function is null
    }  
  })
};



