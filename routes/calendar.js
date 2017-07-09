/**
 * Manuel Francisco Haro Arroyo: 10223004
 * Edgardo Acosta Leal: 1022755
 * José Richard Tejedo Vega: 10222991
 * */

'use strict'

var express = require('express');
var couchdb = require('nano')('http://127.0.0.1:5984'), conn = couchdb.use('pet_shop');
var router = express.Router();
var url = require('url');
var session = require('express-session');
var sess;

router.get('/', (req, res, next) => {
    sess = req.session;

    conn.view('service', 'get_service', (error, body) => {
        if (!error) {
            res.render('calendar', {title: "Services' Calendar", sess: sess, services: body.rows});
        } else {
            res.render('calendar', {title: "Services' Calendar", sess: sess});
        }
    });

});

router.get('/day', (req, res, next) => {
    conn.view('calendar', 'get_day', (error, body) => {
        if (!error) {
            let query = url.parse(req.url, true).query, day = query.day, month = query.month, year = query.year, date, pets, users, services, dates = [];

            body.rows.forEach((element) => {
                date = new Date(element.value.date);

                if (date.getFullYear() == year && date.getMonth() == month && day == date.getDate()) {
                    dates.push(element.value);
                }
            });

            conn.view('service', 'get_service', (e, s) => {
                if (!e) {
                    services = s.rows;

                    conn.view('user', 'get_user_by_pet', (er, u) => {
                        if (!er) {
                            users = u.rows;

                            conn.view('pet', 'get_pet', (err, p) => {
                                if (!err) {
                                    pets = p.rows;

                                    res.send({
                                        'dates': dates,
                                        'users': users,
                                        'pets': pets,
                                        'services': services
                                    });
                                }
                            })
                        }
                    })
                }
            });
        }
    });
});

router.get('/pet', (req, res, next) => {
    conn.view('pet', 'get_pet', (error, body) => {
        if (!error) {
            res.send({
                'pets': body.rows
            });
        }
    });
});

router.get('/insert', (req, res, next) => {
    let query = url.parse(req.url, true).query, id_calendar = query.id, id_service = query.service, date = query.date;

    console.log(id_calendar, id_service, date);

    conn.insert({
        "Id": id_calendar,
        "Id_Service": id_service,
        "Id_Pet": null,
        "Date": date
    }, (error, body) => {
        if (!error) {
            console.log(body);
            res.send('done!!!');
        }
    });
});

router.get('/update', (req, res, next) => {
    let query = url.parse(req.url, true).query, id = query.id, rev = query.rev, id_calendar = query.id_calendar, id_service = query.id_service, id_pet = query.id_pet, date = query.date;

    conn.insert({
        "_rev": rev,
        "Id": id_calendar,
        "Id_Service": id_service,
        "Id_Pet": id_pet,
        "Date": date
    }, id, (error, body) => {
        if (!error) {
            console.log(body);
            res.send('done!!!');
        }
    });
});

module.exports = router;
