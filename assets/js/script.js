/* Bloqueia o teclado mobile */
$('.input-data').attr('readonly', 'readonly');
let buckoff = 0;
$(document).ready(function() {
    stateNote()
    $(".clear-animal").hide()
    $(".clear-competitor").hide()
    localStorage.setItem("typeNote", "animal")

    var socket = null;
    let judgeID = 0;
    let rideID = 0;
    let time = 0;
    let judgeClassification;
    const params = new URLSearchParams(window.location.search);
    connect();

    function connect() {
        $('.data-note-template').hide();
        $('.circle').css('background-color', '#eab308');
        $('.status').text("Conectando...").css('color', '#eab308');
        if (params.has('j')) {
            socket = new WebSocket("ws://192.168.87.251:8550/chat" + params.get('j'));
        }

        socket.onopen = function(event) {
            console.log("OPENED : ", socket.readyState);
            $('.circle').css('background-color', '#16a34a');
            $('.status').text("Conectado").css('color', '#16a34a');

            //clearInterval();
        }
        socket.onmessage = function(msg) {
            console.log(msg)
            if (msg.data.includes("[judge-id]")) {
                judgeID = msg.data.replace('[judge-id]', '');
            }
            if (msg.data.includes("[ride-id]")) {
                rideID = msg.data.replace('[ride-id]', '');
            }
            if (msg.data.includes("[judge-name]")) {
                $('.judge').text(msg.data.replace('[judge-name]', ''));
            }
            if (msg.data.includes("[rider]")) {
                $('#nameCompetitor').text(msg.data.replace('[rider]', ''));
            }
            if (msg.data.includes("[animal]")) {
                $('#nameAnimal').text(msg.data.replace('[animal]', '') + " / ");
            }
            if (msg.data.includes("[contractor]")) {
                $('#nameContractor').text(msg.data.replace('[contractor]', ''));
            }
            /* BLoquear tudo = quando completa a montaria  */
            if (msg.data.includes("[completed]")) {
                $("#number-1").attr("disabled", true);
                $("#number-2").attr("disabled", true);
                $("#number-3").attr("disabled", true);
                $("#number-4").attr("disabled", true);
                $("#number-5").attr("disabled", true);
                $("#number-6").attr("disabled", true);
                $("#number-7").attr("disabled", true);
                $("#number-8").attr("disabled", true);
                $("#number-9").attr("disabled", true);
                $("#number-0").attr("disabled", true);
                $("#number-25").attr("disabled", true);
                $("#number-50").attr("disabled", true);
                $("#number-75").attr("disabled", true);
                $("#btn-save").attr("disabled", true);
                $("#animal").attr("disabled", true);
                $("#competitor").attr("disabled", true);
                $('.data-note-template').show();
                $('.clock-template').hide();
            }
            if (msg.data.includes("[time]")) {
                time = msg.data.replace('[time]', '')
                $('.btn-clock').text(time);
                if (time === 0) {
                    $('.btn-clock').text("CLOCK");
                }
            }
            if (msg.data.includes('[judge-classification]')) {
                judgeClassification = msg.data.replace('[judge-classification]', '');

                if (judgeClassification == 'Arena') {
                    $("#number-1").attr("disabled", true);
                    $("#number-2").attr("disabled", true);
                    $("#number-3").attr("disabled", true);
                    $("#number-4").attr("disabled", true);
                    $("#number-5").attr("disabled", true);
                    $("#number-6").attr("disabled", true);
                    $("#number-7").attr("disabled", true);
                    $("#number-8").attr("disabled", true);
                    $("#number-9").attr("disabled", true);
                    $("#number-0").attr("disabled", true);
                    $("#number-25").attr("disabled", true);
                    $("#number-50").attr("disabled", true);
                    $("#number-75").attr("disabled", true);
                    $("#btn-save").attr("disabled", true);
                    $("#animal").attr("disabled", true);
                    $("#competitor").attr("disabled", true);
                    $('.data-note-template').show();
                    $('.clock-template').hide();
                } else {
                    $('.data-note-template').hide();
                    $('.clock-template').show();
                }
            }
            /* Competidor nao montou / Clock em tela */
            if (msg.data.includes("[ride]")) {

                if (judgeClassification == 'Arena') {
                    $('.data-note-template').show();
                    $('.clock-template').hide();
                } else {
                    $(".btn-clock").attr("disabled", false);
                    $('.data-note-template').hide();
                    $('.clock-template').show();
                }

                /* $('#score-unique').removeAttr('disabled');
                $('#btnSend').removeAttr('disabled');
                $('#scorePanel').hide();
                $('#clockPanel').show(); */
            }
            /* Iniciou o cronometro e bloqueia botao de clock */
            if (msg.data.includes("[started]")) {
                $('.btn-clock').hide();
            }
            /* Quando o peao cair/ Desabilita nota competidor */
            if (msg.data.includes("[buckoff]")) {
                $("#competitor").attr("disabled", true);
                $("#number-0").attr("disabled", false);
                buckoff = 1
            }
            /*  Quando a montaria acaba / Habilita o quadro de nota  */
            if (msg.data.includes("[finished]")) {
                $("#number-1").attr("disabled", false);
                $("#number-2").attr("disabled", false);
                $("#number-3").attr("disabled", false);
                $("#number-4").attr("disabled", true);
                $("#number-5").attr("disabled", true);
                $("#number-6").attr("disabled", true);
                $("#number-7").attr("disabled", true);
                $("#number-8").attr("disabled", true);
                $("#number-9").attr("disabled", true);
                $("#number-0").attr("disabled", true);
                $("#number-25").attr("disabled", true);
                $("#number-50").attr("disabled", true);
                $("#number-75").attr("disabled", true);
                $("#btn-save").attr("disabled", false);

                $("#animal").attr("disabled", false);
                $("#competitor").attr("disabled", false);
                $('.data-note-template').show();
                $('.clock-template').hide();
            }

            /* if (msg.data.includes("[score-numbers]")) {
                let rules = msg.data.replace("[score-numbers]", "");
                rules = msg.data.replace(/\D/g, "");
                judges = rules.substring(0, 1);
                scores = rules.substring(1, 2);
                if (scores == 1 && $('#scorePanel').css('display') != "none") {
                    $('#1score').show();
                    $('#2scores').hide();
                } else if (scores == 2 && $('#scorePanel').css('display') != "none") {
                    $('#1score').hide();
                    $('#2scores').show();
                }
            } */

        }
        socket.onclose = function() {
            console.log("CLOSED : ", socket.readyState);
            $('.circle').css('background-color', '#dc2626');
            $('.status').text("Desconectado").css('color', '#dc2626');

            $("#number-1").attr("disabled", true);
            $("#number-2").attr("disabled", true);
            $("#number-3").attr("disabled", true);
            $("#number-4").attr("disabled", true);
            $("#number-5").attr("disabled", true);
            $("#number-6").attr("disabled", true);
            $("#number-7").attr("disabled", true);
            $("#number-8").attr("disabled", true);
            $("#number-9").attr("disabled", true);
            $("#number-0").attr("disabled", true);
            $("#number-25").attr("disabled", true);
            $("#number-50").attr("disabled", true);
            $("#number-75").attr("disabled", true);
            $("#animal").attr("disabled", true);
            $("#competitor").attr("disabled", true);

            setTimeout(function() {
                connect();
            }, 5000);
        }

        socket.onerror = function(msg) {
            console.log("ERROR : " + msg);
            //$('#error-alert').show();
        }
    }
    /* Clock */
    $(".btn-clock").click(function() {
        $(".btn-clock").attr("disabled", true);
        $(".btn-clock").addClass("btn-disabled");
        $(".btn-declassify").hide();
        var sendData = {
            type: "clock",
            device: 01,
            judgeId: judgeID,
            rideId: rideID,
            date: Date.now(),
        };

        setTimeout(function() {
            socket.send(JSON.stringify(sendData));
        }, 100);
    });
})

const stateNote = (stateType = localStorage.getItem("typeNote")) => {
    /*  let numberLength = $(`#${stateType}`).val().length; */

    /* $("#number-3").attr("disabled", true);
    $("#number-4").attr("disabled", true);
    $("#number-5").attr("disabled", true);
    $("#number-6").attr("disabled", true);
    $("#number-7").attr("disabled", true);
    $("#number-8").attr("disabled", true);
    $("#number-9").attr("disabled", true);
    $("#number-25").attr("disabled", true);
    $("#number-50").attr("disabled", true);
    $("#number-75").attr("disabled", true); */

}

const dataNumber = (number, noteType = localStorage.getItem("typeNote")) => {
    let numberLength = $(`#${noteType}`).val().length;
    console.log(number)

    if (numberLength === 0) {
        $(`#${noteType}`).val(number)
        $(`.clear-${localStorage.getItem("typeNote")}`).show()

        if (number == 0) {
            $(`#${noteType}`).val("00,00")
            $(`.clear-${localStorage.getItem("typeNote")}`).hide()
            $("#competitor").focus()
            localStorage.setItem("typeNote", "competitor")
            $("#competitor").attr("disabled", true);
            $("#number-1").attr("disabled", true);
            $("#number-2").attr("disabled", true);
            $("#number-3").attr("disabled", true);
            $("#number-4").attr("disabled", true);
            $("#number-5").attr("disabled", true);
            $("#number-6").attr("disabled", true);
            $("#number-7").attr("disabled", true);
            $("#number-8").attr("disabled", true);
            $("#number-9").attr("disabled", true);
            $("#number-0").attr("disabled", true);
            $("#number-25").attr("disabled", true);
            $("#number-50").attr("disabled", true);
            $("#number-75").attr("disabled", true);
            /*  $("#competitor").attr("disabled", false); */
        }

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


    } else if (numberLength === 3) {
        if (number == 0) {
            $(`#${noteType}`).val($(`#${noteType}`).val() + number)
            $(`.clear-${localStorage.getItem("typeNote")}`).hide()
            $("#competitor").focus()
            localStorage.setItem("typeNote", "competitor")
            console.log($(`#${noteType}`).val())
            if ($(`#${noteType}`).val() >= 25) {
                $("#number-25").attr("disabled", true);
                $("#number-50").attr("disabled", true);
                $("#number-75").attr("disabled", true);
            } else {
                $("#number-25").attr("disabled", false);
                $("#number-50").attr("disabled", false);
                $("#number-75").attr("disabled", false);
            }
            /* buckoff == 1 == Cair */
            if (buckoff != 1) {
                console.log(buckoff)
                $("#competitor").attr("disabled", false);
                $("#competitor").focus()

            } else {
                $("#competitor").attr("disabled", true);
                $("#number-1").attr("disabled", true);
                $("#number-2").attr("disabled", true);
                $("#number-3").attr("disabled", true);
                $("#number-4").attr("disabled", true);
                $("#number-5").attr("disabled", true);
                $("#number-6").attr("disabled", true);
                $("#number-7").attr("disabled", true);
                $("#number-8").attr("disabled", true);
                $("#number-9").attr("disabled", true);
                $("#number-0").attr("disabled", true);
                $("#number-25").attr("disabled", true);
                $("#number-50").attr("disabled", true);
                $("#number-75").attr("disabled", true);
            }

            stateNote()
        }
        if (number >= 25) {
            $(`#${noteType}`).val($(`#${noteType}`).val() + number)
            $(`.clear-${localStorage.getItem("typeNote")}`).hide()

            localStorage.setItem("typeNote", "competitor")

            if (buckoff != 1) {
                console.log(buckoff)
                $("#competitor").attr("disabled", false);
                $("#competitor").focus()
            } else {
                $("#competitor").attr("disabled", true);
                $("#number-1").attr("disabled", true);
                $("#number-2").attr("disabled", true);
                $("#number-3").attr("disabled", true);
                $("#number-4").attr("disabled", true);
                $("#number-5").attr("disabled", true);
                $("#number-6").attr("disabled", true);
                $("#number-7").attr("disabled", true);
                $("#number-8").attr("disabled", true);
                $("#number-9").attr("disabled", true);
                $("#number-0").attr("disabled", true);
                $("#number-25").attr("disabled", true);
                $("#number-50").attr("disabled", true);
                $("#number-75").attr("disabled", true);
            }

            /*    $(".data-number").addClass("d-none") */
            stateNote()
        } else {
            $(`#${noteType}`).val($(`#${noteType}`).val() + number)
        }
    }
    /* else if (numberLength === 4) {
           $(`#${noteType}`).val($(`#${noteType}`).val() + number)
           $(`.clear-${localStorage.getItem("typeNote")}`).hide()
           $("#competitor").focus()
           localStorage.setItem("typeNote", "competitor")
           $("#competitor").attr("disabled", false);
           $("#number-1").attr("disabled", false);
           $("#number-2").attr("disabled", false);

          

           stateNote()
       } */
}

const cleanInput = (typeInput) => {
    let numberLength = $(`#${typeInput}`).val().length;
    $(`#${typeInput}`).val('')
    if (numberLength >= 1) {
        $(`.clear-${localStorage.getItem("typeNote")}`).hide()
        $("#number-1").attr("disabled", false);
        $("#number-2").attr("disabled", false);
        $("#number-0").attr("disabled", false);
        stateNote()
    }
}

$("#animal, #competitor").focus(function() {
    let cleanInput = $(this).val().length
    localStorage.setItem("typeNote", $(this)[0].id)
    if (cleanInput >= 1) {
        $(`.clear-${$(this)[0].id}`).show()
    }
})

$("#animal, #competitor").focusout(function() {
    $(`.clear-competitor`).hide()
})

$("#btn-save").click(function() {
    /* Duas notas cada juiz */
    if (scores == 2) {
        var sendData = {
            type: "score",
            numbers: scores,
            judgeId: judgeID,
            rideId: rideID,
            date: Date.now(),
            scoreAnimal: $('#score1').val(),
            scoreRider: $('#score2').val(),
        };
        /* Uma nota cada juiz */
    } else {
        var sendData = {
            type: "score",
            numbers: scores,
            judgeId: judgeID,
            rideId: rideID,
            date: Date.now(),
            score: $('#score-unique').val(),
        };
    }

    setTimeout(function() {
        socket.send(JSON.stringify(sendData));
    }, 100);

    $('#score1').val(null).attr('disabled', 'disabled');
    $('#score2').val(null).attr('disabled', 'disabled');
    $('#score-unique').val(null).attr('disabled', 'disabled');
    $('#btnSend').attr('disabled', 'disabled');
})