'use strict';

/**
 * @ngdoc function
 * @name shoplyApp.controller:RequestdetailCtrl
 * @description
 * # RequestdetailCtrl
 * Controller of the shoplyApp
 */
angular.module('shoplyApp')
  .controller('RequestdetailCtrl', function ($scope, api, $stateParams, $state) {
  	$scope.load = function(){
      $scope.Records = false; 
  		api.pedido($stateParams.pedido).get().success(function(res){
  			$scope.record = res;
        $scope.Records = true;
         
          api.ivas().get().success(function(res){
              var _filteredByIvas = [];
              $scope.ivadetails = [];
              
              angular.forEach(res, function(o){
                _filteredByIvas.push($scope.record.shoppingCart.filter(function(i){
                      if(!i._iva){
                        i.iva = new Object();
                        i.iva.data = new Object();                        
                        i.iva.data.valor = 0;                        
                      }

                      return i._iva.data.valor == o.data.valor;
                  }));
              });

              angular.forEach(_filteredByIvas, function(o){
                var _SUM = new Object();

                _SUM.total = 0;
                _SUM.viva = 0;

                angular.forEach(o, function(_o){
                  console.log("_o", _o);

                    _SUM.tipo = _o._iva.data.valor;
                    _SUM.total = (_SUM.total + _o.data.precio_venta);
                    _SUM.viva = (_SUM.viva + _o.data.valor_iva || 0);                     
                });

                _SUM.base = (_SUM.total - _SUM.viva);
                $scope.ivadetails.push(_SUM);
              })
          })
  		});
  	}

    $scope.facturar = function(){
      $state.go('dashboard.facturacion-pedido', {pedido : $stateParams.pedido});
    }

  });
