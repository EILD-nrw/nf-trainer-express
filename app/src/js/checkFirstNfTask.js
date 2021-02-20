$('#3nf_checkFirstNfTask').on('submit', function(e) {

    if($('input[name="firstNf"]')[1].checked == false && $('input[name="firstNf"]')[0].checked == false){
        alert("Bitte wählen Sie eine Antwort aus!");
        e.preventDefault();

    } else {

        if(($('#valueHolder').attr('value') == 1 && $('input[name="firstNf"]')[1].checked == true
            || ($('#valueHolder').attr('value') == 0 && $('input[name="firstNf"]')[0].checked == true))) {

            console.log($('#valueHolder').attr('value'));

            alert("Ihre Antwort ist falsch! Bitte überprüfen Sie ihre Antwort!");
            e.preventDefault();

        } else {

            alert("Ihre Antwort ist richtig!");

        }

    }

});