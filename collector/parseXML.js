// parseXML.js

const xml2js = require("xml2js");
const collectorEmitter = require("./collectorEmitter");

function parseXML(xml) {
  try {
    const parser = new xml2js.Parser();
    const result = parser.parseStringPromise(xml);
    collectorEmitter.emit("step", {
      timestamp: new Date().toISOString(),
      type: "info",
      step: "parseXML",
      message: "XML parsed successfully",
      data: result,
    });
    return result;
  } catch (error) {
    collectorEmitter.emit("step", {
      timestamp: new Date().toISOString(),
      type: "error",
      step: "parseXML",
      message: `Error parsing XML`,
      error,
    });
    return null;
  }
}

module.exports = parseXML;
