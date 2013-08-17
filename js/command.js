/**
 * Created with JetBrains WebStorm.
 * User: Arindam
 * Date: 6/30/13
 * Time: 3:23 AM
 * To change this template use File | Settings | File Templates.
 */

/**
 *
 * @param command
 * @returns 1 : "valid command", 0 : "command does not exist", -1: "Illegal options"
 */

function parseCommand(command){
    var cmd = command.match(/(?:[^\s"]+|"[^"]*")+/g);
    console.log(cmd);
    if(supportedCommands.indexOf(cmd[0]) == -1){
        return 0;
    }
    if(cmd.length == 1){
        switch (cmd[0]){
            case "exit":   hideTerminal();
                           return 1;

            case "cls":    clearScreen();
                           return 1;

            case "help":   showCommandUsage();
                           return 1;

            default:       return 0;
        }
    }
    if(cmd.length == 2){
        if(cmd[0] == "find"){
            if(cmd[1] == "-o")  {
                findOnlineFriends();
                return 1;
            }
            else{
                return -1;
            }
        }
        if(cmd[0] == "show"){
            if(cmd[1] == "-poa")  {
                showPostsFromAllFriends();
                return 1;
            }
            else{
                return -1;
            }
        }

        if(cmd[0] == "help"){
            if(cmd[1] == "find"){
                showCommandUsage("find");
                return 1;
            }
            else if(cmd[1] == "show"){
                showCommandUsage("show");
                return 1;
            }
            else if(cmd[1] == "cls"){
                showCommandUsage("cls");
                return 1;
            }
            else if(cmd[1] == "exit"){
                showCommandUsage("exit");
                return 1;
            }
            else{
                return -1;
            }
        }
    }
    if(cmd.length == 3){
        if(cmd[0] == "find"){
            if(cmd[1] == "-n")  {
                var keyword = cmd[2].replace(/"/g, '');
                findFriendsByName(keyword);
                return 1;
            }
            else if(cmd[1] == "-l")  {
                var keyword = cmd[2].replace(/"/g, '');
                findFriendsByLocation(keyword);
                return 1;
            }
            else{
                return -1;
            }
        }
        if(cmd[0] == "show"){
            if(cmd[1] == "-pof")  {
                var keyword = cmd[2].replace(/"/g, '');
                showPostsFromFriend(keyword);
                return 1;
            }
            else if(cmd[1] == "-phb")  {
                var keyword = cmd[2].replace(/"/g, '');
                showPhotosByFriend(keyword);
                return 1;
            }
            else{
                return -1;
            }
        }

    }
}
