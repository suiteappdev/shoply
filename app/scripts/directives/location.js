'use strict';

/**
 * @ngdoc directive
 * @name shoplyApp.directive:iva
 * @description
 * # iva
 */
angular.module('shoplyApp')
  .directive('departamentoField', function () {
  	function ctrl($scope , $window, $rootScope) {
  		$scope.records = $window.departamentos; 
		
  		$scope.myConfig = {
  		  valueField: 'name',
  		  labelField: 'name',
  		  placeholder: 'Departamento',
        searchField: ['name'],
        selectOnTab : true,
  		  maxItems: 1, 
        onChange : function(value){
          angular.forEach($scope.records, function(v){
              if(v.name == value){
                  $rootScope.$emit("departamentoField::changed", v.code);
                  $scope.$apply();
                  return;
              }
          });
        }
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

  angular.module('shoplyApp')
  .directive('ciudadField', function ($window) {
    function ctrl($scope , $rootScope, $filter) {
      $scope.records = $window.municipios;

      $rootScope.$on("departamentoField::changed", function(event, value){
        $scope.records = angular.copy($window.municipios).filter(function(v){
          return (v.code_dpto == value);
        });

        $scope.$apply();
      }); 
      
      $scope.myConfig = {
        valueField: 'name',
        labelField: 'name',
        searchField: ['name'],
        placeholder: 'Ciudad',
        selectOnTab : true,
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

