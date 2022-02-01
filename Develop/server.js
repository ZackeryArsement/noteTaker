const express = require('express');
const path = require('path');
const fs = require('fs');

const PORT = 3001;

const app = express();

// GET Route for homepage
app.get('/', (req, res) =>
  res.sendFile(path.join(__dirname, '/public/index.html'))
);

// GET Route for notes page
app.get('/notes', (req, res) =>
  res.sendFile(path.join(__dirname, '/public/notes.html'))
);  

// Append data content to a given file in JSON format
const readAndAppend = (content, file) => {
fs.readFile(file, 'utf8', (err, data) => {
    if (err) {
    console.error(err);
    } else {
    const parsedData = JSON.parse(data);
    parsedData.push(content);
    writeToFile(file, parsedData);
    }
});
};

app.listen(PORT, () =>
  console.log(`App listening at http://localhost:${PORT} 🚀`)
);