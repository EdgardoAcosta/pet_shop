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
                sess.Id_User = body.rows[0].value.Id;
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
                    res.send({
                        status: 0, msg: "Welcome back " + (body.rows[0].value.Name).toUpperCase(),
                        userType:body.rows[0].value.Type
                    });
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
function new_user(req, res, user) {
    var id_us = "0";
    conn.view('all_users', 'count_users', function (err, body) {
        if (!err) {
            if ((body.rows).length > 0) {
                user.Id_User = (body.rows[0].value).toString();
                conn.insert(user, function (err, insert) {
                    if (!err) {
                        console.log(insert);
                        sess = req.session;
                        sess.Id = insert.id;
                        sess.Name = user.Name;
                        sess.Email = user.Email;
                        sess.Type = user.Type;

                        res.send({error: 0, msg: "Welcome " + user.Name.toUpperCase()});
                    }
                    else {
                        res.send({error: 1, msg: "Error adding user"});
                    }
                });
            }
            else {
                user.Id_User = id_us;
                conn.insert(user, function (err, body) {
                    if (!err) {
                        res.send({error: 0, msg: "Welcome " + user.Name.toUpperCase()});
                    }
                    else {
                        res.send({error: 1, msg: "Error adding user"});
                    }
                });
            }

        }
        else {
            res.send({error: 1, msg: "Error adding user"});

        }
    });
    console.log(user);
    /**/


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
router.get('/new_user', function (req, res, next) {
    var nUser = {
        "Id_User": "",
        "Type": req.query.type,
        "Name": req.query.name,
        "Email": req.query.email,
        "Password": req.query.password,
        "Phone": req.query.phone,
        "Adress": req.query.address
    }
    new_user(req, res, nUser);
});

module.exports = router;