# turknet-status

Wrapper for the status API for the ISP [Türk.net](https://turk.net/).

Requirements
-----------
* [Node.js](https://nodejs.org/) version 8 or higher

Dependecies
-----------

* [node-fetch](https://www.npmjs.com/package/node-fetch)
* [moment](https://www.npmjs.com/package/moment)
* [moment-timezone](https://www.npmjs.com/package/moment-timezone)

Installation
-----------
It is an API what do you expect.

    ~/project/$ npm install --save turknet-status

On your project:

```js
const Turknet = require("turknet-status");
const turknet = new Turknet.StatusClient();
```

Insights
-----------

All objects return a promise. Using async/await is recommended.

Objects
-----------

### turknet.monthlySpeedtest

#### getLastMonthResults()

Gets the previous month's speedtest results.

### turknet.futureOps

#### getLatestOperation()

Get the closest maintenance operation.

#### getAllOperations()

Get all maintenance operations.

### turknet.exchangeInfo

#### getPingData()

Gets a list of pings to popular services from PoP exchanges.

### turknet.telekomSSGProblems

### turknet.yapaFiberProblems
