$('.fa-instagram').click(function (event) {
        $('#photo-file').click();
    });

$('#photo-file').change(function (event) {
    var text = $(this).val();
    $('#photo').val(text);
}); 