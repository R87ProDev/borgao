$(".btn-clock").click(function() {
    $(".btn-clock").attr("disabled", true);
    $(".btn-clock").addClass("btn-disabled");
    $(".btn-declassify").hide();
});



$('#animal').attr('readonly', 'readonly');