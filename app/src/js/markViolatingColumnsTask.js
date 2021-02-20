var eventTargets = [];

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

    // draggableElement.textContent = 'Dragged in';
  },
  ondragleave: function (event) {
    // remove the drop feedback style
    event.target.classList.remove('drop-target');
    event.relatedTarget.classList.remove('can-drop');
    // event.relatedTarget.textContent = 'Dragged out';

    for(i = 0; i < eventTargets.length; i++){
        if(event.relatedTarget.textContent == eventTargets[i]){
            eventTargets.splice(i, 1);
        }
    }
  },
  ondrop: function (event) {

    enthalten = false;

    for(i = 0; i < eventTargets.length; i++){
        if(event.relatedTarget.textContent == eventTargets[i]){
            enthalten = true;
        }
    }
    if(!enthalten){
        eventTargets.push(event.relatedTarget.textContent);
    }
  },

  ondropdeactivate: function (event) {
    // remove active dropzone feedback
    event.target.classList.remove('drop-active');
    event.target.classList.remove('drop-target');
  }
});

$('#3nf_markViolatingColumnsTask').on('submit', function(e) {

    var solutionArray = $('#valueHolderSolution').attr('value').split(';');

    var rightCounter = 0;
    var wrongCounter = 0;

    solutionArray.forEach(element => {

         for(i = 0; i < eventTargets.length; i++) {

             if(element.toLowerCase() == eventTargets[i].toLowerCase()){

                 rightCounter++;

             } else if (element.toLowerCase() != eventTargets[i].toLowerCase()) {

                 wrongCounter++;

             }
        
         }

     });

    wrongCounter = wrongCounter-((solutionArray.length -1)*(solutionArray.length -1))

    if(rightCounter == solutionArray.length-1 && wrongCounter == 0){

        alert("Ihre Antwort ist korrekt!");

    } else {

        alert("Ihre Antwort ist leider falsch!");

        e.preventDefault();

    }
    
});