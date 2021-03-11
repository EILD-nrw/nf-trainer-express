var userSolutionArray1P = [];
var userSolutionArray1S = [];
var userSolutionArray2P = [];
var userSolutionArray2S = [];
var userSolutionArray3P = [];
var userSolutionArray3S = [];
var userSolutionArray4P = [];
var userSolutionArray4S = [];

// target elements with the "draggable" class
interact('.draggable')
  .draggable({
    // enable inertial throwing
    inertia: true,
    // keep the element within the area of it's parent
    restrict: {
      restriction: "parent",
      endOnly: true,
      elementRect: { top: 0, left: 0, bottom: 1, right: 1 }
    },
    // enable autoScroll
    autoScroll: true,

    // call this function on every dragmove event
    onmove: dragMoveListener,
    // call this function on every dragend event
  });

  function dragMoveListener (event) {
    var target = event.target,
        // keep the dragged position in the data-x/data-y attributes
        x = (parseFloat(target.getAttribute('data-x')) || 0) + event.dx,
        y = (parseFloat(target.getAttribute('data-y')) || 0) + event.dy;

    // translate the element
    target.style.webkitTransform =
    target.style.transform =
      'translate(' + x + 'px, ' + y + 'px)';

    // update the posiion attributes
    target.setAttribute('data-x', x);
    target.setAttribute('data-y', y);
  }

interact('.dropzone').dropzone({
  // only accept elements matching this CSS selector
  accept: '#yes-drop',
  // Require a 75% element overlap for a drop to be possible
  overlap: 0.75,

  // listen for drop related events:
  ondropactivate: function (event) {
    // add active dropzone feedback
    event.target.classList.add('drop-active');
  },
  ondragenter: function (event) {
    var draggableElement = event.relatedTarget,
        dropzoneElement = event.target;

    // feedback the possibility of a drop
    dropzoneElement.classList.add('drop-target');
    draggableElement.classList.add('can-drop');

    // console.log(event.target.getAttribute("id"));

    // draggableElement.textContent = 'Dragged in';
  },
  ondragleave: function (event) {
    // remove the drop feedback style
    event.target.classList.remove('drop-target');
    event.relatedTarget.classList.remove('can-drop');
    // event.relatedTarget.textContent = 'Dragged out';

    switch (event.target.getAttribute("id")) {

        case "primary-dropzone1":
            for(i = 0; i < userSolutionArray1P.length; i++){
                if(event.relatedTarget.textContent == userSolutionArray1P[i]){
                    userSolutionArray1P.splice(i, 1);
                }
            }
            console.log(userSolutionArray1P);
            break;
        
        case "second-dropzone1":
            for(i = 0; i < userSolutionArray1S.length; i++){
                if(event.relatedTarget.textContent == userSolutionArray1S[i]){
                    userSolutionArray1S.splice(i, 1);
                }
            }
            console.log(userSolutionArray1S);
            break;

        case "primary-dropzone2":
            for(i = 0; i < userSolutionArray2P.length; i++){
                if(event.relatedTarget.textContent == userSolutionArray2P[i]){
                    userSolutionArray2P.splice(i, 1);
                }
            }
            console.log(userSolutionArray2P);
            break;
            
        case "second-dropzone2":
            for(i = 0; i < userSolutionArray2S.length; i++){
                if(event.relatedTarget.textContent == userSolutionArray2S[i]){
                    userSolutionArray2S.splice(i, 1);
                }
            }
            console.log(userSolutionArray2S);
            break;

        case "primary-dropzone3":
            for(i = 0; i < userSolutionArray3P.length; i++){
                if(event.relatedTarget.textContent == userSolutionArray3P[i]){
                    userSolutionArray3P.splice(i, 1);
                }
            }
            console.log(userSolutionArray3P);
            break;

        case "second-dropzone3":
            for(i = 0; i < userSolutionArray3S.length; i++){
                if(event.relatedTarget.textContent == userSolutionArray3S[i]){
                    userSolutionArray3S.splice(i, 1);
                }
            }
            console.log(userSolutionArray3S);
            break;

        case "primary-dropzone4":
            for(i = 0; i < userSolutionArray4P.length; i++){
                if(event.relatedTarget.textContent == userSolutionArray4P[i]){
                    userSolutionArray4P.splice(i, 1);
                }
            }
            console.log(userSolutionArray4P);
            break;
            
        case "second-dropzone4":
            for(i = 0; i < userSolutionArray4S.length; i++){
                if(event.relatedTarget.textContent == userSolutionArray4S[i]){
                    userSolutionArray4S.splice(i, 1);
                }
            }
            console.log(userSolutionArray4S);
            break;
    }
  },
  ondrop: function (event) {

    enthalten1p = false;
    enthalten1s = false;
    enthalten2p = false;
    enthalten2s = false;
    enthalten3p = false;
    enthalten3s = false;
    enthalten4p = false;
    enthalten4s = false;

    switch (event.target.getAttribute("id")) {
        case "primary-dropzone1":
            for(i = 0; i < userSolutionArray1P.length; i++){
                if(event.relatedTarget.textContent == userSolutionArray1P[i]){
                    enthalten1p = true;
                }
            }
            if(!enthalten1p){
                userSolutionArray1P.push(event.relatedTarget.textContent);
            }
            console.log(userSolutionArray1P);
            break; 

        case "second-dropzone1":
            for(i = 0; i < userSolutionArray1S.length; i++){
                if(event.relatedTarget.textContent == userSolutionArray1S[i]){
                    enthalten1s = true;
                }
            }
            if(!enthalten1s){
                userSolutionArray1S.push(event.relatedTarget.textContent);
            }
            console.log(userSolutionArray1S);
            break;

        case "primary-dropzone2":
            for(i = 0; i < userSolutionArray2P.length; i++){
                if(event.relatedTarget.textContent == userSolutionArray2P[i]){
                    enthalten2p = true;
                }
            }
            if(!enthalten2p){
                userSolutionArray2P.push(event.relatedTarget.textContent);
            }
            console.log(userSolutionArray2P);
            break; 

        case "second-dropzone2":
            for(i = 0; i < userSolutionArray2S.length; i++){
                if(event.relatedTarget.textContent == userSolutionArray2S[i]){
                    enthalten2s = true;
                }
            }
            if(!enthalten2s){
                userSolutionArray2S.push(event.relatedTarget.textContent);
            }
            console.log(userSolutionArray2S);
            break;

        case "primary-dropzone3":
            for(i = 0; i < userSolutionArray3P.length; i++){
                if(event.relatedTarget.textContent == userSolutionArray3P[i]){
                    enthalten3p = true;
                }
            }
            if(!enthalten3p){
                userSolutionArray3P.push(event.relatedTarget.textContent);
            }
            console.log(userSolutionArray3P);
            break; 

        case "second-dropzone3":
            for(i = 0; i < userSolutionArray3S.length; i++){
                if(event.relatedTarget.textContent == userSolutionArray3S[i]){
                    enthalten3s = true;
                }
            }
            if(!enthalten3s){
                userSolutionArray3S.push(event.relatedTarget.textContent);
            }
            console.log(userSolutionArray3S);
            break;

        case "primary-dropzone4":
            for(i = 0; i < userSolutionArray4P.length; i++){
                if(event.relatedTarget.textContent == userSolutionArray4P[i]){
                    enthalten4p = true;
                }
            }
            if(!enthalten4p){
                userSolutionArray4P.push(event.relatedTarget.textContent);
            }
            console.log(userSolutionArray4P);
            break; 

        case "second-dropzone4":
            for(i = 0; i < userSolutionArray4S.length; i++){
                if(event.relatedTarget.textContent == userSolutionArray4S[i]){
                    enthalten4s = true;
                }
            }
            if(!enthalten4s){
                userSolutionArray4S.push(event.relatedTarget.textContent);
            }
            console.log(userSolutionArray4S);
            break;
    }

  },

  ondropdeactivate: function (event) {
    // remove active dropzone feedback
    event.target.classList.remove('drop-active');
    event.target.classList.remove('drop-target');
  }
});

$('#3nf_findFuncDepenTask').on('submit', function(e) {

    userSolutionArray1P.sort();
    userSolutionArray1S.sort();
    userSolutionArray2P.sort();
    userSolutionArray2S.sort();
    userSolutionArray3P.sort();
    userSolutionArray3S.sort();
    userSolutionArray4P.sort();
    userSolutionArray4S.sort();

    userSolutionString1 = "";
    userSolutionString2 = "";
    userSolutionString3 = "";
    userSolutionString4 = "";

    allUserSolutionArray = [];

    if(userSolutionArray1P.length != 0 || userSolutionArray1S.length != 0) {
        for (i = 0; i < userSolutionArray1P.length; i++){
            if( i == userSolutionArray1P.length - 1){
                userSolutionString1+= (userSolutionArray1P[i].toUpperCase());
            } else{
                userSolutionString1+= (userSolutionArray1P[i].toUpperCase() + ","); 
            }
        }
    
        userSolutionString1 += ":";
        
        for (i = 0; i < userSolutionArray1S.length; i++){
            if( i == (userSolutionArray1S.length - 1)){
                userSolutionString1+= (userSolutionArray1S[i].toUpperCase());
            } else{
                userSolutionString1+= (userSolutionArray1S[i].toUpperCase() + ","); 
            }
        }

        allUserSolutionArray.push(userSolutionString1);
    }

    if(userSolutionArray2P.length != 0 || userSolutionArray2S.length != 0) {
        for (i = 0; i < userSolutionArray2P.length; i++){
            if( i == userSolutionArray2P.length - 1){
                userSolutionString2+= (userSolutionArray2P[i].toUpperCase());
            } else{
                userSolutionString2+= (userSolutionArray2P[i].toUpperCase() + ","); 
            }
        }
    
        userSolutionString2 += ":";
        
        for (i = 0; i < userSolutionArray2S.length; i++){
            if( i == (userSolutionArray2S.length - 1)){
                userSolutionString2+= (userSolutionArray2S[i].toUpperCase());
            } else{
                userSolutionString2+= (userSolutionArray2S[i].toUpperCase() + ","); 
            }
        }

        allUserSolutionArray.push(userSolutionString2);
    }

    if(userSolutionArray3P.length != 0 || userSolutionArray3S.length != 0) {
        for (i = 0; i < userSolutionArray3P.length; i++){
            if( i == userSolutionArray3P.length - 1){
                userSolutionString3+= (userSolutionArray3P[i].toUpperCase());
            } else{
                userSolutionString3+= (userSolutionArray3P[i].toUpperCase() + ","); 
            }
        }
    
        userSolutionString3 += ":";
        
        for (i = 0; i < userSolutionArray3S.length; i++){
            if( i == (userSolutionArray3S.length - 1)){
                userSolutionString3+= (userSolutionArray3S[i].toUpperCase());
            } else{
                userSolutionString3+= (userSolutionArray3S[i].toUpperCase() + ","); 
            }
        }

        allUserSolutionArray.push(userSolutionString3);
    }

    if(userSolutionArray4P.length != 0 || userSolutionArray4S.length != 0) {
        for (i = 0; i < userSolutionArray4P.length; i++){
            if( i == userSolutionArray4P.length - 1){
                userSolutionString4+= (userSolutionArray4P[i].toUpperCase());
            } else{
                userSolutionString4+= (userSolutionArray4P[i].toUpperCase() + ","); 
            }
        }
    
        userSolutionString4 += ":";
        
        for (i = 0; i < userSolutionArray4S.length; i++){
            if( i == (userSolutionArray4S.length - 1)){
                userSolutionString4+= (userSolutionArray4S[i].toUpperCase());
            } else{
                userSolutionString4+= (userSolutionArray4S[i].toUpperCase() + ","); 
            }
        }

        allUserSolutionArray.push(userSolutionString4);
    }

    var allSolutionArray = $('#valueHolderSolution').attr('value').split(';');

    var newAllSolutionArray = [];

    for(i = 0; i < allSolutionArray.length - 1; i++){

        var solutionArray = allSolutionArray[i].split(':');

        var solutionArrayP = solutionArray[0].split(',').sort();
        var solutionArrayS = solutionArray[1].split(',').sort();

        var newSolutionString = "";

        for (j = 0; j < solutionArrayP.length; j++){
            if( j == solutionArrayP.length - 1){
                newSolutionString+= (solutionArrayP[j].toUpperCase());
            } else{
                newSolutionString+= (solutionArrayP[j].toUpperCase() + ","); 
            }
        }
    
        newSolutionString += ":";
        
        for (j = 0; j < solutionArrayS.length; j++){
            if( j == (solutionArrayS.length - 1)){
                newSolutionString+= (solutionArrayS[j].toUpperCase());
            } else{
                newSolutionString+= (solutionArrayS[j].toUpperCase() + ","); 
            }
        }

        newAllSolutionArray.push(newSolutionString);
    }

    rightCounter = 0;

    for(i = 0; i < newAllSolutionArray.length; i++){

        for(j = 0; j < allUserSolutionArray.length; j++) {

            if(newAllSolutionArray[i] == allUserSolutionArray[j]){
                rightCounter++;
            }
        }
    }

    console.log(rightCounter);
    console.log(newAllSolutionArray.length);
    console.log(allUserSolutionArray.length);

    if((rightCounter == newAllSolutionArray.length) && (newAllSolutionArray.length == allUserSolutionArray.length)){
        alert("Ihre Antwort ist korrekt");
    } else {
        alert("Ihre Antwort ist leider falsch");
        e.preventDefault();
    }
    
});