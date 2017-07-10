var express = require('express');
var router = express.Router();
var couchdb = require('nano')('http://gest:gest@127.0.0.1:5984'),conn = couchdb.use('pet_shop');
var session = require('express-session');
var formidable = require('formidable');
var util = require('util');
var fs = require('fs');

router.get('/', (req, res, next)=> {
    let sess = req.session;
    if (sess.Type == 'user')
        res.redirect('/client/pets');
    else
        res.redirect('/');
});

router.get('/edit', (req, res, next) => {
    let sess = req.session;
    if (sess.Type == 'user') {
        let idUser = req.query.idUser;
        conn.view('all_users', 'get_clients', {key: idUser}, (err, body) => {
            let user = body.rows[0];
            console.log(body.rows[0]);
            res.render('edit_user', {title: 'Editar Usuario', user: user, sess: sess});
        });        
    } else 
        res.redirect('/');
});

router.get('/pets', (req, res, next) => {
    let sess = req.session;
    if (sess.Type == 'user') {
        let idUser = req.query.idUser;
        let pets = [];
        conn.view('pet', 'get_pet', (err, body) => {
            if (!err) {
                body.rows.forEach((pet) => {
                    if(pet.value.id_user == idUser)
                        pets.push(pet);
                });
                console.log(pets);
                res.render('pets', {title: 'O meus pets', pets: pets, idUser: idUser, sess: sess});
            }
        });
    } else
        res.redirect('/');
});

router.get('/pets/add', (req, res, next) => {
    let sess = req.session;
    if (sess.Type == 'user') {
        let idUser = req.query.idUser;
        res.render('add_pet', {title: 'Adicionar pet', idUser: idUser, sess: sess});
    } else 
        res.redirect('/');
});

router.get('/pets/edit', (req, res, next) => {
    let sess = req.session;
    if (sess.Type == 'user') {
        let id = req.query.id;
        conn.view('pet', 'get_pet', {key: id}, (err, body) => {
            let pet = body.rows[0];
            console.log(body.rows[0]);
            res.render('edit_pet', {title: 'Editar Pet', pet: pet, sess: sess});
        });        
    } else 
        res.redirect('/');
});

router.get('/pets/delete', (req, res, next) => {
    let sess = req.session;
    if (sess.Type == 'user') {
        let id = req.query.id;
        let rev = req.query.rev;
        let idUser = req.query.idUser;
        conn.destroy(id, rev, (err, body) => {
            res.redirect('/client/pets?idUser=' + idUser);
        });
    } else 
        res.redirect('/');
});

router.post('/edit_user', (req, res, next) => {
    var fields = [];
    var form = new formidable.IncomingForm();

    form.uploadDir = 'public/images/Users/';

    form.on('field', (field, value)=> {
        fields[field] = value;
    });
    form.on('file', (name, file)=> {
        fields[name] = file;
        fs.rename(file.path, form.uploadDir + "/" + file.name);
    });

    form.parse(req);

    form.on('end', function () {
        conn.insert({
            _rev: fields['rev'],
            Id_User: fields['idUser'],
            Type: 'user',
            Name: fields['nome'],
            Email: fields['email'],
            Password: fields['pass'],
            Phone: fields['telefone'],
            Photo: '/images/Pets/' + fields['photo'],
            Adress: fields['endereco'],
        }, fields['id'], (err, body)=> {
            if (!err) {
                res.redirect('/client/pets?idUser=' + fields['idUser']);
            }                
        });
    });
});

router.post('/edit_pet', (req, res, next) => {
    var fields = [];
    var form = new formidable.IncomingForm();

    form.uploadDir = 'public/images/Pets/';

    form.on('field', (field, value)=> {
        fields[field] = value;
    });
    form.on('file', (name, file)=> {
        fields[name] = file;
        fs.rename(file.path, form.uploadDir + "/" + file.name);
    });

    form.parse(req);

    form.on('end', function () {
        conn.insert({
            _rev: fields['rev'],
            Id_Pet: fields['id'],
            Name: fields['nome'],
            Age: fields['edade'],
            Race: fields['raca'],
            Photo: '/images/Pets/' + fields['photo'],
            Id_User: fields['idUser']
        }, fields['_id'], (err, body)=> {
            if (!err) {
                res.redirect('/client/pets?idUser=' + fields['idUser']);
            }                
        });
    });
});

router.post('/add_pet', (req, res, next) => {
    var fields = [];
    var form = new formidable.IncomingForm();

    form.uploadDir = 'public/images/Pets/';

    form.on('field', (field, value)=> {
        fields[field] = value;
    });
    form.on('file', (name, file)=> {
        fields[name] = file;
        fs.rename(file.path, form.uploadDir + "/" + file.name);
    });

    form.parse(req);

    form.on('end', function () {

        conn.view('pet', 'get_pet', {key: fields['id']}, (err, body)=> {
            if (!err) {
                if (body.rows.length > 0) {
                    console.log('Pet ja cadastrado');
                    res.redirect('/client/pets?idUser=' + fields['idUser']);
                } else {
                    conn.insert({
                        Id_Pet: fields['id'],
                        Name: fields['nome'],
                        Age: fields['edade'],
                        Race: fields['raca'],
                        Photo: '/images/Pets/' + fields['photo'],
                        Id_User: fields['idUser']
                    }, (err, body)=> {
                        if (!err) {
                            res.redirect('/client/pets/add?idUser=' + fields['idUser']);
                        }                
                    })
                }
            }
        });
    });
});

module.exports = router;