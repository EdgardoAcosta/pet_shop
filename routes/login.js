/**
 * Created by  edgardoacosta.
 * 03/07/17.
 */
var express = require('express');
var router = express.Router();
var couchdb = require('nano')('http://gest:gest@127.0.0.1:5984'),conn = couchdb.use('pet_shop');
var session = require('express-session');
var router = express.Router();

var sess;
function get_user(req,res,user,password) {
    conn.view('user', 'get_user',{ key: [user, password] }, function (err, body) {
        if (!err) {
            //Add values to session
            if(body.rows.length > 0) {
                sess = req.session;
                sess.Id = body.rows[0].value.Id;
                sess.Name = body.rows[0].value.Name;
                sess.Email = body.rows[0].value.Email;
                sess.Type = body.rows[0].value.Type;
                if (sess.Type == 'user')
                    res.redirect("/");
                else
                    res.redirect("/admin");
            }
            else {
                res.redirect(sess.Page);
                //res.send({error:"error"});
            }

        }
        else {
            res.send({error:"error"});
            console.log(err);
        }
    });
}


router.get('/', function (req, res, next) {
    sess = req.session;

    if (sess.Email){
        res.redirect("/");
        next;
    }
    else {
        res.render('login', {title: 'Login', sess: sess});
    }

});
router.get('/get_access', function (req, res, next) {
    var response = {
        user:req.query.id_User,
        password:req.query.password
    };
    get_user(req,res,response.user,response.password)
});

module.exports = router;