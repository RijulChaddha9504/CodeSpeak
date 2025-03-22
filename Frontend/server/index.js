const express = require('express');
const path = require('path');
const app = express();
const cors = require('cors');
const port = 3000;

const corsOptions = {
  origin: '*', // Allow only this origin
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE', // Allowed HTTP methods
  credentials: true, // Allow cookies
  optionsSuccessStatus: 204, // Some legacy browsers (IE11, various SmartTVs) choke on 204
};

app.use(cors(corsOptions));

const {AudioControl} = require('../util/audioControl.js');
const AudioController = AudioControl.instance(); 

// const { Storage: GoogleCloudStorage } = require('@google-cloud/storage');
// const storage = new GoogleCloudStorage;
require('dotenv').config();

// API routes
app.get('/api/data', (req, res) => {
  res.json({ message: 'Hello from Node.js!' });
});

// Serve the Vite build output
// app.use(express.static(path.join(__dirname, '../dist')));

// Handle all other routes by serving index.html
// app.get('*', (req, res) => {
//   res.sendFile(path.join(__dirname, '../dist/index.html'));
// });

app.get('/api/get_local_audio_file', async (req, res) => { 
  //downloadIntoMemory(req.query.audio_file_path); 
  const audio_contents = await AudioController.downloadIntoMemory(req.query.audio_file_path);
  // BucketName = "wav-audio-bucket";
  // storage.bucket(BucketName).file("en-US-Standard-A.wav").download({destination: `../audio/en-US-Standard-A.wav`});
  // const [contents] = await storage.bucket(BucketName).file("en-US-Standard-A.wav").download();
  // res.json({'audio_file_path': '/audio/' + req.query.audio_file_path.split('/').pop()});
  res.json({'audio_contents': audio_contents});
});

app.listen(port, () => {
  console.log(`Server listening at http://localhost:${port}`);
});