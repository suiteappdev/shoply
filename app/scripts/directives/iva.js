'use strict';

/**
 * @ngdoc directive
 * @name shoplyApp.directive:iva
 * @description
 * # iva
 */
angular.module('shoplyApp')
  .directive('iva', function () {
  	function ctrl($scope , constants, api) {
      api.ivas().get().success(function(res){
        $scope.records = res.map(function(o){
            var _data = o.data;
                _data._id = o._id;

                return _data
        });
      });

      $scope.$watch('ngModel', function(n, o){
        if(n){
          angular.forEach($scope.records, function(e){
            console.log(e);
            if(e._id === n){
                $scope.setObject = e;
            }
          });          
        }
      });

		  $scope.myConfig = {
  		  valueField: '_id',
  		  labelField: 'descripcion',
  		  placeholder: 'Iva',
  		  maxItems: 1
		  };
  	}

    return {
      template: '<selectize config="myConfig" options="records" ng-model="ngModel"></selectize>',
      restrict: 'E',
      scope : {
      	ngModel : "=",
        setObject:"="
      },
      controller : ctrl,
      link: function postLink(scope, element, attrs) {

      }
    };
  });
