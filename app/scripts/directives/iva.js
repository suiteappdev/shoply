'use strict';

/**
 * @ngdoc directive
 * @name shoplyApp.directive:iva
 * @description
 * # iva
 */
angular.module('shoplyApp')
  .directive('iva', function () {
  	function ctrl($scope , constants) {
  		$scope.records = constants.iva; 
		
		$scope.myConfig = {
		  valueField: 'valor',
		  labelField: 'text',
		  placeholder: 'Iva',
		  maxItems: 1
		};
  	}

    return {
      template: '<selectize config="myConfig" options="records" ng-model="ngModel"></selectize>',
      restrict: 'E',
      scope : {
      	ngModel : "="
      },
      controller : ctrl,
      link: function postLink(scope, element, attrs) {

      }
    };
  });
