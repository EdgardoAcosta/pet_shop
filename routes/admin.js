var express = require('express');
var router = express.Router();
var couchdb = require('nano')('http://gest:gest@127.0.0.1:5984'),conn = couchdb.use('pet_shop');
var session = require('express-session');

router.get('/register/admin', (req, res, next)=> {
    let sess = req.session;
    res.render('register_admin', sess);
});

router.get('/', (req, res, next)=> {
    res.redirect('/admin/register/admin');
});

router.post('/register_admin', (req, res, next) => {
    let id = req.body.id;
    let type = 'admin';
    let password = req.body.pass;
    let name = req.body.nome;
    let photo = req.body.photo;
    let phone = req.body.telefone;
    let email = req.body.email;

    conn.view('admins', 'get_admins', {key: id}, (err, body)=> {
        if (!err) {
            if (body.rows.length > 0) {
                console.log('Administrador ya registrado');
                res.redirect('/admin');
            }
        } else {
            conn.insert({
                Id_User: id,
                Type: type,
                Name: name,
                Password: password,
                Phone: phone,
                Email: email,
                Photo: photo
            }, (err, body)=> {
                if (!err) {
                    res.redirect('/admin');
                }                
            })
        }
    });
});

module.exports = router;