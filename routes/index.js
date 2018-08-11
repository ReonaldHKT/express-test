var express = require('express');
var router = express.Router();

var app = express();

express.static.mime.define({'text/css': ['css']});
router.use(express.static(path.join(__dirname, '/public'), {
  setHeaders: function(res, path, stat){
    res.set('X-Content-Type-Options', 'nosniff');
  }
}));

module.exports = router;
