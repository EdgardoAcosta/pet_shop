/**
 * Created by edgardoacosta on 22/05/17.
 */

//Update value on click
function add_quantity(element) {
    var value = "#" + $(element).closest('tr').attr('id');
    var actual_price = parseFloat($(value).closest('tr').find('td.price').text());
    var quiantity = parseInt($(value).closest('tr').find('td span.quantity').text()) + 1;
    var stock = parseInt($(value).closest('tr').find('td span.stock').text());

    if (stock >= quiantity) {
        var total = $(element).closest('tr').find('td.total').text(actual_price * quiantity);
        $(value).closest('tr').find('td span.quantity').text(quiantity);
        total_purchase();
    }
    else {
        quiantity = parseInt($(value).closest('tr').find('td span.quantity').text());
        $(value).closest('tr').find('td span.quantity').text(quiantity);
        toastr.warning("Cant add more that the Stock");
    }


}
//Update value on click
function rest_quantity(element) {
    var value = "#" + $(element).closest('tr').attr('id');
    var actual_price = parseFloat($(value).closest('tr').find('td.price').text());
    var quiantity = parseInt($(value).closest('tr').find('td span.quantity').text()) - 1;
    if (quiantity < 0) {
        quiantity = 0;
    }
    var total = $(element).closest('tr').find('td.total').text(actual_price * quiantity);
    $(value).closest('tr').find('td span.quantity').text(quiantity);
    total_purchase()
}
//Calculate total value of order
function total_purchase() {
    var total = $('.total'), sum = 0;
    for (var i = 0; i < total.length; i++) {
        sum += parseFloat($(total[i]).text());
    }
    $('#total-purch').text("$R " + sum);

}
//Updete pursh and finish proces
function finish_purch() {
    var response = confirm("Ready to order?");
    if (response) {
        var totol_each, id_prd;
        $('td span.quantity').each(function () {
            totol_each = parseInt($(this).text());
            id_prd = $(this).closest('tr').attr('id');
            $.ajax({
                type: 'POST',
                url: '/cart/stock',
                data: {id_prd: id_prd, total: totol_each},
                //Update stock
                success: function (response) {
                    console.log("Stock updated");
                    //End purshe

                },
                error: function (jqXHR, textStatus, errorThrown) {
                    toastr.error("Error finishing order");
                    //console.log(textStatus, errorThrown);
                }
            });


        });
        $.ajax({
            type: 'POST',
            url: '/cart',
            success: function (response) {
                if (response){
                    toastr.success("Order places");
                    alert("End of ordering");
                    window.location.replace("/logout");
                }
            },
            error: function (jqXHR, textStatus, errorThrown) {
                toastr.error("Error finishing order");
                //console.log(textStatus, errorThrown);
            }
        });
    }
}
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
    total_purchase();
    //Remove row on click of button X
    $(document).on('click', "button.btn-danger", function () {
        var id_pord = $(this).closest('tr').attr('id');
        $.ajax({
            type: 'POST',
            url: '/cart/update_cart',
            data: { id_remove : id_pord},
            success: function (response) {
                if (response.error == 0){
                    toastr.success(response.msg);
                    $("#" + id_pord).remove();
                }
                else {
                    toastr.error(response.msg);
                }
            },
            error: function (jqXHR, textStatus, errorThrown) {
                toastr.error("Error finishing order");
            }
        });
    });


});
