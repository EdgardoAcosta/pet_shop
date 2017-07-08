$('.fa-instagram').click(function (event) {
        $('#photo-file').click();
    });

$('#photo-file').change(function (event) {
    var text = $(this).val();
    var a = text.split("\\");
    $('#photo').val(a[a.length-1]);
}); 