var express = require('express');
var router = express.Router();
var couchdb = require('nano')('http://gest:gest@127.0.0.1:5984'),conn = couchdb.use('pet_shop');
var session = require('express-session');
var formidable = require('formidable');
var util = require('util');

router.get('/register/admin', (req, res, next)=> {
    let sess = req.session;
    if(sess.Type == 'admin')
        res.render('register_admin', {title: 'Cadastrar Administrador', sess: sess});
    else
        res.redirect('/');
});

router.get('/', (req, res, next)=> {
    let sess = req.session;
    if (sess.Type == 'admin')
        res.redirect('/admin/register/admin');
    else
        res.redirect('/');
});

router.post('/register_admin', (req, res, next) => {
    var fields = [];
    var form = new formidable.IncomingForm();

    form.on('field', (field, value)=> {
        fields[field] = value;
    });
    form.on('file', (name, file)=> {
        fields[name] = file;
    });

    form.parse(req);

    form.on('end', function () {
        conn.view('admins', 'get_admins', {key: fields['id']}, (err, body)=> {
            if (!err) {
                if (body.rows.length > 0) {
                    console.log('Administrador ya registrado');
                    res.redirect('/admin');
                } else {
                    conn.insert({
                        Id_User: fields['id'],
                        Type: 'admin',
                        Name: fields['nome'],
                        Password: fields['pass'],
                        Phone: fields['telefone'],
                        Email: fields['email'],
                        Photo: fields['photo']
                    }, (err, body)=> {
                        if (!err) {
                            res.redirect('/admin');
                        }                
                    })
                }
            }
        });
    });
});

module.exports = router;