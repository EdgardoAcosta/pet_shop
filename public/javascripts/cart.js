/**
 * Created by edgardoacosta on 22/05/17.
 */




function add_quantity(element) {
    var value = "#" + $(element).closest('tr').attr('id');
    var actual_price = parseFloat($(value).closest('tr').find('td.price').text());
    var quiantity = parseInt($(value).closest('tr').find('td span.quantity').text()) + 1;


}
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
        delete_row(user);
        alert("Compra concluida");
        window.location.replace("index.html");
        // toastr.success("purch done");


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
         $.ajax({
         url: "php/cart.php",
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
         });
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

function delete_row(id_us) {
    var open = indexedDB.open("pet_shop", 1);

    open.onsuccess = function () {
        var db = open.result;
        var trans = db.transaction("cart", "readwrite");
        var store = trans.objectStore("cart");
        var index = store.index('user_prod');
        var request = index.openCursor(IDBKeyRange.only([id_us, "1"]));
        request.onsuccess = function (event) {
            var cursor = event.target.result;
            if (cursor) {
                //console.log(cursor.value.Id);
                cursor.delete(cursor.primaryKey);
                cursor.continue();

            }
            else {
                //End of cursor
                //console.log("finish");
            }
        }
    }
}
function check_stock(id_prod, quantity) {


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
    // Open (or create) the database


    //CHANGE TO USER ID FROM SESSION

    get_cart(id_usr);

    //Remove row on click of button X
    $(document).on('click', "button.btn-danger", function () {
        var id_pord = $(this).closest('tr').attr('id');
        $("#" + id_pord).remove();


        var open = indexedDB.open("pet_shop", 1);

        open.onsuccess = function () {
            console.log("entro 1");
            var db = open.result;
            var trans = db.transaction("cart", "readwrite");
            var store = trans.objectStore("cart");
            var index = store.index('user_prod');
            var request = index.openCursor(IDBKeyRange.only([id_usr, "1"]));
            request.onsuccess = function (event) {
                var cursor = event.target.result;
                if (cursor) {
                    //console.log(cursor.value.Id);
                    if (cursor.primaryKey == id_pord) {
                        cursor.delete(cursor.primaryKey);
                    }
                    cursor.continue();

                }
                else {
                    console.log("finish");
                }
            }
        }
        /*
         //CHANGE FOR THE USER ID IN SESSION
         var id_user = 1;
         var db = open.result;
         var trans = db.transaction("cart", "readwrite");
         var store = trans.objectStore("cart");
         var index = store.index('user_prod');
         //var request = index.openCursor(IDBKeyRange.only([id_user, "1"]));

         //request = store.delete(id_pord);

         //var request = db.transaction("cart", "readwrite").objectStore("cart").delete(id_pord);

         var request = db.transaction(["cart"], "readwrite").objectStore("cart").delete(id_pord);
         request.onsuccess = function(event) {
         // It's gone!
         console.log(event);
         console.log("Eliminado " + id_pord);
         toastr.success("Deleted");
         };

         */
    });


});
