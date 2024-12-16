const { createConnection } = require("../db/mysql/connector");
const collectorEmitter = require("./collectorEmitter");

const saveData = async (processedData, service) => {
  let connector;
  try {
    // open connection
    connector = await createConnection();

    // collect all data
    const values = processedData.items.map((item) => {
      const { title, link, pubDate, traffic, picture, newsItems } = item;
      const interest = traffic;
      const source_timestamp = new Date(pubDate)
        .toISOString()
        .slice(0, 19)
        .replace("T", " ");
      const {
        service_id,
        language_code,
        language_name,
        country_code,
        country_name,
      } = service;

      return [
        service_id,
        language_code,
        language_name,
        country_code,
        country_name,
        title,
        interest,
        source_timestamp,
      ];
    });

    // Insert query
    const query = `
      INSERT INTO source_data 
      (service_id, language_code, language_name, country_code, country_name, title, interest, source_timestamp)
      VALUES ?
    `;

    // batch insert
    return new Promise((resolve, reject) => {
      connector.query(query, [values], (error, result) => {
        if (error) {
          collectorEmitter.emit("step", {
            timestamp: new Date().toISOString(),
            type: "error",
            step: "saveData",
            message: `Error saving data`,
            error,
          });
          reject({
            success: false,
            message: "Error saving data",
            error,
          });
        } else {
          collectorEmitter.emit("step", {
            timestamp: new Date().toISOString(),
            type: "info", // changed to info for successful insert
            step: "saveData",
            message: `Data saved successfully, ${result.affectedRows} rows inserted`,
            data: result,
          });
          resolve({
            success: true,
            message: `Inserted ${result.affectedRows} rows.`,
            insertedId: result.insertId || null,
          });
        }
      });
    });
  } catch (error) {
    collectorEmitter.emit("step", {
      timestamp: new Date().toISOString(),
      type: "error",
      step: "saveData",
      message: `Error saving data: ${error.message}`,
      error,
    });
    return {
      success: false,
      message: "Connection error",
      error,
    };
  } finally {
    // close connection
    if (connector) {
      connector.end();
    }
  }
};

const updateService = async (serviceId) => {
  let connector;
  try {
    // open connection
    connector = await createConnection();

    return new Promise((resolve, reject) => {
      const query = `UPDATE source SET last_fetched = NOW() WHERE service_id = ?`;
      connector.query(query, [serviceId], (error, result) => {
        if (error) {
          collectorEmitter.emit("step", {
            timestamp: new Date().toISOString(),
            type: "error",
            step: "updateService",
            message: `Error updating last_fetched`,
            error,
          });
          reject(error);
        } else {
          collectorEmitter.emit("step", {
            timestamp: new Date().toISOString(),
            type: "info", // changed to info for successful update
            step: "updateService",
            message: `Service last_fetched updated successfully, ${result.affectedRows} rows affected`,
            data: result,
          });
          resolve(result);
        }
      });
    });
  } catch (error) {
    collectorEmitter.emit("step", {
      timestamp: new Date().toISOString(),
      type: "error",
      step: "updateService",
      message: `Error updating service: ${error.message}`,
      error,
    });
  } finally {
    // close connection
    if (connector) {
      connector.end();
    }
  }
};

module.exports = { updateService, saveData };
