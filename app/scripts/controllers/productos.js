'use strict';

/**
 * @ngdoc function
 * @name shoplyApp.controller:ProductosCtrl
 * @description
 * # ProductosCtrl
 * Controller of the shoplyApp
 */
angular.module('shoplyApp')
  .controller('ProductosCtrl',["$scope", "modal", "api", "constants",function ($scope, modal, api, constants) {
    $scope.Records = false; 

    $scope.load = function(){
      api.producto().get().success(function(res){
        $scope.records = res || [];
        $scope.Records = true;
      });
    }

    $scope.edit = function(){
      $scope.formEdit = angular.copy(this.record);
      $scope.formEdit._category = this.record._category ? this.record._category._id : null;
      
      modal.show({templateUrl : 'views/productos/editar_producto.html', size :'md', scope: $scope}, function($scope){
            if($scope.formProducto.$invalid){
                 modal.incompleteForm();
                return;
            }

            api.producto($scope.formEdit._id).put($scope.formEdit).success(function(res){
                if(res){
                    sweetAlert("Registro Modificado", "Registro modificado correctamente.", "success");
                    $scope.load();
                    $scope.$close();
                    delete $scope.form.data;
                }
            });
      });
    }

    $scope.$watch('form.data.precio', function(n, o){
      try{
        var _valor_iva = ((parseInt($scope.form.data.iva || 0 ) / 100) * $scope.form.data.precio  || 0); 
        var _valor_utilidad = ((($scope.form.data.utilidad || 0)  / 100) * $scope.form.data.precio  || 0);

        $scope.form.data.valor_utilidad = _valor_utilidad;
        $scope.form.data.valor_iva = _valor_iva;

        $scope.form.data.precio_venta = (_valor_iva + _valor_utilidad + $scope.form.data.precio);        
      }catch(e){}

    });

    $scope.$watch('form.data.iva', function(n, o){
      try{
        $scope.form.data.valor_iva = ($scope.form.data.precio * (parseInt(n) / 100));
        $scope.form.data.precio_venta = (
                                        $scope.form.data.valor_iva + ($scope.form.data.precio) 
                                        + ($scope.form.data.valor_utilidad )
                                      )        
      }catch(e){}

    });

    $scope.$watch('form.data.utilidad', function(n, o){
      try{
        $scope.form.data.valor_utilidad = ($scope.form.data.precio * ($scope.form.data.utilidad / 100)); 
        $scope.form.data.precio_venta = (
                                $scope.form.data.valor_iva + 
                                $scope.form.data.valor_utilidad  + 
                                $scope.form.data.precio
                                );        
      }catch(e){}

    });

    $scope.$watch('formEdit.data.precio', function(n, o){
      try{
        var _valor_iva = ((parseInt($scope.formEdit.data.iva || 0 ) / 100) * $scope.formEdit.data.precio  || 0); 
        var _valor_utilidad = ((($scope.formEdit.data.utilidad || 0)  / 100) * $scope.formEdit.data.precio  || 0);

        $scope.formEdit.data.valor_utilidad = _valor_utilidad;
        $scope.formEdit.data.valor_iva = _valor_iva;

        $scope.formEdit.data.precio_venta = (_valor_iva + _valor_utilidad + $scope.formEdit.data.precio);        
      }catch(e){}

    });

    $scope.$watch('formEdit.data.iva', function(n, o){
      try{
        $scope.formEdit.data.valor_iva = ($scope.formEditformEdit.data.precio * (parseInt(n) / 100));
        $scope.formEdit.data.precio_venta = (
                                        $scope.formEditformEdit.data.valor_iva + ($scope.formEditformEdit.data.precio) 
                                        + ($scope.formEditformEdit.data.valor_utilidad )
                                      )        
      }catch(e){}

    });

    $scope.$watch('formEdit.data.utilidad', function(n, o){
      try{
        $scope.formEdit.data.valor_utilidad = ($scope.formEdit.data.precio * ($scope.formEdit.data.utilidad / 100)); 
        $scope.formEdit.data.precio_venta = (
                                $scope.formEdit.data.valor_iva + 
                                $scope.formEdit.data.valor_utilidad  + 
                                $scope.formEdit.data.precio
                                );        
      }catch(e){}

    });  

    $scope.agregar = function(){
       modal.show({templateUrl : 'views/productos/agregar-producto.html', size :'md', scope: $scope}, function($scope){
            if($scope.formProducto.$invalid){
                 modal.incompleteForm();
                return;
            }

            api.producto().post($scope.form).success(function(res){
                if(res){
                    $scope.load();
                    $scope.$close();
                    delete $scope.form.data;
                }
            });
        });
    }

    $scope.borrar = function(){
        var _record = this.record;

        modal.removeConfirm({closeOnConfirm : true}, 
            function(isConfirm){ 
               if (isConfirm) {
                    api.producto(_record._id).delete().success(function(res){
                        if(res){
                            $scope.records.splice($scope.records.indexOf(_record), 1);
                        }
                    });
               }
           })
    }
  } ] );
