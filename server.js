const express = require('express');
const path = require('path');
const fs = require('fs');
const util = require('util');

const readFromFile = util.promisify(fs.readFile);

// Helper method for generating unique ids
const uuid = require('./helpers/uuid');

const PORT = process.env.PORT || 3001;

const app = express();

app.use(express.json());

app.use(express.static('public'));

// GET Route for homepage
app.get('/', (req, res) =>
  res.sendFile(path.join(__dirname, '/public/index.html'))
);

// GET Route for notes page
app.get('/notes', (req, res) =>
  res.sendFile(path.join(__dirname, '/public/notes.html'))
);  

// GET Route for notes json
app.get('/api/notes', (req, res) =>
  res.sendFile(path.join(__dirname, '/db/db.json'))
);

// GET notes with id
app.get('/api/notes:id', (req, res) =>
  res.sendFile(path.join(__dirname, '/db/db.json'))
);

// POST Route for a new UX/UI note
app.post('/api/notes', (req, res) => {
  console.info(`${req.method} request received to add a note`);

  const { title, text } = req.body;

  if (req.body) {
    const newTip = {
      title,
      text,
      id: uuid()
    };

    readAndAppend(newTip, './db/db.json');
    res.json(`Note added successfully 🚀`);
  } else {
    res.error('Error in adding tip');
  }
});

app.delete('/api/notes/:id', (req, res) => {

  readFromFile('./db/db.json').then((data) => {
    const dataJSON = JSON.parse(data);
    const newArray = dataJSON.filter((e) => e.id !== req.params.id);

    writeToFile('./db/db.json', newArray);
  });

  res.json(`Note deleted successfully 🚀`);
})

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

const writeToFile = (destination, content) =>
  fs.writeFile(destination, JSON.stringify(content, null, 4), (err) =>
    err ? console.error(err) : console.info(`\nData written to ${destination}`)
  );

app.listen(PORT, () =>
  console.log(`App listening at http://localhost:${PORT} 🚀`)
);