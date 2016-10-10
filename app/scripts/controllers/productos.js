'use strict';

/**
 * @ngdoc function
 * @name shoplyApp.controller:ProductosCtrl
 * @description
 * # ProductosCtrl
 * Controller of the shoplyApp
 */
angular.module('shoplyApp')
  .controller('ProductosCtrl',["$scope", "$rootScope", "modal", "api", "constants", "$state", function ($scope, $rootScope, modal, api, constants, $state) {
    $scope.Records = false; 

    $scope.load = function(){
      api.producto().get().success(function(res){
        $scope.records = res || [];
        $scope.Records = true;
      });
    }

    $scope.detail = function(){
      $state.go('dashboard.detalle_producto', { producto : $rootScope.grid.value._id})      
    }

    $scope.edit = function(){
      $scope.formEdit = angular.copy($rootScope.grid.value);
      $scope.formEdit._category = $rootScope.grid.value._category ? $rootScope.grid.value._category._id : null;
      $scope.ivaValue = $rootScope.grid.value._iva ? $rootScope.grid.value._iva.data.valor : 0;

      $scope.formEdit._iva = $rootScope.grid.value._iva ? $rootScope.grid.value._iva._id : null;
      
      if($scope.formEdit.data.tags){
        $scope.tags = $scope.formEdit.data.tags.map(function(o){
            var _obj = new Object();
            _obj.text = o;
            _obj.value = o;

            return _obj;
        });        
      }

      if($scope.formEdit._reference.reference){
          $scope.reference = $scope.formEdit._reference.reference.map(function(o){
              var _obj = new Object();
              _obj.text = o;
              _obj.value = o;

              return _obj;
          });
      } 

      window.modal = modal.show({templateUrl : 'views/productos/editar_producto.html', size :'md', scope: $scope, backdrop:'static'}, function($scope){
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
        var _valor_iva = ((parseInt($scope.iva ? $scope.iva.valor : 0) / 100) * $scope.form.data.precio  || 0); 
        var _valor_utilidad = ((($scope.form.data.utilidad || 0)  / 100) * $scope.form.data.precio  || 0);

        $scope.form.data.valor_utilidad = _valor_utilidad;
        $scope.form.data.valor_iva = _valor_iva;

        $scope.form.data.precio_venta = (_valor_iva + _valor_utilidad + $scope.form.data.precio);        
      }catch(e){}

    });


    $scope.$watch('iva.valor', function(n, o){
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

    $scope.editLoad = function(){
      
       $scope.$watch('formEdit.data.precio', function(n, o){
        try{
          var _valor_iva = ((parseInt($scope.EditIva ? $scope.EditIva.valor  : 0  || $scope.ivaValue) / 100) * $scope.formEdit.data.precio  || 0); 
          
          var _valor_utilidad = ((($scope.formEdit.data.utilidad || 0)  / 100) * $scope.formEdit.data.precio  || 0);

          $scope.formEdit.data.valor_utilidad = _valor_utilidad;
          $scope.formEdit.data.valor_iva = _valor_iva;

          $scope.formEdit.data.precio_venta = (_valor_iva + _valor_utilidad + $scope.formEdit.data.precio);    

        }catch(e){
              console.log("error", e);
        }

      });

      $scope.$watch('EditIva.valor', function(n, o){
          try{

            if(!n && !o){
              $scope.formEdit.data.valor_iva = (($scope.formEdit.data.precio * (parseInt($scope.ivaValue) / 100)));
            }else{
             $scope.formEdit.data.valor_iva = ($scope.formEdit.data.precio * (parseInt(n || 0) / 100));
            }

            //$scope.formEdit.data.valor_iva = ($scope.formEdit.data.precio * (parseInt(n) / 100));
            $scope.formEdit.data.precio_venta = (
                                            $scope.formEdit.data.valor_iva + ($scope.formEdit.data.precio) 
                                            + ($scope.formEdit.data.valor_utilidad )
                                          )        
          }catch(e){
              console.log("error", e);
          }        
      });

      $scope.$watch('formEdit.data.utilidad', function(n, o){
        try{
          $scope.formEdit.data.valor_utilidad = ($scope.formEdit.data.precio * ($scope.formEdit.data.utilidad / 100)); 
          $scope.formEdit.data.precio_venta = (
                                  $scope.formEdit.data.valor_iva + 
                                  $scope.formEdit.data.valor_utilidad  + 
                                  $scope.formEdit.data.precio
                                  );        
        }catch(e){
          console.log("error", e);
        }

      });          
    }



    $scope.create = function(){
       window.modal = modal.show({templateUrl : 'views/productos/agregar-producto.html', size :'md', scope: $scope, backdrop:'static'}, function($scope){
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
            }).error(function(data, status){
              if(status == 409){
                sweetAlert("Referencia duplicada", "La referencia: "+ data.reference+" ya existe", "warning");
              }
            });
        });
    }

    $scope.delete = function(){
        var _record = $rootScope.grid.value;

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
