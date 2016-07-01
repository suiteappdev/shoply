'use strict';

/**
 * @ngdoc function
 * @name shoplyApp.controller:LoginCtrl
 * @description
 * # LoginCtrl
 * Controller of the shoplyApp
 */
angular.module('shoplyApp')
  .controller('LoginCtrl', function ($scope, sweetAlert, modal, constants, $state, storage, account, $rootScope) {
  	$scope.load = function(){

  	}

  	$scope.login = function(){
  		if($scope.loginForm.$invalid){
            modal.incompleteForm();
  		}

	  	var _success = function(res){
 				storage.save('token', res.token);
                storage.save('user', res.user);
				$rootScope.isLogged = res.user;
				$rootScope.user = res.user;
                $state.go(constants.login_state_sucess);
	  	};

	  	var _error = function(res){
        	sweetAlert.swal("Formulario incorrecto.", "Las credenciales ingresadas son incorrectas.", "error");
	  	};

	  	account.usuario().ingresar($scope.form.data).then(_success, _error);  		
	  };
  });
