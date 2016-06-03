'use strict';

/**
 * @ngdoc directive
 * @name shoplyApp.directive:categoria
 * @description
 * # categoria
 */
angular.module('shoplyApp')
  .directive('categoria', function () {
  	function ctrl($scope, api, modal, $rootScope){
  		api.categoria().get().success(function(res){
  			$scope.records = res;
  		});

		$scope.myConfig = {
		  valueField: $scope.key,
		  labelField: $scope.label,
		  placeholder: 'Categoria',
		  maxItems: 1
		};

		$scope.$on('setCategoria', function(event, data){
			$scope.ngModel = data;
		});

		$scope.explorer = function(){
	       modal.show({templateUrl : 'views/fields/categoria-popup.html', size :'md', scope: $scope}, function($scope){
	       		$scope.$emit('setCategoria', $scope.selectedNode.node.id);
	       		$scope.$close();
	        });
		}
  	}

    return {
      template: '<div class="input-group"><selectize config="myConfig" options="records" ng-model="ngModel"></selectize><span class="input-group-btn"><button ng-click="explorer()" class="btn custom-btn-primary" style="top: -3px;" type="button">Seleccionar</button></span></div>',
      restrict: 'EA',
      scope : {
      	ngModel : "=",
        key : "@",
        label : "@"
      },
      controller :ctrl,
      link: function postLink(scope, element, attrs) {

      }
    };
  });
