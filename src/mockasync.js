import { w3cwebsocket as W3CWebSocket } from "websocket";


function numberMaint(numbGen,increment,scale) {
    this.numbGen = numbGen;
    this.increment = increment;
    this.scale = scale;
  }

export class mockData {

    constructor(connectPort, scale) {
        this.connectPort = connectPort;
        this.numberTracker = new numberMaint(0, true, scale);

        //attempt to find the socket
        this.client = new W3CWebSocket('ws://127.0.0.1:'+ this.connectPort);
      }

    //this puts them in a stack and they all resolve at 2 secs
    //really the next one shoud be called when the current one resolved...
    //so put an await on the async resolve call and it will block until its ready for next
    async runMocker(secs, iterations, startat)
    {
        this.numberTracker.numbGen = startat;
        let i = 0;
        for (i = 0; i < iterations; i++)
        {
            const result = await this.resolveAfterNSeconds(secs, i);
            console.log(this.connectPort + " " + i + " " + result);
            //push into socke here
            this.client.send(JSON.stringify({
              result
            }));

            //this.client.send(result); //ooesnt know how to send just binary data
        }

        //close when done
        //this client sends a close when its done
        //the main client should see that this is closed and shut down the socket
        this.client.close(-1, 'completed.');
    }

    resolveAfterNSeconds(secs, index) {
        return new Promise(resolve => {
          setTimeout(() => {
            //resolve('resolved ' + this.connectPort + " " + index);
            resolve( this.numberMaintenance() );
          }, secs);
        });
      }

      numberMaintenance()
      {
        let increment = this.numberTracker.increment;
        let numbGen = this.numberTracker.numbGen;
        const scale = this.numberTracker.scale

        if (increment && numbGen === scale) increment = false;
        else if (!increment && numbGen === 0) increment = true;

        if (increment) numbGen = numbGen + 1;
        else numbGen = numbGen - 1;

        this.numberTracker.numbGen = numbGen;
        this.numberTracker.increment = increment;
        return numbGen;
      }

}

module.exports = mockData;