'use strict';

/**
 * @ngdoc function
 * @name shoplyApp.controller:HeaderCtrl
 * @description
 * # HeaderCtrl
 * Controller of the shoplyApp
 */
angular.module('shoplyApp')
  .controller('HeaderCtrl', function ($scope, api, $state, $rootScope, storage) {
  	$scope.logout = function(){
  		storage.delete('token');
  		storage.delete('user');
  		delete $rootScope.isLogged;
  		$state.go('login');
  	}
  });
