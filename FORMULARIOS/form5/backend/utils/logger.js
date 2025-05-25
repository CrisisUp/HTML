const fs = require('fs');
const path = require('path');

const logStream = fs.createWriteStream(
  path.join(__dirname, '../logs/application.log'), 
  { flags: 'a' }
);

module.exports = {
  log: (message, data = {}) => {
    const entry = {
      timestamp: new Date().toISOString(),
      message,
      ...data
    };
    
    console.log(JSON.stringify(entry));
    logStream.write(JSON.stringify(entry) + '\n');
  }
};