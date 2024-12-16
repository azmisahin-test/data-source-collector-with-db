// collector/index.js
const { getSourceServiceData } = require("../db/mysql/connector");
const { saveData, updateService } = require("./saveDataToDb");
const fetchRSS = require("./fetchRss");
const parseXML = require("./parseXML");
const processFeed = require("./processFeed");
const collectorEmitter = require("./collectorEmitter");

// Function to handle fetching for a specific service based on its frequency
const fetchDataForService = async (service) => {
  // Fetch service parameters from the service_parameters table
  const rateLimit = service.rate_limit || 1;
  const timeout = service.timeout || 30;

  if (service.access_type_id === 2 || service.data_format_code === "xml") {
    // Use rateLimit, timeout, etc. when making the request
    const xmlData = await fetchRSS(service.full_url, { rateLimit, timeout });
    if (xmlData) {
      const jsonData = await parseXML(xmlData);
      const processedData = processFeed(jsonData);
      const result = await saveData(processedData, service);

      if (result.success) {
        await updateService(service.service_id);
      }
    }
  }
};

const scheduleServiceFetch = (service) => {
  if (service.fetch_frequency > 0) {

    collectorEmitter.emit("step", {
      timestamp: new Date().toISOString(),
      type: "info",
      step: "scheduleServiceFetch",
      message: `scheduled ${service.fetch_frequency} for service ${service.service_id} with ${service.rate_limit} [${service.timeout}]`,
    });

    // Set a recurring interval based on fetch_frequency
    setInterval(() => {
      fetchDataForService(service)
        .then(() => {
          collectorEmitter.emit("step", {
            timestamp: new Date().toISOString(),
            type: "info",
            step: "collector",
            message: `Fetched data for service ${service.service_id}`,
          });
        })
        .catch((error) => {
          collectorEmitter.emit("step", {
            timestamp: new Date().toISOString(),
            type: "error",
            step: "collector",
            message: `Error fetching data for service ${service.service_id}: ${error.message}`,
          });
        });
    }, service.fetch_frequency * 1000); // fetch every fetch_frequency seconds
  } else {
    // Handle real-time fetch
    fetchDataForService(service)
      .then(() => {
        collectorEmitter.emit("step", {
          timestamp: new Date().toISOString(),
          type: "info",
          step: "collector",
          message: `Fetched real-time data for service ${service.service_id}`,
        });
      })
      .catch((error) => {
        collectorEmitter.emit("step", {
          timestamp: new Date().toISOString(),
          type: "error",
          step: "collector",
          message: `Error fetching real-time data for service ${service.service_id}: ${error.message}`,
        });
      });
  }
};

const collector = async () => {
  try {
    const services = await getSourceServiceData();

    if (services.length === 0) {
      collectorEmitter.emit("step", {
        timestamp: new Date().toISOString(),
        step: "collector",
        message: "No services available",
      });
      return;
    }

    // Process each service
    for (let service of services) {
      // Schedule fetch for each service based on its fetch_frequency
      scheduleServiceFetch(service);
    }

    collectorEmitter.emit("step", {
      timestamp: new Date().toISOString(),
      type: "info",
      step: "collector",
      message: `All services [${services.length}] scheduled for data fetch`,
    });

    return { success: true };
  } catch (error) {
    collectorEmitter.emit("step", {
      timestamp: new Date().toISOString(),
      type: "error",
      step: "collector",
      message: "Error in collector",
      error,
    });
    return { success: false, message: error.message };
  }
};

module.exports = { collector, collectorEmitter };
