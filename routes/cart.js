/**
 * Created by  edgardoacosta.
 * 30/06/17.
 */

var express = require('express');
var couchdb = require('nano')('http://gest:gest@127.0.0.1:5984'), conn = couchdb.use('pet_shop');
var router = express.Router()

function load_producto(body, callback) {

    callback(json);
}
function load_producto2(product, callback) {


}

function get_cart(res, callback) {
    var json = [], cont = 0;
    conn.view('produtos', 'cart', {key: sess.Cart[1]}, function (err, body) {
        if (!err) {
            //console.log(body.rows.Id);£
            body.rows.forEach(function (item) {
                item.value.products.forEach(function (produto) {
                    conn.view('produtos', 'get_all_produtos', {key: produto.Id_Prod}, function (err, body2) {

                        if (!err) {
                            json.push(body2.rows[0]);
                            //console.log(json);
                        }
                    });
                });
            });
            //console.log("SizeProd->"+(body.rows[0].value.products).length);

            setTimeout(function() {
                if (json.length != 0) {
                    res.render('cart',
                        {
                            title: 'Pet Shop Cart',
                            products: json,
                            sess: sess
                        });
                }
            }, 100);




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
router.get('/', function (req, res, next) {
    sess = req.session;
    if (sess.Email) {
        if (sess.Cart) {
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