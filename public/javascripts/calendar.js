/**
 * Manuel Francisco Haro Arroyo: 10223004
 * Edgardo Acosta Leal: 1022755
 * José Richard Tejedo Vega: 10222991
 * */

var months = [
    'Janeiro',
    'Fevereiro',
    'Março',
    'Abril',
    'Maio',
    'Junho',
    'Julho',
    'Agosto',
    'Setembro',
    'Outubro',
    'Novembro',
    'Dezembro'
];

var days = [
    'Dom',
    'Seg',
    'Ter',
    'Qua',
    'Qui',
    'Sex',
    'Sab'
];

var id_calendar, rev_calendar, id_service, date, id;

function updateIdCalendar(element) {
    rev_calendar = $(element).data('rev');
    id = $(element).data('id');
    id_calendar = $(element).data('calendar');
    id_service = $(element).data('service');
    date = $(element).data('date');
}

function removeReservation(element) {
    updateIdCalendar(element);
    updateCalendar(null);
}

function updateCalendar(element) {
    var id_pet = null;

    if (element) {
        id_pet = $(element).data('id');
    }

    $.ajax({
        url: 'http://localhost:3000/calendar/update',
        type: 'GET',
        dataType: 'JSON',
        crossDomain: true,
        data: {
            'rev': rev_calendar,
            'id': id,
            'id_calendar': id_calendar,
            'id_service': id_service,
            'id_pet': id_pet,
            'date': date
        }
    })
    .done((data) => {
        $('.calendar-main .date-days .date-row a.selected').click();
    })
    .fail((error) => {
        $('.calendar-main .date-days .date-row a.selected').click();
    });
}

function createCalendarOf(month = "", year = "") {
    var now = new Date(); //current date

    //if the parameters don't have values, so they get values of the current date
    month = (month != '0' && month == "") ? now.getMonth() : month;
    year = year == "" ? now.getFullYear() : year;

    var nextDate = new Date(year, (month + 1), 1);
    var prevDate = new Date(year, (month - 1), 1);

    var html = //code to replace to calendar
        '<div class="name-month">' +
        '<h1>' + months[month] + '</h1>' +
        '<h4>' + year + '</h4>' +

        '<a href="#" class="next changer" data-year="' + nextDate.getFullYear() + '" data-month="' + nextDate.getMonth() + '">' +
        '<i class="fa fa-angle-double-right fa-2x" aria-hidden="true"></i>' +
        '</a>';

    html +=
        '<a href="#" class="previous changer ' + (now.getMonth() == month && now.getFullYear() == year ? 'disabled' : '') +
        '" data-year="' + prevDate.getFullYear() + '" data-month="' + prevDate.getMonth() + '">' +
        '<i class="fa fa-angle-double-left fa-2x" aria-hidden="true"></i>' +
        '</a>' +
        '</div>' +

        '<div class="week-days">' +
        '<div class="date-row">';

    for (let d = 0; d < days.length; d++) {
        html += '<span>' + days[d] + '</span>';
    }

    html += '</div></div>';

    var numberDaysMonth = new Date(year, (month + 1), 0).getDate(); //number of days of month

    var numberFirstDay = new Date(year, month, 1).getDay(); //value of first day of month

    var numberBoxDays = numberDaysMonth + numberFirstDay <= 35 ? 35 : 42; //number of spaces occupied by the month

    var counter = 1;

    html += '<div class="date-days">';

    for (let box = 1; box <= numberBoxDays; box++) {
        if (box % 7 == 1) {
            html += '<div class="date-row">';
        }

        if (box >= (numberFirstDay + 1) && box <= numberDaysMonth + numberFirstDay) {
            let aux = new Date(year, month, (counter + 1));

            if (aux.getTime() >= now.getTime()) {
                html += '<a href="#" data-month="' + aux.getMonth() + '" data-year="' + aux.getFullYear() + '">' + counter + '</a>';
            } else {
                html += '<a href="#" class="disabled">' + counter + '</a>';
            }

            counter++;
        } else {
            html += '<div class="not-day"></div>';
        }

        if (box % 7 == 0) {
            html += '</div>';
        }
    }

    html += '</div>';

    $('.calendar-main').html(html);
}

function changeCalender() {
    $('.changer:not(.disabled)').click(function (event) {
        createCalendarOf($(this).data('month'), $(this).data('year'));
        selectDay();
        changeCalender();
    });
}

function selectDay() {
    $('.calendar-main .date-days .date-row a:not(.disabled)').click(function () {
        $('.calendar-main .date-days .date-row a.selected').css({
            'border': 'none',
            'line-height': '50px'
        }).removeClass('selected');

        $(this).css({
            'border': '5px solid rgba(195, 197, 194, .7)',
            'line-height': '45px'
        }).addClass('selected');

        let day = $(this).text(), month = $(this).data('month'), year = $(this).data('year');

        $.ajax({
            url: 'http://localhost:3000/calendar/day',
            type: 'GET',
            dataType: 'JSON',
            crossDomain: true,
            data: {
                'day': day,
                'month': month,
                'year': year
            }
        })
        .done((data) => {
            var element = $('#reservation-table'), name = element.data('name'), type = element.data('type');

            let date, service, pet, user, services = [], pets = [], users = [], html = "";

            data.services.forEach((e) => {
                services[e.key] = e.value;
            });

            data.pets.forEach((e) => {
                pets[e.key] = e.value;
            });

            data.users.forEach((e) => {
                users[e.key] = e.value;
            });

            function getFormat(a) {
                return `${a < 10 ? `0${a}` : a}`;
            }

            data.dates.forEach((element) => {
                date = new Date(element.date);
                service = services[element.id_service];

                html += `<tr><td scope="row">${getFormat(date.getHours())}h${getFormat(date.getMinutes())}</td>` +
                    `<td><img src="${service.photo}"></td>`;

                if (element.id_pet) {
                    pet = pets[element.id_pet];
                    user = users[pet.id_user];

                    html += `<td><img src="${pet.photo}"></td>`;
                    html += `<td><p class="text-warning">Reservado por ${user.Name}</p></td>`;
                    html += '<td>';

                    if (type == 'admin') {
                        html += '<button class="btn btn-floating waves-effect wave-light orange" type="button" data-toggle="modal" data-target="#pet-modal"' +
                                `data-id="${element.id}" data-rev="${element.rev}" data-calendar="${element.id_calendar}" data-service="${element.id_service}"` +
                                `data-date="${element.date}" onclick="updateIdCalendar(this)">` +
                                    '<i class="fa fa-pencil"></i>' +
                                '</button>' +

                                '<button class="btn btn-floating waves-effect wave-light red accent-3" type="button"' +
                                `data-id="${element.id}" data-rev="${element.rev}" data-calendar="${element.id_calendar}" data-service="${element.id_service}"` +
                                `data-date="${element.date}" onclick="removeReservation(this)">` +
                                    '<i class="fa fa-trash"></i></a>' +
                                '</button>';
                    } else if (name == user.Name) {
                        html += '<button class="btn btn-floating waves-effect wave-light blue accent-3" type="button" data-toggle="modal" data-target="#pet-modal"' +
                                `data-id="${element.id}" data-rev="${element.rev}" data-calendar="${element.id_calendar}" data-service="${element.id_service}"` +
                                `data-date="${element.date}" onclick="updateIdCalendar(this)">` +
                                    '<i class="fa fa-pencil"></i>' +
                                '</button>' +

                                '<button class="btn btn-floating waves-effect wave-light red accent-2" type="button"' +
                                `data-id="${element.id}" data-rev="${element.rev}" data-calendar="${element.id_calendar}" data-service="${element.id_service}"` +
                                `data-date="${element.date}" onclick="removeReservation(this)">` +
                                    '<i class="fa fa-times"></i>' +
                                '</button>';
                    }

                    html += '</td>';
                } else if (type) {
                    html += '<td colspan="3">' +
                                '<button class="btn btn-floating waves-effect wave-light blue accent-3" type="button" data-toggle="modal" data-target="#pet-modal"' +
                                `data-id="${element.id}" data-rev="${element.rev}" data-calendar="${element.id_calendar}" data-service="${element.id_service}"` +
                                `data-date="${element.date}" onclick="updateIdCalendar(this)">` +
                                    '<i class="fa fa-plus fa-2x"></i>' +
                                '</button>' +
                            '</td>';
                } else {
                    html += '<td colspan="3"></td>';
                }

                html += '</tr>';
            });

            element.html(html);
        })
        .fail(() => {
            console.log("error");
        });
    });
}

$(document).ready(function() {
	createCalendarOf();
	changeCalender();
	selectDay();

    var table = $('#pet-table'), user_id = table.data('id'), user_type = table.data('type');

    if (typeof user_id != 'undefined') {
        $.ajax({
            url: 'http://localhost:3000/calendar/pet',
            type: 'GET',
            dataType: 'JSON',
            crossDomain: true,
            data: {}
        })
        .done((data) => {
            var html = "";

            data.pets.forEach((element) => {
                if (user_type == 'admin' || element.value.id_user == user_id) {
                    html += '<tr>' +
    			 				'<td>' +
    			 					'<button class="close btn btn-floating blue accent-3 adder-pet" data-dismiss="modal" aria-label="close"' +
                                    `type="button" data-id="${element.value.id}" onclick="updateCalendar(this)">` +
    			 						'<i class="fa fa-plus fa-2x"></i>' +
    			 					'</button>' +
    		 					'</td>' +
    			 				`<td><img src="${element.value.photo}"></td>` +
    			 				`<td>${element.value.name}</td>` +
                            '</tr>';
                }
            });

            table.html(html);
        })
        .fail(() => {
            console.log("error");
        });
    }

    $('.mdb-select').material_select();

    $('#form-service-modal').submit((event) => {
        event.preventDefault();

        var date = $('.calendar-main .date-days .date-row a.selected'), day = date.text(), month = date.data('month'), year = date.data('year');

        var currentDate = new Date(year, month, day, $('#select-hour').val(), $('#select-minute').val());

        data = {
            'id': $('#text-id').val(),
            'service': $('#select-service').val(),
            'date': currentDate.toISOString()
        };

        $.ajax({
            url: 'http://localhost:3000/calendar/insert',
            type: 'GET',
            dataType: 'JSON',
            crossDomain: true,
            data: data
        })
        .done((data) => {
            date.click();
            $('#service-modal').modal('hide');
        })
        .fail((error) => {
            date.click();
            $('#service-modal').modal('hide');
        });
    })

    $('.calendar-main .date-days .date-row a:not(.disabled):first').click();
});
