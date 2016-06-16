'use strict';

/**
 * @ngdoc function
 * @name shoplyApp.controller:LoginCtrl
 * @description
 * # CompanyCtrl
 * Controller of the shoplyApp
 */
angular.module('shoplyApp')
  .controller('CompanyCtrl', function ($scope,sweetAlert, constants, $state, modal, api, storage) {
  	$scope.load = function(){

  	}

  	$scope.create = function(){
      api.empresa().post(angular.extend($scope.form, { _user : angular.fromJson(window.localStorage.user)._id})).success(function(res){
        if(res){
           sweetAlert.swal("Bien Hecho.", "has actualizado tu empresa correctamente.", "success");
           delete $scope.form;
        }
      });
  	}

  	$scope.upload = function(){
	      modal.show({templateUrl : 'views/company/form-upload/logo-upload.html', size :'md', scope: $scope}, function($scope){
	          $scope.$close();
	      });
  	}
  	
  });
