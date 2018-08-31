/*
* Library for storing and editing data
*
*/

// Dependencies
const fs = require('fs');
const path = require('path');
const helpers = require('./helpers');

// Container for the module (to be exported)
const lib = {};

// Base directory of the data folder
lib.baseDir = path.join(__dirname, '/../.data/');

// Write data to a file
lib.create = (dir, file, data, callback) => {
  // Open the file for writing
  fs.open(`${lib.baseDir}${dir}/${file}.json`, 'wx', (err, fileDescriptor) => {
    if (!err && fileDescriptor) {
      // Convert data to string
      const stringData = JSON.stringify(data);

      // Write to file and close it
      fs.writeFile(fileDescriptor, stringData, err => {
        if (!err) {
          fs.close(fileDescriptor, err => {
            if (!err) {
              callback(false);
            } else {
              console.log('Error closing file');
            }
          });
        } else {
          console.log('Error writing to new file');
        }
      });
    } else {
      callback('Could not create new file, it may already exists');
    }
  });
};

// Read data from file
lib.read = (dir, file, callback) => {
  // Open file to read
  fs.readFile(`${lib.baseDir}${dir}/${file}.json`, 'utf-8', (err, data) => {
    if (!err && data) {
      const parsedData = helpers.parseJsonToObject(data);
      callback(false, parsedData);
    } else {
      callback(err, data);
    }
  });
};

lib.update = (dir, file, data, callback) => {
  // Open the file for writing
  fs.open(`${lib.baseDir}${dir}/${file}.json`, 'r+', (err, fileDescriptor) => {
    if (!err && fileDescriptor) {
      // Convert data to string
      const stringData = JSON.stringify(data);

      // Truncate the file
      fs.truncate(fileDescriptor, err => {
        if (!err) {
          // Write to file and close it
          fs.writeFile(fileDescriptor, stringData, err => {
            if (!err) {
              fs.close(fileDescriptor, err => {
                if (!err) {
                  callback(false);
                } else {
                  callback('Error closing the file');
                }
              });
            } else {
              callback('Error writing to existing file');
            }
          });
        } else {
          callback('Error truncating file');
        }
      });
    } else {
      console.log('Could not open the file for updating, it may not exist yet');
    }
  });
};

// Delete a file

lib.delete = (dir, file, callback) => {
  // Unlink
  fs.unlink(`${lib.baseDir}${dir}/${file}.json`, err => {
    if (!err) {
      callback(false);
    } else {
      callback('Error deleting file!');
    }
  });
};

// List all the items in a directory
lib.list = (dir, callback) => {
  fs.readdir(`${lib.baseDir}${dir}/`, (err, data) => {
    if (!err && data && data.length > 0) {
      const trimmedFileNames = [];
      data.forEach(filename => {
        trimmedFileNames.push(filename.replace('.json', ''));
      });
      callback(false, trimmedFileNames);
    } else {
      callback(err, data);
    }
  });
};
// Export the module
module.exports = lib;
