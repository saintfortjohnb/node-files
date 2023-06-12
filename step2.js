const fs = require('fs');
const axios = require('axios');

function cat(path) {
  fs.readFile(path, 'utf8', (err, data) => {
    if (err) {
      console.error(`Error reading ${path}:\n  ${err}`);
    } else {
      console.log(data);
    }
  });
}

async function webCat(url) {
  try {
    const response = await axios.get(url);
    console.log(response.data);
  } catch (error) {
    console.error(`Error fetching ${url}:\n  ${error}`);
  }
}

// Read the command line arguments
const args = process.argv.slice(2);

// Check if an argument is provided
if (args.length > 0) {
  const arg = args[0];

  // Check if the argument is a file path or a URL
  if (arg.startsWith('http://') || arg.startsWith('https://')) {
    webCat(arg);
  } else {
    cat(arg);
  }
} else {
  console.error('Please provide a file path or URL as an argument.');
}
