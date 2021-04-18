$('#nf_checkBCNfTask').on('submit', function(e) {
    let nfInput = $('input[name="bcnf"]');

    if(nfInput[1].checked === false && nfInput[0].checked === false){
        alert("Bitte wählen Sie eine Antwort aus!");
        e.preventDefault();

    } else {

        let valueHolder = $('#valueHolder')
        if((valueHolder.attr('value') === '1' && nfInput[1].checked === true
            || (valueHolder.attr('value') === '0' && nfInput[0].checked === true))) {

            console.log(valueHolder.attr('value'));

            alert("Ihre Antwort ist falsch! Bitte überprüfen Sie ihre Antwort!");
            e.preventDefault();

        } else {

            alert("Ihre Antwort ist richtig!");

        }

    }

});