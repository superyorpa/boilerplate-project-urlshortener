require('dotenv').config();
const express = require('express');
const cors = require('cors');
const app = express();

// Basic Configuration
const port = process.env.PORT || 3000;

app.use(cors());

app.use('/public', express.static(`${process.cwd()}/public`));

app.get('/', function(req, res) {
  res.sendFile(process.cwd() + '/views/index.html');
});

// Your first API endpoint
app.get('/api/hello', function(req, res) {
  res.json({ greeting: 'hello API' });
});

app.use(express.urlencoded({ extended: true }));
app.use(express.json());


const url = {};
let counter = 1;

app.post('/api/shorturl', (req, res) => {
  let original_url = req.body.url

  if (!original_url.startsWith('http://') && !original_url.startsWith('https://')) {
    return res.json({ error: 'invalid url' });
  }

  try {
    new URL(original_url)
  } catch (err) {
    return res.json({ error: 'invalid url' })
  }

  const short_url = counter++

  url[short_url] = original_url

  res.json({
    original_url,
    short_url
  })
})

app.get('/api/shorturl/:short_url', (req, res) => {
  const short_url = req.params.short_url;
  const original_url = url[short_url];

  if (original_url) {
    res.redirect(original_url)
  } else {
    res.json({
      error: 'invalid url'
    })
  }
})

app.listen(port, function() {
  console.log(`Listening on port ${port}`);
});
