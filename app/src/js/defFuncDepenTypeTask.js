$('#3nf_defFuncDepenTypeTask').on('submit', function(e) {

    var counter = 0;
    var solutions = [];
    var userSolutions = [];

    var temp = $('#solution' + counter);

    while(temp.length > 0){
        solutions[counter] = temp;
        userSolutions[counter] = $('#form' + counter);
        counter = counter + 1;
        temp = $('#solution' + counter);
    }

    var rightCounter = 0;

    for(var i = 0; i<solutions.length; i++){
        if(solutions[i].text().split(' → ')[1].localeCompare(userSolutions[i].find("option:selected").text()) == 0){
            rightCounter = rightCounter + 1;
        }
    }

    if(rightCounter == solutions.length){
        alert("Ihre Antwort ist korrekt!");
    }else {
        alert("Ihre Antwort ist leider falsch!");

        e.preventDefault();
    }

});