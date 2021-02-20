var visibleSampleSolution = false;

$('.sampleSolution').hide();

function showSampleSolution() {

    if(!visibleSampleSolution) {
        $('.sampleSolution').show();
        $("#btnSampleSolution").html('Musterlösung ausblenden');
        visibleSampleSolution = true;
    } else {
        $('.sampleSolution').hide();
        $("#btnSampleSolution").html('Musterlösung einblenden');
        visibleSampleSolution = false;
    }
}