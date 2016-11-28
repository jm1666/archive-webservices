'use strict';

angular.module('myApp.view3', ['ngRoute', 'myApp.services'])

    .config(['$routeProvider', function ($routeProvider) {
        /**
         * After setting appId you need to initialize the module.
         * You can pass the appId on the init method as a shortcut too.
         */

        $routeProvider.when('/view3', {
            templateUrl: 'view3/view3.html',
            controller: 'View3Ctrl'
        });
    }])
    .controller('View3Ctrl', ['$scope', 'twitterService', function ($scope, twitterService) {

        // Define user empty data :/
        $scope.tweets = [];

        twitterService.initialize();

        //using the OAuth authorization result get the latest 20 tweets from twitter for the user
        $scope.refreshTimeline = function() {
            twitterService.getLatestTweets().then(function(data) {
                $scope.tweets = data;
            });
        };

        //when the user clicks the connect twitter button, the popup authorization window opens
        $scope.connectButton = function() {
            twitterService.connectTwitter().then(function() {
                if (twitterService.isReady()) {
                    //if the authorization is successful, hide the connect button and display the tweets
                    $('#connectButton').fadeOut(function(){
                        $('#getTimelineButton, #signOut').fadeIn();
                        $scope.refreshTimeline();
                    });
                }
            });
        };

        //sign out clears the OAuth cache, the user will have to reauthenticate when returning
        $scope.signOut = function() {
            twitterService.clearCache();
            $scope.tweets = {};
            $('#getTimelineButton, #signOut').fadeOut(function(){
                $('#connectButton').fadeIn();
            });
        };

        //if the user is a returning user, hide the sign in button and display the tweets
        if (twitterService.isReady()) {
            $('#connectButton').hide();
            $('#getTimelineButton, #signOut').show();
            $scope.refreshTimeline();
        }

    }]);

