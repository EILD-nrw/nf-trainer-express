var visibleTable = true;

function hideTable() {

    if(visibleTable) {
        $('.trToHide').hide();
        $("#btnTabelleAusblenden").html('Tabelleninhalt einblenden');
        visibleTable = false;
    } else {
        $('.trToHide').show();
        $("#btnTabelleAusblenden").html('Tabelleninhalt ausblenden');
        visibleTable = true;
    }


}