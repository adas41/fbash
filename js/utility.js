/**
 * Created with JetBrains WebStorm.
 * User: Arindam
 * Date: 6/25/13
 * Time: 11:19 PM
 * To change this template use File | Settings | File Templates.
 */

if (typeof String.prototype.startsWith != 'function') {
    String.prototype.startsWith = function (str){
        return this.slice(0, str.length) == str;
    };
}

Object.size = function(obj) {
    var size = 0, key;
    for (key in obj) {
        if (obj.hasOwnProperty(key)) size++;
    }
    return size;
};

function showCursor(){
    console.log(cursorPosition);
}

function getSelectionHtml() {
    var html = "";
    if (typeof window.getSelection != "undefined") {
        var sel = window.getSelection();
        if (sel.rangeCount) {
            html = sel;
        }
    } else if (typeof document.selection != "undefined") {
        if (document.selection.type == "Text") {
            html = document.selection.createRange().htmlText;
        }
    }
    return html;
}


function showResults(resultSet){
    var totalWidth = $("#result").width();

    $("#result").html("");
    $(resultSet).each(function(index, data){
        var numOfFields = parseInt(Object.size(data));
        var sizeOfSpan = Math.round(totalWidth / numOfFields);
        for(var prop in data) {
            var span = document.createElement("span");
            $(span).attr({
               'class': 'result-col'
            });
            $(span).css({
                'width': sizeOfSpan + "px",
                'max-width': sizeOfSpan + "px"
            });
            //$(span).text(data[prop]);
            span.innerHTML = data[prop];
            $("#result").append(span);
        }
        $("#result").append("<br>");
    });
    var terminal = document.getElementById("terminal");
    terminal.scrollTop = terminal.scrollHeight;
}

function showIllegalCommandError(){
    $("#result").html("");
    $("#result").append("<span>The command \'" + commandHistory[commandHistory.length - 1] + "\' is not supported</span><br><br>");
}

function showIllegalOptionError(){
    $("#result").html("");
    $("#result").append("<span>Illegal option: \'" + commandHistory[commandHistory.length - 1] + "\'</span><br><br>");
}

function clearScreen(){
    $("#result").html("");
}


function hideTerminal(){
    $("#terminal").hide("slow", function(){
        var showTerminalImg = document.createElement("img");
        $(showTerminalImg).attr({
           'src': './img/show_terminal.png',
           'class': 'show-icon'
        });
        $(showTerminalImg).on('click', function(event){
            $(showTerminalImg).css('display', 'none');
            $("#terminal").show("slow", function(){
               $(showTerminalImg).remove();
               $("#command").focus();
            });
        });
        $('body').append(showTerminalImg);
    });
}


function showCommandUsage(keyword){
    switch (keyword){

        case "find":
                    var resultSet = [];
                    resultSet.push({'syntax': 'find -o', 'use': '<i>Find all online friends</i>'});
                    resultSet.push({'syntax': 'find -n \"keyword\"', 'use': '<i>Find all friends with name starting with \"keyword\"</i>'});
                    resultSet.push({'syntax': 'find -l \"keyword\"', 'use': '<i>Find all friends with location containing \"keyword\"</i>'});
                    showResults(resultSet);
                    break;

        case "show":
                    var resultSet = [];
                    resultSet.push({'syntax': 'show -poa', 'use': '<i>Show all recent posts on my wall from friends</i>'});
                    resultSet.push({'syntax': 'show -phb \"name\"', 'use': '<i>Show recent photos uploaded by \"name\"</i>'});
                    resultSet.push({'syntax': 'show -pof \"name\"', 'use': '<i>Show recent posts on my wall by \"name\"</i>'});
                    showResults(resultSet);
                    break;

        case "cls":
                    var resultSet = [];
                    resultSet.push({'syntax': 'cls', 'use': '<i>Clear Screen</i>'});
                    showResults(resultSet);
                    break;

        case "exit":
                    var resultSet = [];
                    resultSet.push({'syntax': 'exit', 'use': '<i>Exit Shell</i>'});
                    showResults(resultSet);
                    break;

        default :
                    var resultSet = [];
                    resultSet.push({'message': 'Supported commands: \'find\',\'show\',\'cls\',\'exit\'.<br>Type <i>help \'command\' to learn more about each command</i>'});

                    showResults(resultSet);
                    break;

    }
}
