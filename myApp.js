require('dotenv').config();
let mongoose = require("mongoose");
mongoose.connect(process.env['MONGO_URI'], { useNewUrlParser: true, useUnifiedTopology: true });

//let Url;
let urlSchema = new mongoose.Schema({
  url: { type: String, required: true },
  short_url: String
});

const Url = mongoose.model("Url", urlSchema);

const createAndSaveUrl = (urlObject, done) => {
  var document = new Url(urlObject);
  document.save(function(err, data) {
    if (err) return console.error(err);
    done(null, data)
  });
};

const findOneByUrl = (url, done) => {
  Url.findOne({ url: url }, function(err, data) {
    if (err) return console.log(err);
    done(null, data);
  });
};
const findOneByShortUrl = (short_url, done) => {
    Url.findOne({ short_url: short_url }, function(err, data) {
      if (err) return console.log(err);
      done(null, data);
    });
  };


exports.UrlModel = Url;
exports.createAndSaveUrl = createAndSaveUrl;
exports.findOneByUrl = findOneByUrl;
exports.findOneByShortUrl = findOneByShortUrl;
