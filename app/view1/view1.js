'use strict';

angular.module('myApp.view1', ['ngRoute', 'facebook'])

    .config(['FacebookProvider', '$routeProvider', function (FacebookProvider, $routeProvider) {
        var myAppId = '';

        // You can set appId with setApp method
        // FacebookProvider.setAppId('myAppId');

        /**
         * After setting appId you need to initialize the module.
         * You can pass the appId on the init method as a shortcut too.
         */
        FacebookProvider.init(myAppId);

        $routeProvider.when('/view1', {
            templateUrl: 'view1/view1.html',
            controller: 'View1Ctrl'
        });
    }])
    .controller('View1Ctrl', ['$scope', '$timeout', 'Facebook', function ($scope, $timeout, Facebook) {
        // Define user empty data :/
        $scope.user = {};

        // Defining user logged status
        $scope.logged = false;

        // And some fancy flags to display messages upon user status change
        $scope.byebye = false;
        $scope.salutation = false;

        /**
         * Watch for Facebook to be ready.
         * There's also the event that could be used
         */
        $scope.$watch(
            function () {
                return Facebook.isReady();
            },
            function (newVal) {
                if (newVal)
                    $scope.facebookReady = true;
            }
        );

        var userIsConnected = false;

        Facebook.getLoginStatus(function (response) {
            if (response.status == 'connected') {
                userIsConnected = true;
                $scope.logged = true;
                $scope.me();
                $scope.feed();
            }
        });

        /**
         * IntentLogin
         */
        $scope.IntentLogin = function () {
            if (!userIsConnected) {
                $scope.login();
            } else {
                $scope.logged = true;
                $scope.me();
                $scope.feed();
            }
        };

        /**
         * Login
         */
        $scope.login = function () {
            Facebook.login(function (response) {
                if (response.status == 'connected') {
                    $scope.logged = true;
                    $scope.me();
                    $scope.feed();
                }

            }, {
                scope: 'user_posts,user_friends,user_status',
                return_scopes: true
            });
        };

        $scope.getfeed = function () {
            Facebook.api('/me/feed?fields=message,created_time,story,full_picture,link', function (response) {
                /**
                 * Using $scope.$apply since this happens outside angular framework.
                 */
                $scope.$apply(function () {
                    $scope.feed = response;
                    console.log(response);
                });
            });
        };
        /**
         * me
         */
        $scope.me = function () {
            Facebook.api('/me?fields=birthday,name', function (response) {
                /**
                 * Using $scope.$apply since this happens outside angular framework.
                 */
                $scope.$apply(function () {
                    $scope.user = response;
                });

            });
            Facebook.api('/me/picture', function (response) {
                /**
                 * Using $scope.$apply since this happens outside angular framework.
                 */
                $scope.$apply(function () {
                    $scope.avatar = response.data;
                });

            });
        };

        $scope.feed = function () {
            Facebook.api('/me/feed?fields=message,created_time,story,full_picture,link', function (response) {
                /**
                 * Using $scope.$apply since this happens outside angular framework.
                 */
                $scope.$apply(function () {
                    $scope.feed = response;
                    console.log(response);
                });
            });
        };

        /**
         * Logout
         */
        $scope.logout = function () {
            Facebook.logout(function () {
                $scope.$apply(function () {
                    $scope.user = {};
                    $scope.logged = false;
                });
            });
        };

        /**
         * Taking approach of Events :D
         */
        $scope.$on('Facebook:statusChange', function (ev, data) {
            if (data.status == 'connected') {
                $scope.$apply(function () {
                    $scope.salutation = true;
                    $scope.byebye = false;
                });
            } else {
                $scope.$apply(function () {
                    $scope.salutation = false;
                    $scope.logged = false;
                    $scope.feed = {};

                    // Dismiss byebye message after two seconds
                    $timeout(function () {
                        $scope.byebye = false;
                    }, 2000)
                });
            }
        });
    }])
    .filter('split', function() {
        return function(input, splitChar, splitIndex) {
            // do some bounds checking here to ensure it has that index
            return input.split(splitChar)[splitIndex];
        }
    });

