/**
 * Created by edgardoacosta on 22/05/17.
 */

function add_quantity(element) {
    console.log("add");
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
function rest_quantity(element) {
    console.log("rest");
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
function total_purchase() {
    var total = $('.total'), sum = 0;
    for (var i = 0; i < total.length; i++) {
        sum += parseFloat($(total[i]).text());
    }
    $('#total-purch').text("$R " + sum);

}
function finish_purch() {
    var response = confirm("Tu compra sera procesada");
    var data = [], rowData = {};
    //CHANGE TO USER ID FROM SESSION
    var user = 1;

    var id, sum;

    if (response) {
        alert("Compra concluida");
        window.location.replace("/");
        // toastr.success("purch done");

       /* $.ajax({
            url: "/cart/endPursh",
            type: "post",
            data: {'action': 'update', 'products': data, 'id_user': user},
            success: function (response) {
                var response = $.parseJSON(response);
                if (response.success == 1) {
                    toastr.success("Compra feita");
                }
                else if (response.success == 0) {
                    toastr.warning(response.msg);
                }

            },
            error: function (jqXHR, textStatus, errorThrown) {
                console.log(textStatus, errorThrown);
            }
        });*/


        /*
         $("#table-cart tr").not('#tr-Total').each(function () {
         rowData = {}
         id = $(this).attr("id");
         sum = $("#" + id).closest('tr').find('td span.quantity').text();
         rowData.Id = id;
         rowData.quantity = sum;
         data.push(rowData);
         });
         if (data.length > 0) {

         }
         else {
         toastr.warning("Sem produtos");
         }
         */
    }
    //toastr.success(response.msg);
    //window.location.replace("index.html");
    /*
     $.post("php/stock.php",{"products":data, "action":"subtract"}, function (response) {
     }, "json").done(function (response) {
     console.log(response);
     if (response.success == 1) {

     //$("#table-cart tr").remove();
     toastr.success(response.msg);
     //window.location.replace("index.html");
     }
     else {
     toastr.warning("Error in order");
     }

     }).fail(function (xhr) {
     console.log(xhr);
     });
     */


}

$(document).ready(function () {
    console.log("Cart.js");
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

    //Remove row on click of button X
    $(document).on('click', "button.btn-danger", function () {
        var id_pord = $(this).closest('tr').attr('id');
        $("#" + id_pord).remove();
    });
});
