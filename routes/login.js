/**
 * Created by  edgardoacosta.
 * 03/07/17.
 */
var express = require('express');
var router = express.Router();
var couchdb = require('nano')('http://gest:gest@127.0.0.1:5984'), conn = couchdb.use('pet_shop');
var session = require('express-session');
var router = express.Router();

var sess;
var backPage;
function get_user(req, res, user, password) {
    conn.view('all_users', 'get_all_users', {key: [user, password]}, function (err, body) {
        if (!err) {
            //Add values to session
            if (body.rows.length > 0) {
                sess = req.session;
                sess.Id = body.rows[0].id;
                sess.Name = body.rows[0].value.Name;
                sess.Email = body.rows[0].value.Email;
                sess.Type = body.rows[0].value.Type;
                conn.view('all_users', 'user_cart', {key: body.rows[0].id}, function (err, usr) {
                    if (!err) {
                        if (usr.rows.length > 0) {
                            sess.Cart = [usr.rows[0].id, usr.rows[0].id];
                            sess.Prods = usr.rows[0].value.products;
                        }
                    }
                    else {
                        console.log(err);
                    }
                    res.send({status: 0, msg: "Welcome back " + (body.rows[0].value.Name).toUpperCase()});
                });
            }
            else {
                res.send({status: 1, msg: "User invalid"});

            }

        }
        else {
            res.send({msg: "Error geting data"});
            console.log(err);
        }
    });
}


router.get('/', function (req, res, next) {
    sess = req.session;
    backPage = sess.Back;
    sess.Back = "/login";
    if (sess.Email) {
        res.redirect(backPage);
        next;
    }
    else {
        res.render('login', {title: 'Login', sess: sess});
    }

});
router.get('/get_access', function (req, res, next) {

    get_user(req, res, req.query.id_User, req.query.password)
});

module.exports = router;