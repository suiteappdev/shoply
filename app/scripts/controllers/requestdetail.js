'use strict';

/**
 * @ngdoc function
 * @name shoplyApp.controller:RequestdetailCtrl
 * @description
 * # RequestdetailCtrl
 * Controller of the shoplyApp
 */
angular.module('shoplyApp')
  .controller('RequestdetailCtrl', function ($scope, api, $stateParams) {
  	$scope.load = function(){
  		
  		api.pedido($stateParams.pedido).get().success(function(res){
  			$scope.record = res;
  		});
  	}

  	$scope.process = function (){
      $scope.record._seller = $scope.record._seller._id;
      $scope.record._client = $scope.record._client ? $scope.record._client._id : undefined;
  		$scope.record.metadata.estado = "Despachado";

  		api.pedido($stateParams.pedido).put($scope.record).success(function(res){
            sweetAlert("Excelente!!", "Este pedido va en camino..", "success");
  		});
  	}
  });
