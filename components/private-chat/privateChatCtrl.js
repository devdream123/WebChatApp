angular.module('webchat')
    .controller('privateChatController', function($scope, $state) {
        var socket = io();
        var usersDetails = $state.params.userDetails;
        var usersData = angular.fromJson(usersDetails);
        var partnerUserName = usersData.partnerUsername;
        var currentUserNamae = usersData.currentUserName;
        const roomNumber = 'Room 1';
        document.getElementById('partnerName').innerHTML = partnerUserName;

        socket.emit('join private room', roomNumber);

        $scope.send = () => {
            var newMessage = { "user": currentUserNamae, "message": $scope.message }
            socket.emit('private message', newMessage); // Emit user and his/her messages to the server to process
            $scope.message = "";
        }

        socket.on('private message', (msg) => {
            console.log("msg: ", msg);
            var msgLine = document.createElement('li');
            msgLine.appendChild(document.createTextNode(msg.user + ": " + msg.message));
            msgLine.className = "list-group-item borderless";
            msgLine.style.border = "none";
            document.getElementById('messages').appendChild(msgLine);
        });

    });