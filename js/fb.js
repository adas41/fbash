/**
 * Created with JetBrains WebStorm.
 * User: Arindam
 * Date: 6/30/13
 * Time: 2:58 AM
 * To change this template use File | Settings | File Templates.
 */

var userId;

window.fbAsyncInit = function() {
    FB.init({
        appId      : '632616413418110',
        channelUrl : 'http://localhost/facebash/channel.html',
        status     : true,
        cookie     : true,
        xfbml      : true
    });


    FB.getLoginStatus(function(response) {
        $("#login-status").text("Logging in with pre-authenticated information");
        if (response.status === 'connected') {
            FB.api('me', function(response) {
                userId = response.id;
            });
        }
        else if (response.status === 'not_authorized') {
            login();
        }
        else {
            login();
        }
    });

};


function login() {

    FB.login(function(response) {

        if (response.authResponse) {
            FB.api('me', function(response) {
                isLoggedIn = true;
            });
        } else {
            // cancelled
        }
    }, {scope: 'user_location,friends_location,friends_online_presence,user_status,user_checkins, friends_status, read_stream, read_insights, friends_photos'});
}


function checkConnection() {
    FB.api('me', function(response) {
        alert('Good to see you, ' + response.name + '.');
    });

    FB.api('me/permissions', function (response) {
        //console.log(response.data);
    } );
}


function findFriendsByName(keyword){
    var resultSet = [];
    FB.api('me/friends?fields=id,name', function(response) {
        //$("#result").html("");
        $(response.data).each(function(index, friend){
           if(friend.name.toLowerCase().startsWith(keyword.toLowerCase())){
               resultSet.push({'id': friend.id, 'name': friend.name});
               //$("#result").append("<span class='result-col'>" + friend.id + "</span><span class='result-col'>" + friend.name + "</span></br>");
           }
        });
        //console.log(resultSet.length + " results saved");
        showResults(resultSet);
    });
}

function findOnlineFriends(){
    var resultSet = [];
    var query = "SELECT uid, name, online_presence FROM user WHERE uid IN (SELECT uid2 FROM friend WHERE uid1=me()) AND online_presence IN ('active', 'idle')";
    FB.api('/fql', { q:{"query1":query} }, function(response) {
        $(response.data[0].fql_result_set).each(function(index, friend){
            resultSet.push({'id': friend.uid, 'name': friend.name, 'status': friend.online_presence});
        });
        showResults(resultSet);
    });
}

function findFriendsByLocation(keyword){
    var resultSet = [];
    var query = "SELECT uid, name, current_location FROM user WHERE uid IN (SELECT uid2 FROM friend WHERE uid1=me()) ORDER BY current_location";
    FB.api('/fql', { q:{"query1":query} }, function(response) {
        $(response.data[0].fql_result_set).each(function(index, friend){
            var location = friend.current_location;
            for(var prop in location) {
                if(typeof location[prop] === "string" && location[prop].indexOf(keyword) !== -1){
                    resultSet.push({'id': friend.uid, 'name': friend.name, 'location': location[prop]});
                    break;
                }
            }
        });
        showResults(resultSet);
    });
}

function showPostsFromFriend(keyword){
    var resultSet = [];
    var getFriendQuery = "SELECT uid, name FROM user WHERE uid IN (SELECT uid2 FROM friend WHERE uid1=me()) AND ( first_name = '" + keyword + "' OR name = '" + keyword + "')";
    console.log(getFriendQuery);
    var friendId, friendName;
    FB.api('/fql', { q:{"query1": getFriendQuery} }, function(response) {
        $(response.data[0].fql_result_set).each(function(index, friend){
            friendId = friend.uid;
            friendName = friend.name;
            console.log(friendName);
        });
        if(typeof  friendId !== 'undefined'){
            var getPostQuery = "SELECT  message, created_time FROM stream WHERE source_id = me() AND actor_id = " + friendId + " AND is_hidden = 0 AND message != '' ORDER BY created_time DESC LIMIT 100";
            FB.api('/fql', { q:{"query1": getPostQuery} }, function(response) {
                $(response.data[0].fql_result_set).each(function(index, friend){
                    var dateTime = (new Date(friend.created_time * 1000).getMonth() + 1) + "/" + new Date(friend.created_time * 1000).getDate() + "/" + new Date(friend.created_time * 1000).getFullYear();
                    resultSet.push({'name': friendName, 'message': friend.message,  'createdTime': dateTime});
                });
                showResults(resultSet);
            });
        }
        else{
            resultSet.push({'message': "Friend '" + keyword + "' doesn't exist"});
            showResults(resultSet);
        }

    });

}


function showPostsFromAllFriends(){
    var resultSet = [];
    var getPostQuery = "SELECT actor_id, message, created_time FROM stream WHERE source_id = me() AND actor_id !=" + userId + " AND is_hidden = 0 AND message != '' ORDER BY created_time DESC LIMIT 1000000";
    FB.api('/fql', { q:{"query1": getPostQuery} }, function(response) {
        $(response.data[0].fql_result_set).each(function(index, friend){
            var dateTime = (new Date(friend.created_time * 1000).getMonth() + 1) + "/" + new Date(friend.created_time * 1000).getDate() + "/" + new Date(friend.created_time * 1000).getFullYear();
            resultSet.push({'id': friend.actor_id, 'message': friend.message,  'createdTime': dateTime});
        });
        showResults(resultSet);
    });

}

function showPhotosByFriend(keyword){
    var resultSet = [];
    var getFriendQuery = "SELECT uid, name FROM user WHERE uid IN (SELECT uid2 FROM friend WHERE uid1=me()) AND ( first_name = '" + keyword + "' OR name = '" + keyword + "')";
    var friendId, friendName;
    FB.api('/fql', { q:{"query1": getFriendQuery} }, function(response) {
        $(response.data[0].fql_result_set).each(function(index, friend){
            friendId = friend.uid;
            friendName = friend.name;
        });
        if(typeof  friendId !== 'undefined'){
            var getPostQuery = "SELECT owner, caption, src_big, src_small, modified FROM photo WHERE aid IN (SELECT aid FROM album WHERE owner = " + friendId + ")ORDER BY created DESC LIMIT 40";
            FB.api('/fql', { q:{"query1": getPostQuery} }, function(response) {
                $(response.data[0].fql_result_set).each(function(index, friend){
                    var dateTime = (new Date(friend.created_time * 1000).getMonth() + 1) + "/" + new Date(friend.modified * 1000).getDate() + "/" + new Date(friend.created_time * 1000).getFullYear();
                    resultSet.push({'name': friendName,  'photo': "<img src='" + friend.src_small + "' />"});
                });
                showResults(resultSet);
            });
        }
        else{
            resultSet.push({'message': "Friend '" + keyword + "' doesn't exist"});
            showResults(resultSet);
        }

    });
}

/*function showResults(resultSet){
    //var counter = 0;
    $("#result").html("");
    $(resultSet).each(function(index, friend){
        //counter++;
        $("#result").append("<span class='result-col'>" + friend.id + "</span><span class='result-col'>" + friend.name + "</span></br>");
        *//*if(counter == 7){
            counter = 0;
            $("#result").append("<div class='result-msg'>Hit return to see more results...</div>");
        }*//*
    });
    //$(".terminal").animate({ $(".terminal").scrollTop: $(".terminal").scrollHeight }, "slow");
    var objDiv = document.getElementById("terminal");
    objDiv.scrollTop = objDiv.scrollHeight;
}*/

// Load the SDK Asynchronously
(function(d){
    var js, id = 'facebook-jssdk', ref = d.getElementsByTagName('script')[0];
    if (d.getElementById(id)) {return;}
    js = d.createElement('script'); js.id = id; js.async = true;
    js.src = "http://connect.facebook.net/en_US/all.js";
    ref.parentNode.insertBefore(js, ref);
}(document));




