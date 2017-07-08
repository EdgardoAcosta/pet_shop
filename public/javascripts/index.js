/**
 * Manuel Francisco Haro Arroyo: 10223004
 * Edgardo Acosta Leal: 1022755
 * José Richard Tejedo Vega: 10222991
 * */


function show_more() {
    var show = document.getElementsByClassName('products_list'), i;
    for (var i = 0; i < show.length; i++) {
        show[i].style.display = 'block';
    }
    document.getElementById('show-more').style.display = 'none';
    document.getElementById('show-less').style.display = 'block';
}
function show_less() {
    var show = document.getElementsByClassName('products_list'), i;
    for (var i = 1; i < show.length; i++) {
        show[i].style.display = 'none';
    }
    document.getElementById('show-more').style.display = 'block';
    document.getElementById('show-less').style.display = 'none';
}
function add_product_to_cart(element) {
    var name;
    var value = parseInt($('#num_of_products').text());
    var element_toadd = $(element).closest('.col-lg-4').attr('id');
    name = $(element).closest('.col-lg-4').find('h4.card-title strong').text();

    var data = {};
    data.Id_User = '0';
    data.Id_Prod = element_toadd;
    data.Name_Prod = name;

    //POST to add values to cart
    $.ajax({
        type: 'POST',
        data: JSON.stringify(data),
        contentType: 'application/json',
        url: '/',
        success: function (data) {

            if (data.session) {
                if (data.insert) {
                    toastr.success("Added to cart");
                    if (value != NaN){
                        $('#num_of_products').text(value + 1);
                    }
                }
                else {
                    toastr.error("We can´t add your product to the cart");
                }
            }
            else {
                toastr.warning("Please login first");
            }
        }
    });
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


//Disable adding more than 1 item to cart, in cart can be change the number of items
    $(document).on('click', "a.addcart", function () {
        $(this).attr('style', 'pointer-events: none');
    });

    $('#row-prod0').show();

    $(document).on('click','#cloths',function () {
        $('.cloths').show();
        $('.food').hide();
        $('.accessories').hide();

    });
    $(document).on('click','#food',function () {
        $('.cloths').hide();
        $('.food').show();
        $('.accessories').hide();

    });
    $(document).on('click','#accesories',function () {
        $('.cloths').hide();
        $('.food').hide();
        $('.accessories').show();

    });
    $(document).on('click','#todos',function () {
        $('.cloths').show();
        $('.food').show();
        $('.accessories').show();
    });
});
