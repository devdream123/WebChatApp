var app = angular.module('webchat', ['ui.router']);

app.config(($stateProvider, $urlRouterProvider) => {
    var initialState = {
        name: 'login',
        url: '/login',
        templateUrl: '/components/login/login.html',
        controller: 'loginController'
    }
    var chatState = {
        name: 'chat',
        url: '/chat/:username',
        templateUrl: './components/chat/chat.html',
        controller: 'chatController'
    }

    var privatechatState = {
        name: 'privateChat',
        url: '/privateChat:userDetails',
        templateUrl: './components/private-chat/privateChat.html',
        controller: 'privateChatController'
    }

    $stateProvider.state(initialState);
    $stateProvider.state(chatState);
    $stateProvider.state(privatechatState);
    $urlRouterProvider.otherwise('/login');
});