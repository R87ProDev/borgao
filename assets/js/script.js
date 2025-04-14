/* Bloqueia o teclado mobile */
$('.input-data').attr('readonly', 'readonly');
let buckoff = 0;

$("#fullScreen").click(function(){
    document.body.requestFullscreen();
})

let myParam;

const urlParams = new URLSearchParams(window.location.search);

myParam = urlParams.get("j");


$("#btn-save").attr("disabled",true)

$(document).ready(function() {
    $("#animal").val('')
    $("#competitor").val('')
    $(".ride-warning").hide()
    stateNote()
    $(".clear-animal").hide()
    $(".clear-competitor").hide()
    localStorage.setItem("typeNote", "animal")

    var socket = null;
    let judgeID = 0;
    let rideID = 0;
    let scores = 0;
    let time = 0;
    let timeRide = 0
    let judgeClassification;
    const params = new URLSearchParams(window.location.search);
    connect();

    function connect() {
      /*   $('.data-note-template').hide(); */
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
                if(myParam == 5 || myParam == 6) {
                    $('.data-note-template').hide();
                }
                disabledButtons()
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
                if(time == 29) {
                    $(".btn-clock").attr("disabled",true)
                }
            }
            /* Tempo de 8s */
            if(msg.data.includes("[timing]")) {
                timeRide = msg.data.replace('[timing]', '')
                $('.time-ride').text(timeRide);
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
                if(myParam == 5 || myParam == 6) {
                    $('.data-note-template').hide();
                }
            }
            /* Competidor nao montou / Clock em tela */
            if (msg.data.includes("[ride]")) {
                
                $("#btn-save").attr("disabled",true)
                $('.btn-clock').text("CLOCK");
                if (judgeClassification == 'Arena') {
                    $('.data-note-template').show();
                    $('.clock-template').hide();
                    
                } else {
                    $(".btn-clock").attr("disabled", false);
                    $('.data-note-template').hide();
                    $('.clock-template').show();
                    $(".btn-clock").show()
                    /* $(".btn-declassify").show() */
                    
                }
                if(myParam == 5 || myParam == 6) {
                    $('.data-note-template').hide();
                }
                /* $('#score-unique').removeAttr('disabled');
                $('#btnSend').removeAttr('disabled');
                $('#scorePanel').hide();
                $('#clockPanel').show(); */
            }
            /* Iniciou o cronometro e bloqueia botao de clock */
            if (msg.data.includes("[started]")) {
                buckoff = 0
                $('.clock-template').hide();
                $(".ride-warning").show()
                if(myParam == 5 || myParam == 6) {
                    $('.data-note-template').hide();
                }
                
            }
            /* Quando o peao cair/ Desabilita nota competidor */
            if (msg.data.includes("[buckoff]")) {
                $("#competitor").val("00,00")   
                $("#competitor").attr("disabled", true);
                $("#number-1").attr("disabled", false);
                $("#number-2").attr("disabled", false);
                $("#number-0").attr("disabled", false);
                $("#number-0").attr("disabled", false);
                $(".ride-warning").hide()
                
                buckoff = 1
                if(judgeClassification == "Brete") {
                    /* $(".clock-template").show()
                    $(".btn-clock").hide() */

                }
                if(myParam == 5 || myParam == 6) {
                    $('.data-note-template').hide();
                }

            }
            /*  Quando a montaria acaba / Habilita o quadro de nota  */
            if (msg.data.includes("[finished]")) {
                $("#competitor").val("")
                $('.btn-clock').text("CLOCK");
                $(".ride-warning").hide()
               
                if(buckoff == 1) {
                    disabledButtons()
                    
                } else {

                    $("#number-1").attr("disabled", false);
                    $("#number-2").attr("disabled", false);
                    $("#number-3").attr("disabled", true);
                    $("#number-3").attr("disabled", true);
                    $("#number-4").attr("disabled", true);
                    $("#number-5").attr("disabled", true);
                    $("#number-6").attr("disabled", true);
                    $("#number-7").attr("disabled", true);
                    $("#number-8").attr("disabled", true);
                    $("#number-9").attr("disabled", true);
                    $("#number-0").attr("disabled", false);
                    $("#number-25").attr("disabled", true);
                    $("#number-50").attr("disabled", true);
                    $("#number-75").attr("disabled", true);
                }
               

                $("#animal").attr("disabled", false);
                $("#competitor").attr("disabled", false);
                $('.data-note-template').show();
                $('.clock-template').hide();
                if(myParam == 5 || myParam == 6) {
                    $('.data-note-template').hide();
                }
            }

        }
        socket.onclose = function() {
            console.log("CLOSED : ", socket.readyState);
            $('.circle').css('background-color', '#dc2626');
            $('.status').text("Desconectado").css('color', '#dc2626');

            disabledButtons()
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

    $(".btn-confirm-declassify").click(function() {
        let declassifySelect;
        $("#declassifySelect option:selected").each(function(){
            /* Motivo de desclassificacao */
            declassifySelect = $(this).val()
        })
        var sendData = {
            type: "penalty",
            numbers: scores,
            judgeId: judgeID,
            rideId: rideID,
            date: Date.now(),
            reason: declassifySelect,
        };
        setTimeout(function() {
            socket.send(JSON.stringify(sendData));
        }, 100);
        console.log("sendata",sendData)
        $(".clock-template").hide()
        $("#animal").attr("disabled",true)
        $(".data-note-template").show()
        disabledButtons()
        $("#btn-save").attr("disabled",true)
    })
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
        console.log("sendata",sendData)
    });

    $("#btn-save").click(function() {
        /* Duas notas cada juiz */
        var sendData = {
            type: "score",
            numbers: scores,
            judgeId: judgeID,
            rideId: rideID,
            date: Date.now(),
            scoreAnimal: $('#animal').val(),
            scoreRider: $('#competitor').val(),
        };
         $('.btn-clock').text("CLOCK");
        localStorage.setItem("typeNote","animal")
        setTimeout(function() {
            socket.send(JSON.stringify(sendData));
        }, 100);
        console.log("sendata",sendData)

        $('#animal').val(null).attr('disabled', true);
        $('#competitor').val(null).attr('disabled', true);
        $('#score-unique').val(null).attr('disabled', 'disabled');
        $('#btn-save').attr('disabled', true);

    })
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
   
    if (numberLength === 0) {
        $(`#${noteType}`).val(number)
        $(`.clear-${localStorage.getItem("typeNote")}`).show()

        if (number == 0) {
            $(`#${noteType}`).val("00,00")
            $(`.clear-${localStorage.getItem("typeNote")}`).hide()
            $("#competitor").focus()
            localStorage.setItem("typeNote", "competitor")
            $("#competitor").attr("disabled", true);
            disabledButtons()
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
       // console.log($(`#${noteType}`).val())
        if($(`#${noteType}`).val().replace(',','') == 25) {
            $("#number-1").attr("disabled", true);
            $("#number-2").attr("disabled", true);
            $("#number-3").attr("disabled", true);
            $("#number-4").attr("disabled", true);
            $("#number-5").attr("disabled", true);
            $("#number-6").attr("disabled", true);
            $("#number-7").attr("disabled", true);
            $("#number-8").attr("disabled", true);
            $("#number-9").attr("disabled", true);
            $("#number-0").attr("disabled", false);
            $("#number-25").attr("disabled", true);
            $("#number-50").attr("disabled", true);
            $("#number-75").attr("disabled", true);
        } else {
            $("#number-1").attr("disabled", true);
            $("#number-2").attr("disabled", true);
            $("#number-3").attr("disabled", true);
            $("#number-4").attr("disabled", true);
            $("#number-5").attr("disabled", true);
            $("#number-6").attr("disabled", true);
            $("#number-7").attr("disabled", true);
            $("#number-8").attr("disabled", true);
            $("#number-9").attr("disabled", true);
            $("#number-0").attr("disabled", false);
            $("#number-25").attr("disabled", false);
            $("#number-50").attr("disabled", false);
            $("#number-75").attr("disabled", false);
        }
    } else if (numberLength >= 3) {
        if (number == 0) {
            $(`#${noteType}`).val($(`#${noteType}`).val() + number + 0)
            $(`.clear-${localStorage.getItem("typeNote")}`).hide()
            $("#competitor").focus()
            localStorage.setItem("typeNote", "competitor")
            /* buckoff == 1 == Cair */
            if (buckoff != 1) {
                $("#competitor").attr("disabled", false);
                $("#competitor").focus()
                $("#number-1").attr("disabled", false);
                $("#number-2").attr("disabled", false);
                $("#number-0").attr("disabled", false);
                $("#number-25").attr("disabled", true);
                $("#number-50").attr("disabled", true);
                $("#number-75").attr("disabled", true);
                $("#btn-save").attr("disabled",false)
                console.log("entrou aqui")
                if(noteType === "competitor") {
                    $("#btn-save").attr("disabled",false)
                }
            } else {
                console.log("entrou aqui 2")
                $("#competitor").attr("disabled", true);
                disabledButtons()
                $("#btn-save").attr("disabled",false)
                
            }
            if (noteType === "competitor" && $(`#${noteType}`).val().length >=2) {
                $(`.clear-${localStorage.getItem("typeNote")}`).hide()
                disabledButtons()
                $("#btn-save").attr("disabled",false)
                $("#competitor").blur()
                

            }

            stateNote()
        }
        else if (number >= 25) {
            $(`#${noteType}`).val($(`#${noteType}`).val() + number)
            $(`.clear-${localStorage.getItem("typeNote")}`).hide()

            localStorage.setItem("typeNote", "competitor")

            if (buckoff != 1) {
                console.log(buckoff)
                $("#competitor").attr("disabled", false);
                $("#competitor").focus()
                $("#number-1").attr("disabled", false);
                $("#number-2").attr("disabled", false);
                $("#number-0").attr("disabled", false);
                $("#number-25").attr("disabled", true);
                $("#number-50").attr("disabled", true);
                $("#number-75").attr("disabled", true);
                if(noteType === "competitor") {
                    $("#btn-save").attr("disabled",false)
                }
            } else {
                $("#competitor").attr("disabled", true);
                disabledButtons()
                $("#btn-save").attr("disabled",false)
            }

            stateNote()
        } else { 
            $(`#${noteType}`).val($(`#${noteType}`).val() + number)
        }
        if (noteType === "competitor" && $(`#${noteType}`).val().length >=2) {
            $(`.clear-${localStorage.getItem("typeNote")}`).hide()
            disabledButtons()
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
// Limpa o campo de notas
const cleanInput = (typeInput = localStorage.getItem("typeNote")) => {
    console.log(typeInput,"olaaaa")
    $("#btn-save").attr("disabled",true)
    let numberLength = $(`#${typeInput}`).val().length;
    $(`#${typeInput}`).val('')

    if (numberLength >= 1) {
      /*   $(`.clear-${localStorage.getItem("typeNote")}`).hide() */
        $("#number-1").attr("disabled", false);
        $("#number-2").attr("disabled", false);
        $("#number-3").attr("disabled", true);
        $("#number-4").attr("disabled", true);
        $("#number-5").attr("disabled", true);
        $("#number-6").attr("disabled", true);
        $("#number-7").attr("disabled", true);
        $("#number-8").attr("disabled", true);
        $("#number-9").attr("disabled", true);
        $("#number-0").attr("disabled", false);
        $("#number-25").attr("disabled", true);
        $("#number-50").attr("disabled", true);
        $("#number-75").attr("disabled", true);
        console.log("Entro ")
        stateNote()
    }
}

$("#animal, #competitor").on("focus click",function() {
    console.log("foca porra")
    console.log($(this)[0].id)

   
    let cleanInput = $(this).val().length
    console.log(cleanInput,"clean input")
    localStorage.setItem("typeNote", $(this)[0].id)
    if (cleanInput >= 2) {
        console.log("nao nao")
        $(`.clear-${$(this)[0].id}`).show()
    }
    if($("#competitor").val().length >= 4 && localStorage.getItem("typeNote") == "competitor") {
        $("#btn-save").attr("disabled",false)
    }
    
})

/* $("#animal, #competitor").focusout(function() {
    $(`.clear-competitor`).hide()
})
 */
const disabledButtons = () => {
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

/* $(".btn-declassify ").click(function () {
    $(".btn-confirm-declassify").attr("data-bs-dismiss",'modal')
    $(".btn-confirm-declassify").attr("aria-label",'Close')
})
 */
/* data-bs-dismiss="modal" aria-label="Close" */
