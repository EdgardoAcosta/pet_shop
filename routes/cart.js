/**
 * Created by  edgardoacosta.
 * 30/06/17.
 */

var express = require('express');
var couchdb = require('nano')('http://gest:gest@127.0.0.1:5984');
var router = express.Router()





/* GET home page. */
router.get('/', function(req, res, next) {
    res.render('cart', { title: 'Shoping car' });
});

module.exports = router;