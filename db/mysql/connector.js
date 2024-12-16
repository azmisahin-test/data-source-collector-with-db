// connector.js

const mysql = require("mysql2");
const collectorEmitter = require("../../collector/collectorEmitter");

const createConnection = () => {
  return new Promise((resolve, reject) => {
    const connection = mysql.createConnection({
      host: process.env.MYSQL_HOST,
      user: process.env.MYSQL_USER,
      password: process.env.MYSQL_PASSWORD,
      database: process.env.MYSQL_DATABASE,
    });

    connection.connect((error) => {
      if (error) {
        collectorEmitter.emit("step", {
          timestamp: new Date().toISOString(),
          type: "error",
          step: "createConnection",
          message: "Database connection failed",
          error,
        });
        reject(error); // Reject promise if connection fails
      } else {
        collectorEmitter.emit("step", {
          timestamp: new Date().toISOString(),
          type: "info",
          step: "createConnection",
          message: "Database connection successful",
        });
        resolve(connection); // Resolve with the connection if successful
      }
    });
  });
};

// Close connection properly
const closeConnection = (connection) => {
  if (connection) {
    connection.end((error) => {
      if (error) {
        collectorEmitter.emit("step", {
          timestamp: new Date().toISOString(),
          type: "error",
          step: "closeConnection",
          message: "Error closing the connection",
          error,
        });
      } else {
        collectorEmitter.emit("step", {
          timestamp: new Date().toISOString(),
          type: "info",
          step: "closeConnection",
          message: "Database connection closed",
        });
      }
    });
  }
};

const getSourceServiceData = async () => {
  try {
    const connection = await createConnection();
    return new Promise((resolve, reject) => {
      const query = `SELECT * FROM source WHERE service_status_id = 1`;
      connection.query(query, (error, results) => {
        if (error) {
          collectorEmitter.emit("step", {
            timestamp: new Date().toISOString(),
            type: "error",
            step: "getSourceServiceData",
            message: "Error select data",
            error,
          });
          reject(err);
        } else {
          collectorEmitter.emit("step", {
            timestamp: new Date().toISOString(),
            type: "info",
            step: "getSourceServiceData",
            message: "Data selected",
            data: results,
          });
          resolve(results);
        }
      });
    }).finally(() => {
      closeConnection(connection);
    });
  } catch (error) {
    collectorEmitter.emit("step", {
      timestamp: new Date().toISOString(),
      type: "error",
      step: "getSourceServiceData",
      message: "Error",
      error,
    });
    throw error;
  }
};

module.exports = {
  createConnection,
  closeConnection,
  getSourceServiceData,
};
