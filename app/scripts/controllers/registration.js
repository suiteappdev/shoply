'use strict';

/**
 * @ngdoc function
 * @name shoplyApp.controller:RegistrationCtrl
 * @description
 * # RegistrationCtrl
 * Controller of the shoplyApp
 */
angular.module('shoplyApp')
  .controller('RegistrationCtrl', function ($scope, account, sweetAlert) {
  	
  	$scope.register = function(){
  		var _success = function(data){
        if(data){
           sweetAlert.swal("Registro completado.", "Te has registrado correctamente.", "success");
           delete $scope.formRegister;
        }
  		};

  		var _error = function(data){
        sweetAlert.swal("No se pudo registrar.", "Ha ocurrido un error intentalo mas tarde.", "error");
  		};

  		account.usuario().register(angular.extend($scope.formRegister.data, {username : $scope.formRegister.data.email})).then(_success, _error);
  	};

    $scope.login = function(){
      var _success = function(data){
        console.log(data);
      };

      var _error = function(status){
      
      };

      account.login($scope.form.data).then(_success, _error);
    };

  });
