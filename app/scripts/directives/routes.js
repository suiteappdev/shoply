'use strict';

angular.module('shoplyApp')
  .directive('rutasField', function () {
  	function ctrl($scope, api, modal, $rootScope){
  		api.rutas().get().success(function(res){
  			$scope.records = res.map(function(o){
          var obj = o.data
          obj._id = o._id;

          return obj;
        });
  		});

  		$scope.myConfig = {
  		  valueField: $scope.key,
  		  labelField: $scope.label,
  		  placeholder: 'Elijas las rutas',
        selectOnTab : true,
        plugins: ['remove_button']
  		};

  	}

    return {
      template: '<selectize config="myConfig" options="records" ng-model="ngModel"></selectize>',
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