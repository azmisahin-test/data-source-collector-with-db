const axios = require("axios");
const collectorEmitter = require("./collectorEmitter");
const { delay } = require("./utils"); // We will create a helper function for delay

// Fetch RSS data with rate limit and timeout
const fetchRSS = async (url, { rateLimit = 100, timeout = 30 }) => {
  try {
    // Apply the rate limiting (e.g., delay between requests)
    if (rateLimit > 0) {
      await delay(1000 / rateLimit); // Delay between requests to avoid exceeding rate limit
    }

    // Make the HTTP request with the specified timeout
    const response = await axios.get(url, {
      timeout: timeout * 1000, // Timeout in milliseconds
    });

    collectorEmitter.emit("step", {
      timestamp: new Date().toISOString(),
      type: "info",
      step: "fetchRSS",
      message: `RSS data fetched from ${url}`,
    });

    return response.data; // Return the fetched data
  } catch (error) {
    collectorEmitter.emit("step", {
      timestamp: new Date().toISOString(),
      type: "error",
      step: "fetchRSS",
      message: `Error fetching RSS data from ${url}: ${error.message}`,
    });
    return null; // Return null in case of error
  }
};

module.exports = fetchRSS;
