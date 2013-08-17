function copyToClipBoard(){
    clipBoard = getSelectionHtml().toString();
}


function pasteFromClipBoard(event){
    if(event.which == 3){
        var content = $("#command").text();
        content += clipBoard;
        $("#command").text(content);
    }
}