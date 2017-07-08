/**
 * Created by  edgardoacosta.
 * 30/06/17.
 */

var express = require('express');
var couchdb = require('nano')('http://gest:gest@127.0.0.1:5984'), conn = couchdb.use('pet_shop');
var session = require('express-session');
var router = express.Router()

var sess;
var backPage;
function get_cart(res) {
    var json = [], cont = 0;
    conn.view('produtos', 'cart', {key: sess.Cart[1]}, function (err, body) {
        if (!err) {

            //User delete all items of cart
            if ((body.rows[0].value.products).length != 0) {

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

                setTimeout(function () {
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
                res.render('cart',
                    {
                        title: 'Pet Shop Cart',
                        products: json,
                        sess: sess
                    });
            }
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
function finish_pursh(res, req) {
    var json = {};
    conn.insert({_rev: sess.Cart[0], _id: sess.Cart[1], "Purshed": "0"}, function (err, body) {
        // console.log(body);
        if (!err) {
            req.session.destroy(function(err) {

            });
            console.log(sess);
            //Responde with status of CouchDB (True or False) on insert
            res.send(body.ok);
        }
        else {
            json = {
                "session": true,
                "insert": false
            }
            res.send(json);
            console.log(err);
        }
    });

}
function stock(res, Id_Prod, total) {
    conn.view('produtos', 'get_all_produtos', {key: Id_Prod}, function (err, body) {
        if (!err) {
            var values = body.rows[0];
            total = values.value.Stock - total;
            if (total < 0) {
                total = 0;
            }

            var json = {
                _rev: values.value.rev,
                _id: values.id,
                Id_Prod: values.value.Id,
                Type: values.value.Type,
                Name: values.value.Name,
                Description: values.value.Description,
                Price: values.value.Price,
                Stock: total.toString(),
                Photo: values.value.Photo
            };
            conn.insert(json, function (err, body) {
                if (!err) {
                    res.send(body.ok);
                }
                else {
                    console.log(err);

                }

            });


        }
    });
}
function update_cart(res, id_remove) {
    var empty_cart = false;
    conn.view('produtos', 'cart', {key: sess.Cart[1]}, function (err, body) {
        if (!err) {
            var json = [];
            var values = body.rows[0];
            var rev;

            conn.get('_all_docs', {key: values.key}, function (err, body) {

                if (!err) {
                    rev = body.rows[0].value.rev
                    console.log(rev);
                    values.value.products.forEach(function (item) {
                        if (item.Id_Prod != id_remove) {
                            json.push({Id_Prod: item.Id_Prod, Total: item.Total});
                        }
                        else {
                            console.log("Item removes was " + item.Id_Prod);
                            if (json.length == 0) {
                                console.log("empty cart");
                                empty_cart = true;
                            }
                        }
                    });
                }
            });

            setTimeout(function () {
                if (json.length > 0 || empty_cart) {
                    console.log(values.key);
                    console.log(values.id);
                    conn.insert({
                        _rev: rev, _id: values.id,
                        "products": json, "Id_User": values.value.Id_User, "date": values.value.date, "Active": "1"
                    }, function (err, body) {
                        if (!err) {
                            sess.Prods = json;
                            console.log(body)
                            res.send({error: 0, msg: "Item removed"});
                            //res.send(body.ok);
                        }
                        else {
                            res.send({error: 1, msg: "Error removing item"});
                            console.log(err);

                        }
                    });
                }
            }, 100);


        }
        else {
            res.send({error: 1, msg: "Error deleliting"});
        }
    });

}


router.get('/', function (req, res, next) {
    sess = req.session;
    backPage = sess.Back;
    sess.Back = "/cart";
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
router.post('/stock', function (req, res, next) {
    sess = req.session;
    backPage = sess.Back;
    sess.Back = "/cart";
    if (sess.Email) {
        if (sess.Cart) {
            stock(res, req.body.id_prd, req.body.total);
        }
        else {
            res.redirect('/');

        }
    }
    else {
        res.redirect('/login');
    }
});
router.post('/update_cart', function (req, res, next) {
    debugger
    sess = req.session;
    backPage = sess.Back;
    sess.Back = "/cart";
    if (sess.Email) {
        if (sess.Cart) {
            debugger
            update_cart(res, req.body.id_remove);
        }
        else {
            res.redirect('/');

        }
    }
    else {
        res.redirect('/login');
    }
});
router.post('/', function (req, res, next) {
    sess = req.session;
    backPage = sess.Back;
    sess.Back = "/cart";
    if (sess.Email) {
        if (sess.Cart) {
            finish_pursh(res, req);
        }
        else {
            res.redirect('/');

        }
    }
    else {
        res.redirect("/login");
        next;
    }

});
module.exports = router;