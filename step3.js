const fs = require('fs');
const axios = require('axios');

function cat(path, callback) {
  fs.readFile(path, 'utf8', callback);
}

function catWrite(path, filename, callback) {
  cat(path, (err, data) => {
    if (err) {
      callback(err);
    } else {
      fs.writeFile(filename, data, 'utf8', callback);
    }
  });
}

async function webCat(url, callback) {
  try {
    const response = await axios.get(url);
    callback(null, response.data);
  } catch (error) {
    callback(error);
  }
}

function webCatWrite(url, filename, callback) {
  webCat(url, (err, data) => {
    if (err) {
      callback(err);
    } else {
      fs.writeFile(filename, data, 'utf8', callback);
    }
  });
}

// Read the command line arguments
const args = process.argv.slice(2);

// Check if an argument is provided
if (args.length > 0) {
  let outputPath = null;
  let inputPath = null;

  // Iterate through the arguments to find the --out flag and the corresponding output path
  for (let i = 0; i < args.length; i++) {
    if (args[i] === '--out') {
      outputPath = args[i + 1];
      break;
    }
  }

  // If --out flag is found, extract the input path
  if (outputPath !== null) {
    inputPath = args[args.indexOf('--out') + 2];
  } else {
    // If --out flag is not found, assume the first argument is the input path
    inputPath = args[0];
  }

  // Check if the argument is a file path or a URL
  if (inputPath.startsWith('http://') || inputPath.startsWith('https://')) {
    if (outputPath !== null) {
      webCatWrite(inputPath, outputPath, (err) => {
        if (err) {
          console.error(`Couldn't write ${outputPath}:\n  ${err}`);
        }
      });
    } else {
      webCat(inputPath, (err, data) => {
        if (err) {
          console.error(`Error fetching ${inputPath}:\n  ${err}`);
        } else {
          console.log(data);
        }
      });
    }
  } else {
    if (outputPath !== null) {
      catWrite(inputPath, outputPath, (err) => {
        if (err) {
          console.error(`Couldn't write ${outputPath}:\n  ${err}`);
        }
      });
    } else {
      cat(inputPath, (err, data) => {
        if (err) {
          console.error(`Error reading ${inputPath}:\n  ${err}`);
        } else {
          console.log(data);
        }
      });
    }
  }
} else {
  console.error('Please provide a file path or URL as an argument.');
}
