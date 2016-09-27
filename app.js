
const express = require('express');

// Constants
const PORT = 80;

// App
const app = express();
app.get('/', function (req, res) {
  res.send('Hello world\n');
  console.log('hosted');
});
app.get('/test', function (req, res) {
  res.send('Hello world\n');
  console.log('hosted');
});
app.get('/test1', function (req, res) {
  res.send('Hello world\n');
  console.log('hosted');
});

app.listen(PORT);
console.log('Running on http://localhost:' + PORT);
