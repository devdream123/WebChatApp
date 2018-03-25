angular.module('webchat')
    .controller('loginController', function($scope, $state, $timeout) {
        var onlineUserList = [];
        var socket = io();
        var currentUsername;

        socket.emit("onlineUserList");
        socket.on("onlineUserList", (connectedUsers) => {
            onlineUserList = connectedUsers;
            console.log('onlineUserList: ', onlineUserList);
        });

        $scope.checkAuth = () => {
            currentUsername = $scope.user;
            var randomGuest = Math.floor((Math.random() * 1000000000) + 1);

            console.log("onlineList: ", onlineUserList);

            /**Username is empty, generate random name */
            /**Check if username is existed */
            if (typeof currentUsername === "undefined" || currentUsername === "") {
                if (onlineUserList.indexOf(randomGuest) === -1) {
                    currentUsername = randomGuest;
                    doLogin();
                } else {
                    console.log("Please click log in again!");
                    $scope.show = true;
                }
            } else {
                if (onlineUserList.indexOf(currentUsername) !== -1) {
                    console.error("User is existed");
                    $scope.show = true;
                } else {
                    doLogin();
                }
            }
        }

        $scope.closeAlert = function() {
            $scope.show = false;
        }

        function doLogin() {
            socket.emit('connectedUser', currentUsername);
            console.log("currentUserName BEFORE STATE in login: ", currentUsername);
            $state.go('chat', { username: currentUsername });
        }
    });