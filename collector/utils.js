// utils.js

// Simple delay function that returns a promise and resolves after the given time (in ms)
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

module.exports = { delay };
