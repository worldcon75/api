var express = require('express');
var router = express.Router();

/* GET home page. */
// allow cors for debug reasons
router.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", process.env.CORS_ORIGIN);
  res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
 });

function authenticate(req, res, next) {
  if (req.session && req.session.user && req.session.user.email) next();
  else res.status(401).json({ status: 'unauthorized' });
}

router.use(authenticate);

router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

var db = require('./queries');

router.get('/people/:id', db.getPeople);
router.get('/artists', db.getArtists);
router.get('/artist/:id', db.getArtist);
router.post('/artist', db.createArtist);
router.put('/artist/:id', db.updateArtist);
router.get('/works/:id', db.getWorks);
router.get('/work/:id', db.getWork);
router.post('/work', db.createWork);
router.put('/work/:id', db.updateWork);
router.delete('/work/:id', db.removeWork);

module.exports = router;
