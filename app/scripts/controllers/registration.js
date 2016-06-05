'use strict';

/**
 * @ngdoc function
 * @name shoplyApp.controller:RegistrationCtrl
 * @description
 * # RegistrationCtrl
 * Controller of the shoplyApp
 */
angular.module('shoplyApp')
  .controller('RegistrationCtrl', function ($scope, account) {
  	
  	$scope.register = function(){
  		var _success = function(data){
        console.log(data);
  		};

  		var _error = function(data){
        console.log(data);
  		};

  		account.usuario().register(angular.extend($scope.formRegister.data, {username : $scope.formRegister.data.email})).then(_success, _error);
  	};

    $scope.login = function(){
      var _success = function(data){
        console.log(data);
      };

      var _error = function(status){
        console.log(status);
      };

      account.login($scope.form.data).then(_success, _error);
    };

  });
