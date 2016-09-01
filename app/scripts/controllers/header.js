'use strict';

/**
 * @ngdoc function
 * @name shoplyApp.controller:HeaderCtrl
 * @description
 * # HeaderCtrl
 * Controller of the shoplyApp
 */
angular.module('shoplyApp')
  .controller('HeaderCtrl', function ($scope, api, $state, modal, $timeout, $window, $rootScope, storage) {
  	$scope.logout = function(){
  		storage.delete('token');
  		storage.delete('user');
  		delete $rootScope.isLogged;
  		$state.go('login');
  		$window.location.reload();
  	}

  	$scope.cambiarEmpresa = function(){
         modal.show({templateUrl : 'views/company/conectar.html', size :'sm', scope: $scope, backdrop:'static'}, function($scope){
            var _user = $rootScope.user;
            $scope.loading = true;
            
            api.empresa($scope._company).get().success(function(res){
              $timeout(function(){
                $rootScope.user._company = res;
                storage.update('user', $rootScope.user);
                toastr.success('Conectado con: ' + res.data.empresa , {timeOut: 10000});
                $scope.loading = false;
                $scope.$close();
              }, 5000);
            });       
         });        
  	}
  });
