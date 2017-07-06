/**
 * Created by  edgardoacosta.
 * 30/06/17.
 */

var express = require('express');
var couchdb = require('nano')('http://gest:gest@127.0.0.1:5984'),conn = couchdb.use('pet_shop');
var router = express.Router()

function get_cart(res) {
    var json = [];
    conn.view('produtos', 'cart', {key: sess.Cart[1]}, function (err, body) {
        if (!err) {
            //console.log(body.rows.Id);
            body.rows.forEach(function (item) {
                console.log(item);
                /*conn.view('produtos', 'get_all_produtos', {key: body.rows.Id}, function (err, body2) {
                    if (!err){

                        json.push(body2.rows.value);
                    }

                });*/
            });

            res.render('cart',
                {
                    title: 'Pet Shop Cart',
                    products: json,
                    sess: sess
                });

            }
        else {
            json = {
                "Item": ""
            };
            res.render('cart',
                {
                    title: 'Pet Shop',
                    products: json,
                    sess: sess
                }
            );
            //return callback(JSON.stringify(json));
        }
        });
}

var sess
router.get('/', function(req, res, next) {
    sess = req.session;
    if(sess.Email){
        if (sess.Cart){
            get_cart(res);
        }
        else {
            res.redirect('/');

        }
    }
    else {
        res.redirect('/login');
    }
});

module.exports = router;