/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
angular.module('myApp', [])
        .provider('Weather', function() {
            var apiKey = "";
            this.setApiKey = function(key) {
                if (key)
                    this.apiKey = key;
            };
            this.$get = function($q,$http) {
                var self = this;
                return {
                    getWeatherForecast: function(city){
                        var d = $q.defer();
                        $http({
                            method:'GET',
                            url: self.getUrl("forecast", city ),
                            cache: true
                        }).success(function(data){
                            //wgd return object
                            d.resolve(data.forecast.simpleforecast);
                        }).error(function(err){
                            d.reject(err);
                        });
                        return d.promise;
                    }
                    //Service object
                }
            }
            this.getUrl = function(type, ext) {
                return "http://api.wunderground.com/api/" +
                        this.apiKey + "/" + type + "/q/" +
                        ext + '.json';
            }
        })
        .config(function(WeatherProvider) {
            WeatherProvider.setApiKey('82921fa5ebe839db');
        })
        .controller('MainCtrl', function($scope, $timeout, Weather) {
            //Build the date object
            $scope.date = {};
            //Update function
            var updateTime = function() {
                $scope.date.raw = new Date();
                $timeout(updateTime, 1000)
            }
            //Kick off the update function
            updateTime();
            $scope.weather = {};
            Weather.getWeatherForecast("CA/San_Francisco")
                    .then(function(data){
                        $scope.weather.forecast =data;
                    });
        });