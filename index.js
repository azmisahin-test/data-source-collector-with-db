const { collectorEmitter, collector } = require("./collector");

collectorEmitter.on("step", (response) => {
  const { type, timestamp, step, message, error } = response
  if (type === "info") console.log(`${timestamp} - ${step} - ${message}`);
  if (type === "error") console.error(`${timestamp} - ${step} - ${message}`, error);
});

const runCollector = async () => {
  const result = await collector();

  if (result.success) {
    console.log("Collector setup successfully");
  } else {
    console.error("Collector failed:", result.message);
  }
};

runCollector();