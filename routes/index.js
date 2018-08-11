var express = require('express');
var router = express.Router();

var app = express();

express.mime.type['css'] = 'text/css';
router.use(express.static(path.join(__dirname, '/public'), {
  setHeaders: function(res, path, stat){
    res.set('X-Content-Type-Options', 'nosniff');
  }
}));

module.exports = router;
