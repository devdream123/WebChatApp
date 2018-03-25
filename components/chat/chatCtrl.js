angular.module('webchat')
    .controller('chatController', function($scope, $state, $timeout) {
        var socket = io();
        var currentUser = $state.params.username;
        var onlineUserList = [];
        socket.emit('onlineUserList')
        socket.on('onlineUserList', (onlineUsers) => {
            $timeout(() => {
                onlineUserList = onlineUsers;
                let currentUserIndex = onlineUserList.indexOf(currentUser);
                if (currentUserIndex > -1) {
                    onlineUserList.splice(currentUserIndex, 1);
                }
                $scope.currentUserRecord = onlineUserList;
            }, 0);
        });

        $scope.send = () => {
            var newMessage = { "user": currentUser, "message": $scope.message }
            socket.emit('chat message', newMessage); // Emit user and his/her messages to the server to process
            $scope.message = "";
        }

        socket.on('public message', (msg) => {
            console.log("msg: ", msg);
            var msgLine = document.createElement('li');
            msgLine.appendChild(document.createTextNode(msg.user + ": " + msg.message));
            msgLine.className = "list-group-item borderless";
            msgLine.style.border = "none";
            document.getElementById('messages').appendChild(msgLine);
        });

        $scope.openPrivateChat = (user) => {
            var usersData = angular.toJson({ "currentUserName": currentUser, "partnerUsername": user });
            var privateChatUrl = $state.href('privateChat', { userDetails: usersData });
            window.open(privateChatUrl, '_blank');
        }
    })