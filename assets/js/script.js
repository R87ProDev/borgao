/* Clock */
$(".btn-clock").click(function() {
    $(".btn-clock").attr("disabled", true);
    $(".btn-clock").addClass("btn-disabled");
    $(".btn-declassify").hide();
});

/* Bloqueia o teclado mobile */
$('.input-data').attr('readonly', 'readonly');

$(document).ready(function() {
    stateNote()
    $(".clear-animal").hide()
    $(".clear-competitor").hide()
    localStorage.setItem("typeNote", "animal")
})

const stateNote = (stateType = localStorage.getItem("typeNote")) => {
    let numberLength = $(`#${stateType}`).val().length;
    console.log("entro")

    $("#number-3").attr("disabled", true);
    $("#number-4").attr("disabled", true);
    $("#number-5").attr("disabled", true);
    $("#number-6").attr("disabled", true);
    $("#number-7").attr("disabled", true);
    $("#number-8").attr("disabled", true);
    $("#number-9").attr("disabled", true);
    $("#number-25").attr("disabled", true);
    $("#number-50").attr("disabled", true);
    $("#number-75").attr("disabled", true);

}

const dataNumber = (number, noteType = localStorage.getItem("typeNote")) => {
    let numberLength = $(`#${noteType}`).val().length;
    $(".clear-animal").show()
    if (numberLength === 0) {
        $(`#${noteType}`).val(number)
        $(`.clear-${localStorage.getItem("typeNote")}`).show()
        if ($(`#${noteType}`).val() == 1) {
            $("#number-3").attr("disabled", false);
            $("#number-4").attr("disabled", false);
            $("#number-5").attr("disabled", false);
            $("#number-6").attr("disabled", false);
            $("#number-7").attr("disabled", false);
            $("#number-8").attr("disabled", false);
            $("#number-9").attr("disabled", false);
            $("#number-25").attr("disabled", true);
            $("#number-50").attr("disabled", true);
            $("#number-75").attr("disabled", true);
        } else if ($(`#${noteType}`).val() == 2) {
            $("#number-3").attr("disabled", false);
            $("#number-4").attr("disabled", false);
            $("#number-5").attr("disabled", false);
            $("#number-6").attr("disabled", true);
            $("#number-7").attr("disabled", true);
            $("#number-8").attr("disabled", true);
            $("#number-9").attr("disabled", true);
            $("#number-25").attr("disabled", true);
            $("#number-50").attr("disabled", true);
            $("#number-75").attr("disabled", true);
        }

    } else if (numberLength === 1) {
        $(`#${noteType}`).val($(`#${noteType}`).val() + number + ',')
        $("#number-1").attr("disabled", true);
        $("#number-2").attr("disabled", true);
        $("#number-3").attr("disabled", true);
        $("#number-4").attr("disabled", true);
        $("#number-5").attr("disabled", true);
        $("#number-6").attr("disabled", true);
        $("#number-7").attr("disabled", true);
        $("#number-8").attr("disabled", true);
        $("#number-9").attr("disabled", true);
        $("#number-25").attr("disabled", false);
        $("#number-50").attr("disabled", false);
        $("#number-75").attr("disabled", false);
    } else if (numberLength === 3) {
        $(`#${noteType}`).val($(`#${noteType}`).val() + number)
    } else if (numberLength === 4) {
        $(`#${noteType}`).val($(`#${noteType}`).val() + number)
        $(`.clear-${localStorage.getItem("typeNote")}`).hide()
        $("#competitor").focus()
        localStorage.setItem("typeNote", "competitor")
        $("#number-1").attr("disabled", false);
        $("#number-2").attr("disabled", false);
        stateNote()
    }
}

const cleanInput = (typeInput) => {
    let numberLength = $(`#${typeInput}`).val().length;
    console.log($(`#${typeInput}`).val())

    $(`#${typeInput}`).val('')
    if (numberLength >= 1) {
        $(`.clear-${localStorage.getItem("typeNote")}`).hide()
        $("#number-1").attr("disabled", false);
        $("#number-2").attr("disabled", false);
        stateNote()
    }
}