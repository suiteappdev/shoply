'use strict';

/**
 * @ngdoc function
 * @name shoplyApp.controller:LoginCtrl
 * @description
 * # CompanyCtrl
 * Controller of the shoplyApp
 */
angular.module('shoplyApp')
  .controller('CompanyCtrl', function ($scope, $rootScope,  sweetAlert, constants, $state, modal, api, storage) {
  	$scope.load = function(){

  	}

  	$scope.create = function(){
      api.empresa().post(angular.extend($scope.form, { _user : angular.fromJson(window.localStorage.user)._id})).success(function(res){
        if(res){
            var _user = angular.extend(angular.fromJson(window.localStorage.user), {_company : res._id});
            
            api.user(angular.fromJson(window.localStorage.user)._id).put(_user).success(function(res){
               storage.update('user', _user);
               sweetAlert.swal("Bien Hecho.", "has actualizado tu empresa correctamente.", "success");
               delete $scope.form;
            });
        }
      });
  	}

  	$scope.upload = function(){
	      modal.show({templateUrl : 'views/company/logo-upload.html', size :'md', scope: $scope}, function($scope){
	          $scope.$close();
	      });
  	}
  	
  });
