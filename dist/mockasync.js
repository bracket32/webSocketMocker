"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.mockData = void 0;

var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));

var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));

var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime/helpers/classCallCheck"));

var _createClass2 = _interopRequireDefault(require("@babel/runtime/helpers/createClass"));

var _websocket = require("websocket");

function numberMaint(numbGen, increment, scale) {
  this.numbGen = numbGen;
  this.increment = increment;
  this.scale = scale;
}

var mockData = /*#__PURE__*/function () {
  function mockData(connectPort, scale) {
    (0, _classCallCheck2["default"])(this, mockData);
    this.connectPort = connectPort;
    this.numberTracker = new numberMaint(0, true, scale); //attempt to find the socket

    this.client = new _websocket.w3cwebsocket('ws://127.0.0.1:' + this.connectPort);
  } //this puts the runMocker into a promise, so it can resolve when its done working...

  /*
  runMockerWithResolve = (secs, iterations, startat) => {
    return new Promise((resolve) => {
     
      runMocker(secs, iterations, startat);
      
      return resolve({
        success: this.connectPort,
      })
    })
  }
  */
  //this puts them in a stack and they all resolve at 2 secs
  //really the next one shoud be called when the current one resolved...
  //so put an await on the async resolve call and it will block until its ready for next


  (0, _createClass2["default"])(mockData, [{
    key: "runMocker",
    value: function () {
      var _runMocker = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee(secs, iterations, startat, done) {
        var i, result;
        return _regenerator["default"].wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                this.numberTracker.numbGen = startat;
                i = 0;
                i = 0;

              case 3:
                if (!(i < iterations)) {
                  _context.next = 12;
                  break;
                }

                _context.next = 6;
                return this.resolveAfterNSeconds(secs, i);

              case 6:
                result = _context.sent;
                console.log(this.connectPort + " " + i + " " + result); //push into socke here

                this.client.send(JSON.stringify({
                  result: result
                })); //this.client.send(result); //ooesnt know how to send just binary data

              case 9:
                i++;
                _context.next = 3;
                break;

              case 12:
                //close when done
                //this client sends a close when its done
                //the main client should see that this is closed and shut down the socket
                this.client.close(0, 'completed.');
                done(this.connectPort);

              case 14:
              case "end":
                return _context.stop();
            }
          }
        }, _callee, this);
      }));

      function runMocker(_x, _x2, _x3, _x4) {
        return _runMocker.apply(this, arguments);
      }

      return runMocker;
    }()
  }, {
    key: "resolveAfterNSeconds",
    value: function resolveAfterNSeconds(secs, index) {
      var _this = this;

      return new Promise(function (resolve) {
        setTimeout(function () {
          //resolve('resolved ' + this.connectPort + " " + index);
          resolve(_this.numberMaintenance());
        }, secs);
      });
    }
  }, {
    key: "numberMaintenance",
    value: function numberMaintenance() {
      var increment = this.numberTracker.increment;
      var numbGen = this.numberTracker.numbGen;
      var scale = this.numberTracker.scale;
      if (increment && numbGen === scale) increment = false;else if (!increment && numbGen === 0) increment = true;
      if (increment) numbGen = numbGen + 1;else numbGen = numbGen - 1;
      this.numberTracker.numbGen = numbGen;
      this.numberTracker.increment = increment;
      return numbGen;
    }
  }]);
  return mockData;
}();

exports.mockData = mockData;
module.exports = mockData;