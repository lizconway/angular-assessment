/**
 * Sample javascript file
 * Testing Angular Single Page Application
 */

var app = angular.module('myApp', ['ngRoute']);

app.config(function($routeProvider) {
  $routeProvider

  .when('/', {
    templateUrl : 'home.html',
    controller  : 'HomeController'
  })

  .when('/blog', {
    templateUrl : 'blog.html',
    controller  : 'BlogController'
  })

  .when('/about', {
    templateUrl : 'about.html',
    controller  : 'AboutController'
  })

  .otherwise({redirectTo: '/'});
});

app.controller('HomeController', function($scope) {
  $scope.message = 'Hello from HomeController';
});

app.controller('BlogController', function($scope) {
  $scope.message = 'Hello from BlogController';
});

app.controller('AboutController', function($scope) {
  $scope.message = 'Hello from AboutController';
});
