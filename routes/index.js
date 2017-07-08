var express = require('express');
var couchdb = require('nano')('http://gest:gest@127.0.0.1:5984');
var router = express.Router();
var conn = couchdb.use('pet_shop');
var session = require('express-session');
var sess;
var backPage;

function get_products(res, sess) {
    conn.view('produtos', 'get_all_produtos', function (err, body) {
        if (!err) {
            res.render('index',
                {
                    title: 'Pet Shop',
                    products: body.rows,
                    sess: sess
                }
            );
        }
        else {
            res.render('index',
                {
                    title: 'Pet Shop',
                    products: body.rows,
                    sess: sess
                }
            );
        }
    });
}
function insert_to_cart(req, res, prod) {
    var json = {};
    if (sess.Cart) {
        conn.view('produtos', 'cart', {key: sess.Cart[1]}, function (err, body) {
            if (!err) {
                var insert = [];
                body.rows.forEach(function (item) {
                    item.value.products.forEach(function (produto) {
                        insert.push({Id_Prod: produto.Id_Prod, Total: produto.Total});
                    });

                });
                insert.push({"Id_Prod": prod, "Total": 1});
                conn.get('_all_docs', {key: body.rows[0].key}, function (err, doc) {
                    sess.Cart[0] = doc.rows[0].value.rev
                    if (!err) {
                        //Update cart with new values
                        conn.insert(
                            {
                                _rev: sess.Cart[0], _id: sess.Cart[1],
                                "products": insert,
                                "Id_User": body.rows[0].value.Id_User, "date": body.rows[0].value.date, "Active": "1"
                            }, function (err, body2) {
                                if (!err) {
                                    sess.Prods = insert;
                                    sess.Cart = [body2.rev, body2.id];
                                    json = {
                                        "session": true,
                                        "insert": body2.ok
                                    }
                                    //Responde with status of CouchDB (True or False) on insert
                                    res.send(json);
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


                });

            }
        });
    }
    else {
        var date = new Date();
        //console.log("Cart don't exist");
        conn.insert(
            {
                "products": [{"Id_Prod": prod, "Total": 1}],
                "Id_User": sess.Id, "date": date, "Active": "1"
            }, function (err, body) {
                // console.log(body);
                if (!err) {
                    sess.Cart = [body.rev, body.id];
                    json = {
                        "session": true,
                        "insert": body.ok
                    }
                    //Responde with status of CouchDB (True or False) on insert
                    res.send(json);
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


}

/* GET home page. */
router.get('/', function (req, res, next) {
    sess = req.session;
    backPage = sess.Back;
    sess.Back = "/";
    get_products(res, sess);
});

router.post('/', function (req, res, next) {
    sess = req.session;
    backPage = sess.Back;
    sess.Back = "/";
    if (sess.Email) {
        insert_to_cart(req, res, req.body.Id_Prod);
    }
    else {
        var json = {"session": false, "insert": false};
        //res.send(json);
        res.redirect("/login");
        next;
    }
});


module.exports = router;
