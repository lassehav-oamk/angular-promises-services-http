var app = angular.module('myApp', []);

app.factory('AsyncDemos', ['$q', '$timeout', '$http', function($q, $timeout, $http) {
   
    return {
        randomString: function()
        {
            return $q(function(resolve, reject){
                $timeout(function(){

                    /* Function to randomize text */
                    var letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";
                    var text = "";
                    for( var i=0; i < 10; i++ )
                    {
                        text += letters.charAt(Math.floor(Math.random() * letters.length));
                    }
                    /* The returned value will be passed to the $timeout promise resolve object 
                       and thus it is available for us to use */
                    return text;
                    
                }, 500).then(function(dataFromTimeoutFunction){
                    resolve(dataFromTimeoutFunction);
                });
            });
        },
        randomUser: function()
        {
            return $q(function(resolve, reject){
                $http({
                    method: 'GET',
                    url: 'https://randomuser.me/api'
                    }).then(function successCallback(response) {
                        /* this callback will be called asynchronously
                           when the response is available*/

                        /* Notice that the response object has different fields available.
                           See the details from here: https://docs.angularjs.org/api/ng/service/$http

                           The data property has the body of the request response, so we'll use that one here */
                        resolve(response.data)
                    }, function errorCallback(response) {
                        // called asynchronously if an error occurs
                        // or server returns response with an error status.
                        reject();
                });
            });
        }
    };
 }]);

app.controller('MyAppCtrl', function($scope, AsyncDemos) {

    /* initialize the view data structure */
    $scope.results = {
        a: "",
        b: {
            gender: "",
            name: "",
            location: "", 
            email: ""
        }
    };

    /* click handler for the first demo button*/
    $scope.StartDemoA = function() {        
        AsyncDemos.randomString().then(function(result){
            $scope.results.a = result;
        });
    };

    /* click handler for the second demo button */
    $scope.StartDemoB = function()
    {
        // results will contain the JSON output from randomuser.me/api
        AsyncDemos.randomUser().then(function(result){
            $scope.results.b.gender = result.results[0].gender;
            $scope.results.b.name = result.results[0].name.title + " " + result.results[0].name.first + " " + result.results[0].name.last;
            $scope.results.b.location = result.results[0].location.city + "," + result.results[0].location.street;
            $scope.results.b.email = result.results[0].email;
        });
    }
});