const fs = require('fs');

function cat(path) {
  fs.readFile(path, 'utf8', (err, data) => {
    if (err) {
      console.error(`Error reading ${path}:\n  ${err}`);
    } else {
      console.log(data);
    }
  });
}

// Read the command line arguments
const args = process.argv.slice(2);

// Check if a file path is provided as an argument
if (args.length > 0) {
  const path = args[0];
  cat(path);
} else {
  console.error('Please provide a file path as an argument.');
}
