$('#3nf_checkFirstNfTask').on('submit', function(e) {
    let firstNfInput = $('input[name="firstNf"]');

    if(firstNfInput[1].checked === false && firstNfInput[0].checked === false){
        alert("Bitte wählen Sie eine Antwort aus!");
        e.preventDefault();

    } else {

        let valueHolder = $('#valueHolder')
        if((valueHolder.attr('value') === 1 && firstNfInput[1].checked === true
            || (valueHolder.attr('value') === 0 && firstNfInput[0].checked === true))) {

            console.log(valueHolder.attr('value'));

            alert("Ihre Antwort ist falsch! Bitte überprüfen Sie ihre Antwort!");
            e.preventDefault();

        } else {

            alert("Ihre Antwort ist richtig!");

        }

    }

});