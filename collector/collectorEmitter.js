// collectorEmitter.js

const EventEmitter = require("events");

class CollectorEmitter extends EventEmitter { }

const collectorEmitter = new CollectorEmitter();

module.exports = collectorEmitter;
