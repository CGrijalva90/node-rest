/*
* Library for storing and rotating logs
*/

const fs = require('fs');
const path = require('path');
const zlib = require('zlib');

// Container for the module
const lib = {};

// Base directory of the logs folder
lib.baseDir = path.join(__dirname, '/../.logs/');

// Append a string to a file. Create the file if it does not exists.
lib.append = (file, str, callback) => {
  // Open the file for appending
  fs.open(`${lib.baseDir}${file}.log`, 'a', (err, fileDescriptor) => {
    if (!err && fileDescriptor) {
      fs.appendFile(fileDescriptor, `${str}\n`);
      if (!err) {
        fs.close(fileDescriptor, err => {
          if (!err) {
            callback(false);
          } else {
            callback('Error closing file that was being appended');
          }
        });
      } else {
        callback('Error appending to file');
      }
    } else {
      callback('Could not open file for appending');
    }
  });
};

module.exports = lib;
