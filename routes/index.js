var express = require('express');
var couchdb = require('nano')('http://gest:gest@127.0.0.1:5984');
var router = express.Router();
var conn = couchdb.use('pet_shop');
var session = require('express-session');


function get_products(res) {
    var json = {};
    conn.view('produtos', 'get_all_produtos', function (err, body) {
        if (!err) {
            json = {
                "Item": body.rows
            };
            res.render('index',
                {
                    title: 'Pet Shop',
                    products:  body.rows
                }
            );
            //return callback(JSON.stringify(json));

        }
        else {
            json = {
                "Item": ""
            };
            res.render('index',
                {
                    title: 'Pet Shop',
                    products: json
                }
            );
            //return callback(JSON.stringify(json));
        }
    });
}
function insert_to_cart(req,res,prod,prod_name,id_user) {
    if (sess.Cart){
        console.log("Cart exist");
        conn.insert(
            { "products":
                {"Id_Prod": prod,"Name": prod_name},
                "Id_User": id_user
            },  function(err, body)
            {
                if (!err) {
                    //Responde with status of CouchDB (True or False) on insert
                    res.send(body.ok);
                }
                else {
                    res.send(false);
                    console.log(err);
                }
            });
    }
    else {
        console.log("Cart don't exist");
        conn.insert(
            { "products":
                {"Id_Prod": prod,"Name": prod_name},
                "Id_User": id_user
            },  function(err, body)
            {
                if (!err) {
                    //Responde with status of CouchDB (True or False) on insert
                    console.log(body)
                    //sess.Cart = body
                    res.send(body.ok);
                }
                else {
                    res.send(false);
                    console.log(err);
                }
            });
    }



}
var sess;
/* GET home page. */
router.get('/', function (req, res, next) {

    get_products(res);
});

router.post('/', function(req, res){
    sess = req.session;
    if(sess.Email) {
        console.log("Session exist");
        console.log(sess);
        insert_to_cart(req,res, req.body.Id_Prod, req.body.Name_Prod, sess.Id);

    }
    else {
        console.log("No Session");
        res.redirect('/login');
    }
});


module.exports = router;
