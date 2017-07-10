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

router.get('/manage/products/delete', (req, res, next) => {
    let sess = req.session;
    if (sess.Type == 'admin') {
        let id = req.query.id;
        let rev = req.query.rev;
        conn.destroy(id, rev, (err, body) => {
            res.redirect('/admin/manage/products');
        });
    } else {
        res.redirect('/');
    }
});

router.post('/edit_product', (req, res, next) => {
    var fields = [];
    var form = new formidable.IncomingForm();

    form.uploadDir = 'public/images/Categories/';

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
            Id_Prod: fields['idProd'],
            Type: fields['tipo'],
            Name: fields['nome'],
            Description: fields['descricao'],
            Price: fields['preco'],
            Stock: fields['quantidade'],
            Photo: '/images/Categories/' + fields['photo']
        }, fields['id'], (err, body)=> {
            if (!err) {
                res.redirect('/admin/manage/products');
            }                
        });
    });
});

router.post('/register_service', (req, res, next) => {
    var fields = [];
    var form = new formidable.IncomingForm();

    form.uploadDir = 'public/images/Services/';

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
            Id_Service: fields['id'],
            Name: fields['nome'],
            Description: fields['descricao'],
            Price: fields['preco'],
            Photo: '/images/Services/' + fields['photo']
        }, (err, body)=> {
            if (!err) {
                res.redirect('/admin/register/service');
            }                
        });
    });
});

router.post('/register_product', (req, res, next) => {
    var fields = [];
    var form = new formidable.IncomingForm();

    form.uploadDir = 'public/images/Categories/';

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
            Id_Prod: fields['id'],
            Type: fields['tipo'],
            Name: fields['nome'],
            Description: fields['descricao'],
            Price: fields['preco'],
            Stock: fields['quantidade'],
            Photo: '/images/Categories/' + fields['photo']
        }, (err, body)=> {
            if (!err) {
                res.redirect('/admin/register/product');
            }                
        });
    });
});

router.post('/register_client', (req, res, next) => {
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

        conn.view('all_users', 'get_clients', {key: fields['id']}, (err, body)=> {
            if (!err) {
                if (body.rows.length > 0) {
                    console.log('Cliente ya registrado');
                    res.redirect('/admin');
                } else {
                    conn.insert({
                        Id_User: fields['id'],
                        Type: 'admin',
                        Name: fields['nome'],
                        Password: fields['pass'],
                        Phone: fields['telefone'],
                        Email: fields['email'],
                        Adress: fields['endereco'],
                        Photo: '/images/Users/' + fields['photo']
                    }, (err, body)=> {
                        if (!err) {
                            res.redirect('/admin/register/client');
                        }                
                    })
                }
            }
        });
    });
});

router.post('/register_admin', (req, res, next) => {
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

        conn.view('all_users', 'get_admins', {key: fields['id']}, (err, body)=> {
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
                        Photo: '/images/Users/' + fields['photo']
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