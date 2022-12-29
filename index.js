var dns = require('dns');
var bodyParser = require('body-parser');

require('dotenv').config();
const express = require('express');
const cors = require('cors');
const shortid = require('shortid');
const app = express();
// Basic Configuration
const port = process.env.PORT || 3000;

app.use(cors());

app.use('/public', express.static(`${process.cwd()}/public`));

app.use(bodyParser.urlencoded({extended: false}));

app.get('/', function (req, res) {
  res.sendFile(process.cwd() + '/views/index.html');
});

// Your first API endpoint
app.get('/api/hello', function (req, res) {
  res.json({greeting: 'hello API'});
});

const createUrl = require("./myApp.js").createAndSaveUrl;
const findByUrl = require("./myApp.js").findOneByUrl;
app.post('/api/shorturl', function (req, res) {
  try {
    const bodyUrl = new URL(req.body.url);
    // console.log('bodyUrl', bodyUrl);
    dns.lookup(bodyUrl.hostname, function (err, address) {
      if (err || !address) {
        return res.json({error: "Invalid URL"});
      }
      // req.body.url is valid - find url in database
      findByUrl(bodyUrl.href, function (err, data) {
        if (err) {
          return next(err);
        }
        // found url
        if (data) {
          return res.json({original_url: data.url, short_url: data.short_url});
        }
        // create when url not found
        createUrl({
          url: bodyUrl.href,
          short_url: shortid.generate()
        }, function (err, newData) {
          if (err) {
            return next(err);
          }
          if (!newData) {
            console.log("Missing `done()` argument");
            return next({message: "Missing callback argument"});
          }
          return res.json({original_url: newData.url, short_url: newData.short_url});
        });
      });
    });
  } catch (e) {
    res.json({error: "Invalid URL"});
  }
});

const findByShortUrl = require("./myApp.js").findOneByShortUrl;
app.get('/api/shorturl/:short_url', function (req, res, next) {
  // console.log('short_url', req.params.short_url);
  findByShortUrl(req.params.short_url, function (err, data) {
    if (err) {
      return next(err);
    }
    // found url
    if (data) {
      res.redirect(data.url);
    }
    next();
  });
});


app.listen(port, function () {
  console.log(`Listening on port ${port}`);
});
