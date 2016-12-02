'use strict';

angular.module('shoplyApp')
  .directive('bodegaField', function () {
  	function ctrl($scope, api, modal, $rootScope){
  		api.bodega().get().success(function(res){
  			$scope.records = res.map(function(o){
          var _obj = new Object();
              _obj.name = o.data.bodega;
              _obj._id = o._id;
              return _obj; 
        }) || [];

  		});

  		$scope.myConfig = {
  		  valueField: $scope.key,
  		  labelField: $scope.label,
  		  placeholder: 'Bodega',
        maxItems: 1
  		};

  	}

    return {
      template: '<selectize config="myConfig" options="records" ng-model="ngModel"></selectize>',
      restrict: 'EA',
      scope : {
      	ngModel : "=",
        key : "@",
        label : "@",
        changed : "&"
      },
      controller :ctrl,
      link: function postLink(scope, element, attrs) {

      }
    };
  });