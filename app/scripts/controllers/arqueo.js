'use strict';

/**
 * @ngdoc function
 * @name shoplyApp.controller:LoginCtrl
 * @description
 * # CompanyCtrl
 * Controller of the shoplyApp
 */
angular.module('shoplyApp')
  .controller('ArqueoCtrl', function ($scope, $rootScope,  sweetAlert, constants, $state, modal, api, storage) {
    
    $scope.Records = false; 
    $scope.load = function(){
        api.arqueos().get().success(function(res){
          $scope.records = res || [];
          $scope.Records = true;
        });
  	}

    $scope.get = function(){
      $scope.loading = true;

       api.pedido()
          .add($scope.vendedor).
           add("/" + $scope.ini)
          .add("/" +$scope.end).get().success(function(res){
            if(res){
              $scope.arqueos = res || [1];
              $scope.loading = false;
            }
          });
    }

  	$scope.create = function(){

  	}

    $scope.update = function(){

    }


    $scope.delete = function(){

    }

  });
