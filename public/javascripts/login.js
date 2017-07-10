/**
 * Created by  edgardoacosta.
 * 07/07/17.
 */


$(document).ready(function () {
    toastr.options = {
        "closeButton": false,
        "debug": false,
        "newestOnTop": true,
        "progressBar": false,
        "positionClass": "toast-top-right",
        "preventDuplicates": false,
        "onclick": null,
        "showDuration": "300",
        "hideDuration": "1000",
        "timeOut": "2000",
        "extendedTimeOut": "1000",
        "showEasing": "swing",
        "hideEasing": "linear",
        "showMethod": "fadeIn",
        "hideMethod": "fadeOut"
    }

    //Send data to server to authenticate user
    $('#get_access').submit(function (event) {
        event.preventDefault();

        var datos = $('#get_access').serializeArray();
        $.get("/login/get_access", datos, function (result) {
        }, 'json').done(function (result) {
            //User and Passowrd correct
            if (result.status == 0) {
                toastr.success(result.msg);
                //Delay to show message of welcomeback
                setTimeout(function () {
                    if (result.userType == 'user'){
                        window.location.replace("/");
                    }else {
                        window.location.replace("/admin");
                    }
                }, 200);

            }
            //On parameter invalid show error
            else {

                toastr.error(result.msg);
            }

        }).fail(function (xhr) {
            //Error in connection
            toastr.warning(" ", "Error in connection");
        });


    });
    $('#new_user').submit(function (event) {
        event.preventDefault();

        var datos = $('#new_user').serializeArray();
        $.get("/login/new_user", datos, function (result) {
        }, 'json').done(function (result) {
            //User and Passowrd correct
            if (result.error == 0) {
                toastr.success(result.msg);
                //Delay to show message of welcomeback
                setTimeout(function () {
                    window.location.replace("/");
                }, 200);

            }
            //On parameter invalid show error
            else {

                toastr.error(result.msg);
            }

        }).fail(function (xhr) {
            //Error in connection
            toastr.warning(" ", "Error in connection");
        });


    });

});