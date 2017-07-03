/**
 * Created by edgardoacosta on 28/06/17.
 */
var express = require('express');
var couchdb = require('nano')('http://gest:gest@127.0.0.1:5984');

var router = express.Router();
var conn = couchdb.use('pet_shop');


function get_products(req,res) {

    conn.view('produtos', 'get_all_produtos', function (err, body) {
        if (!err) {
            var json = {
                "Item": body.rows
            };
        }
        else {
            var json = {
                "Item": ""
            };
        }
        res.end(JSON.stringify(json));
    });
}
function insert_to_cart(req,res) {
    conn.insert({ Id_Prod: '1',Name: 'Test' },  function(err, body) {
        if (!err)
            console.log(body);
    });

}


/* GET home page. */
router.get('/', function (req, res, next) {

    res.writeHead(200, {'Content-Type': 'application/json'});
    //var pr = JSON.stringify(get_products());
    //console.log(pr);
    //insert_to_cart(req,res);
    //get_products(req,res);

});

module.exports = router;
