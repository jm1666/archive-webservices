'use strict';

angular.module('myApp.view2', ['ngRoute'])

    .config(['$routeProvider', function ($routeProvider) {
        $routeProvider.when('/view2', {
            templateUrl: 'view2/view2.html',
            controller: 'View2Ctrl'
        });
    }])

    .controller('View2Ctrl', ['$scope', '$http', function ($scope, $http) {
        // You need to specify an APIKey
        var APIKey = '';
        // What user are we looking up?
        $scope.UserID = '';



        $scope.refreshPosts = function () {
            // URL Encode that '+'
            var EncUserID = $scope.UserID.replace('+', '%2B');
            // Define the JSON feed
            var jsonFeed = "https://query.yahooapis.com/v1/public/yql?q=select%20*%20from%20google.plus.activities%20where%20key%3D%22" + APIKey + "%22%20and%20activityId%20in%20(select%20items.id%20from%20google.plus.activities.list%20where%20key%3D%22" + APIKey + "%22%20and%20userId%3D%22" + EncUserID + "%22)&format=json&env=store%3A%2F%2Fdatatables.org%2Falltableswithkeys";
            // Actually fetch the data
            $http.get(jsonFeed).success(function (data) {
                // Define the unique market cities
                $scope.posts = data.query.results.json;
            });
        }
    }]).filter('unsafe', function ($sce) {
        return function (val) {
            return $sce.trustAsHtml(val);
        };
    });