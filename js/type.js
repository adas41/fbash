$(document).ready(function(){

    $("#terminal").focus(function(){
        $("#command").focus();
    });

    $("#command").focus(function() {
        isTerminalActive = true;
        $(this).bind('keydown', keyDownHandler);

    });

    $("#command").blur(function() {
        //console.log('Handler for .blur() called.');
        isTerminalActive = false;
        $(this).unbind('keydown');
    });

    $("#command").focus();

});



function autoCompleteCommand(){
    var content = $("#command").text();
    var options = [];
    if(content.length > 0){
        $(supportedCommands).each(function(index, command){
            if(command.startsWith(content)){
                options.push(command);
            }
        });
    }
    if(options.length == 1){
        $("#command").text(options[0]);
    }
    cursorPosition = $("#command").text().length - 1;
    placeCaretAtEnd(document.getElementById("command"));
}



function detectCharCodeType(event, keyCode){
    if(keyCode == 13){
        event.preventDefault();
        saveCommand();

    }
    if(keyCode == 38){
        event.preventDefault();
        showPreviousCommand();
    }

    if(keyCode == 40){
        event.preventDefault();
        showNextCommand();
    }

    if(keyCode == 9){
        event.preventDefault();
        autoCompleteCommand();
    }

}

function keyDownHandler(event){
    event = event || window.event;
    var keyCode = event.which || event.keyCode;
    detectCharCodeType(event, keyCode);
}


function saveCommand(){
    var content = $("#command").text();
    $("#command").text("");
    commandHistory.push(content);
    commandIndex = commandHistory.length;
    var responseCode = parseCommand(content);
    if(responseCode == 0){
        showIllegalCommandError();
    }
    if(responseCode == -1){
        showIllegalOptionError();
    }

}


function placeCaretAtEnd(el) {
    el.focus();
    if (typeof window.getSelection != "undefined"
        && typeof document.createRange != "undefined") {
        var range = document.createRange();
        range.selectNodeContents(el);
        range.collapse(false);
        var sel = window.getSelection();
        sel.removeAllRanges();
        sel.addRange(range);
    } else if (typeof document.body.createTextRange != "undefined") {
        var textRange = document.body.createTextRange();
        textRange.moveToElementText(el);
        textRange.collapse(false);
        textRange.select();
    }
}


function showNextCommand(){
    if((commandIndex + 1) >= commandHistory.length){
        return;
    }
    else{
        $("#command").text(commandHistory[++commandIndex]);
        placeCaretAtEnd(document.getElementById("command"));
    }
}

function showPreviousCommand(){
    if((commandIndex - 1) < 0){
        return;
    }
    else{
        $("#command").text(commandHistory[--commandIndex]);
        placeCaretAtEnd(document.getElementById("command"));
    }
}
