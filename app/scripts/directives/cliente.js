'use strict';

angular.module('shoplyApp')
  .directive('clienteField', function () {
  	function ctrl($scope, api, modal, $rootScope){
  		api.user().get().success(function(res){
  			$scope.records = res.filter(function(_o){
          if(_o.data && _o.data.nit == "10001"){
            _o.full_name = "Ventas Diarias";
          }
          
          return _o.type == "CLIENT";
        });
  		});

  		$scope.myConfig = {
  		  valueField: $scope.key,
  		  labelField: $scope.label,
  		  placeholder: 'Cliente',
        openOnFocus : false,
        maxItems: 1
  		};

  	}

    return {
      template: '<selectize focus-on="true" config="myConfig" options="records" ng-model="ngModel"></selectize>',
      restrict: 'EA',
      scope : {
      	ngModel : "=",
        key : "@",
        label : "@",
      },
      controller :ctrl,
      link: function postLink(scope, element, attrs) {

      }
    };
  });