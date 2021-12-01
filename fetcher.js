const request = require('request');
const fs = require('fs');
const readline = require('readline');
const args = process.argv.slice(2);
const url = args[0];
const pathToFile = args[1];

const checkIfFileExists = function(path, data) {
  fs.access(path, err => {
    if (err) {
      writeFile(path, data);
    } else  {
      const rl = readline.createInterface({input: process.stdin, output: process.stdout});
      rl.question('This file already exists, do you want to overwrite? (y/n)\n', (choice) => {
        if (choice === '\u0079') {
          writeFile(path, data);
          rl.close();
        } else {
          console.log(`No file written to ${path}`);
          rl.close();
        }
      })
    }
  })
} 

const writeFile = function(path, data) {
  fs.writeFile(path, data, err => {
    if (err) {
      console.log(`Invalid file path`);
      
      return false;
    }
    console.log(`Downloaded and saved ${data.length} bytes to ${path}`);
  })
}

const fetcher = function(url, pathToFile) {
  request(url, (err, res, body) => {
    if(res.statusCode === 200) {
      checkIfFileExists(pathToFile, body);
    } else {
      console.log(`Invalid Url \nStatus Code: ${res.statusCode}`);
    }
  });
}

fetcher(url, pathToFile);
