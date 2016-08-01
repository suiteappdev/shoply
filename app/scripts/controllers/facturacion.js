'use strict';

/**
 * @ngdoc function
 * @name shoplyApp.controller:ProductosCtrl
 * @description
 * # ProductosCtrl
 * Controller of the shoplyApp
 */
angular.module('shoplyApp')
  .controller('FacturacionCtrl',["$scope","shoppingCart", "modal", "api", "constants","sweetAlert", function ($scope, shoppingCart,  modal, api, constants, sweetAlert) {
    
    $scope.records = [];

    $scope.$watch('records', function(n, o){
        if(n.length > 0){
           $scope.total = shoppingCart.totalize(n);
           $scope.TotalIva = shoppingCart.totalizeIva(n);
           $scope.subTotal = ($scope.total - $scope.TotalIva);
        }
    }, true);

    $scope.load = function(){

    }

    $scope.facturar = function(){
       modal.show({templateUrl : 'views/facturacion/agregar_facturacion.html', size :'md', scope: $scope, backdrop:'static'}, function($scope){
          $scope.$close();
       });  
    }

    $scope.agregarCantidad = function(){
     var _record = this.record;

     sweetAlert.swal({
        title: "Agregar Cantidad",
        type: "input",
        inputValue : 1,
        showCancelButton: false,
        closeOnConfirm: false,
        animation: "slide-from-top",
        inputPlaceholder: "Cantidad" 
      }, function(inputValue){
          $scope.records[$scope.records.indexOf(_record)].cantidad = parseInt(inputValue || 1);
          window.swal.close();   
      });   
    }

    $scope.$watch('_product', function(n, o){
      if(n){
         var _found = false;
          angular.forEach($scope.records, function(_o){
            if(_o._id == n){
              _found = true;
            }
          }); 
          
          if(!_found){
            $scope.records.push(angular.extend($scope._productObj, { cantidad : 1}));
          }
      }
    });

    $scope.quitar = function(){
        var _record = this.record;
        $scope.records.splice($scope.records.indexOf(_record), 1);
    }
  } ] );
