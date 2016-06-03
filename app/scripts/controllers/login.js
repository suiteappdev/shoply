'use strict';

/**
 * @ngdoc function
 * @name shoplyApp.controller:LoginCtrl
 * @description
 * # LoginCtrl
 * Controller of the shoplyApp
 */
angular.module('shoplyApp')
  .controller('LoginCtrl', function ($scope, constants, $state, storage, account, $rootScope) {
  	$scope.load = function(){

  	}

  	$scope.login = function(){
	  	var _success = function(res){
 				storage.save('token', res.token);
                storage.save('user', res.user);
				$rootScope.isLogged = res.user;
				$rootScope.user = res.user;
                $state.go(constants.login_state_sucess);
	  	};

	  	var _error = function(res){
	  		console.log(data);
	  	};

	  	account.usuario().ingresar($scope.form.data).then(_success, _error);  		
	  };
  });
