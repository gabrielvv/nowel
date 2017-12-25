var express = require('express');
var router = express.Router();
var path    = require("path");

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.get('/marianne', function(req, res, next) {
  res.render('index', { title: 'Express' });
});
router.get('/lulu', function(req, res, next) {
  res.render('index', { title: 'Express' });
});
router.get('/agnes', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

module.exports = router;
