'use strict';

/**
 * @ngdoc function
 * @name shoplyApp.controller:ProductosCtrl
 * @description
 * # ProductosCtrl
 * Controller of the shoplyApp
 */
angular.module('shoplyApp')
  .controller('FacturacionCtrl',["$scope", "hotkeys", "shoppingCart", "modal", "api", "constants","sweetAlert", "$rootScope", "$http", "$filter", "$stateParams", "storage","$timeout", function ($scope, hotkeys, shoppingCart,  modal, api, constants, sweetAlert, $rootScope, $http, $filter, $stateParams, $storage, $timeout) {
    
    $scope.records = [];

    $scope.$watch('records', function(n, o){
        if(n.length > 0){
           $scope.total = (shoppingCart.totalize(n) - shoppingCart.totalizeDiscount(n) || 0);
           $scope.TotalIva = shoppingCart.totalizeIva(n);
           $scope.subTotal = ($scope.total - $scope.TotalIva);
           $scope.descuento =  shoppingCart.totalizeDiscount(n);
          // $scope.descuento = shoppingCart.totalizeDiscount(n);
        }
    }, true);

    $scope.load = function(){
      $scope.records =[];
      if($stateParams.facturacion){
        api.facturacion($stateParams.facturacion).get().success(function(res){
          $scope.rs = res;
          $scope.records = $scope.rs._product;
          $scope.form._client = res._client;
        });
      }else{
        $scope.setDefault = $storage.get('defaultClient') || null;
        $rootScope.$emit("focusOn", true);                          
      }
    }

    $scope.setDefaultClient = function(){
        if(this.defaultOption){
          $storage.save('defaultClient', $scope.form._client);
        }else{
          $storage.delete('defaultClient');
        }
    }

    $scope.printA = function(data, iva_detail){
      Handlebars.registerHelper('formatCurrency', function(value) {
          return value.toString().replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1,");
      });

      $http.get('views/invoice/invoice_88mm.html').success(function(res){
        var _template = Handlebars.compile(res);
        var w = window.open("", "_blank", "scrollbars=yes,resizable=no,top=200,left=200,width=350");
        
        w.document.write(_template(data));
        w.print();
        w.close();
      });
    }

    $scope.setReceived = function(){
      var total = 0;

      angular.forEach($scope.paymentMethods, function(o){
        if(o.data.value){
            total = (total + o.data.value)
          }
      });

      $scope.received = total;

      var _sum = ($scope.totalParcial - $scope.received);

      if(_sum < 0){
          $scope.change = _sum * (-1) ;
      }else{
        $scope.change = 0;
      }
    }

    $scope.getPaymentMethods = function(){
      if($stateParams.facturacion){
        $scope.paymentMethods = $scope.rs._payments;
        $scope.loading = false;
      }else{
        $scope.loading = true;
        api.formas_pagos().get().success(function(res){
          $scope.$parent.paymentMethods = res ||[];
          $scope.loading = false;
        });        
      }
    }

    $scope.openBaseForm = function(event, value){
      $scope.totalCard = value;
      $scope.method = this.method;

      if(this.method.data.card){
        if(event.which === 13) {
           window.modal = modal.show({templateUrl : 'views/facturacion/baseForm.html', size :'md', scope: $scope, backdrop:'static',  windowClass: 'center-modal'}, function($scope){
              $scope.method.data.base =  ( $scope.totalCard / 1.16);
              $scope.method.data.Iva = ($scope.totalCard) - ( $scope.totalCard / 1.16);
              $scope.$parent.$parent.form._payments = $scope.paymentMethods;
              $scope.$close();
           }, function(){

           }); 
        }
      }
    }

    $scope.$watch('gdiscount', function(n, o){
      if(n || o){
        $scope.vgdescuento =  ($scope.total * $scope.gdiscount / 100);
        $scope.totalParcial = (angular.copy($scope.total) - ($scope.vgdescuento))        
      }
    });

    $scope.facturar = function(){
      if($scope.records == 0){
        return;
      }

       window.modal = modal.show({templateUrl : 'views/facturacion/agregar_facturacion.html', size :'md', scope: $scope, backdrop:'static', windowClass: 'center-modal'}, function($scope){
          $scope.form.data =  new Object();
          $scope.form._seller = $rootScope.user._id;
          $scope.form.data.TotalIva = $scope.TotalIva;
          $scope.form.data.total = $scope.totalParcial;
          $scope.form.data.subtotal =  $scope.subTotal;
          $scope.form.data.descuentoGlobal = $scope.gdiscount || 0;
          $scope.form.data.valorDescuentoGlobal = $scope.vgdescuento;
          $scope.form._payments = $scope.paymentMethods;

          $scope.form._product = $scope.records.map(function(o){
              delete o.$order;
              return o;
          });

          api.ivas().get().success(function(res){
              var _filteredByIvas = [];
              $scope.form.data.ivadetails = [];
              
              angular.forEach(res, function(o){
                _filteredByIvas.push($scope.form._product.filter(function(i){
                      if(!i.iva){
                        i.iva = new Object();
                        i.iva.data = new Object();                        
                        i.iva.data.valor = 0;                        
                      }

                      return i.iva.data.valor == o.data.valor;
                  }));
              });

              angular.forEach(_filteredByIvas, function(o){
                var _SUM = new Object();
                _SUM.total = 0;
                _SUM.viva = 0;

                angular.forEach(o, function(_o){
                    _SUM.tipo = _o.iva.data.valor;
                    _SUM.total = (_SUM.total + _o.precio_venta);
                    _SUM.viva = (_SUM.viva + _o.valor_iva || 0);                     
                });

                _SUM.base = (_SUM.total - _SUM.viva);
                $scope.form.data.ivadetails.push(_SUM);
              })

              if($scope.rs){
                  $scope.form._payments = $scope.rs._payments;
                  api.facturacion($scope.rs._id).put($scope.form).success(function(res){
                    if(res){
                        api.facturacion($scope.rs._id).get().success(function(response){
                          if(response){
                            delete $scope.form;
                            delete $scope.rs;
                            $scope.records.length = 0;
                            response.createdAt = moment(new Date(response.createdAt)).format('lll');
                            $scope.printA(response);
                            
                            $scope.$close();
                            sweetAlert.swal("Listo.", "Actualización realizada correctamente.", "success");
                            $rootScope.$emit("focusOn", true);                          
                          }
                        });
                    }
                  });
              }else{
                api.facturacion().post($scope.form).success(function(res){
                  if(res){
                      delete $scope.form;
                      $scope.records.length = 0;
                      res.createdAt = moment(new Date(res.createdAt)).format('lll');
                      $scope.printA(res);
                      $scope.$close();
                      sweetAlert.swal("Listo.", "Venta realizada correctamente.", "success");
                      $rootScope.$emit("focusOn", true);
                  }
                });                
              }
          });
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

    $scope.agregarDescuento = function(){
     $scope.descuentoRecord = this.record;

     window.modal = modal.show({templateUrl : 'views/facturacion/descuento.html', size :'sm', scope: $scope, backdrop:'static', windowClass: 'center-modal'}, function($scope){
        if($scope.pdiscount){
          $scope.descuentoRecord.descuento = parseInt($scope.pdiscount) || 0;
          $scope.descuentoRecord.valor_descuento = ($scope.descuentoRecord.precio_venta * $scope.descuentoRecord.cantidad) * (parseInt($scope.descuentoRecord.descuento || 0) / 100);
          $scope.descuentoRecord.total  = ($scope.descuentoRecord.total - $scope.descuentoRecord.valor_descuento); 
          $scope.$close();
        }
     });
    }

    $scope.$watch('_product', function(n, o){
      if(n){
         var _found = false;
          angular.forEach($scope.records, function(_o){
            if(_o._id == n){
              _found = true;

              if(_o.valor_descuento){
                _o.valor_descuento = _o.valor_descuento + _o.valor_descuento;
              }

              _o.cantidad = _o.cantidad + 1;
              _o.total = (_o.precio_venta * _o.cantidad);
            }
          }); 
          
          if(!_found){
            $scope.records.push(angular.copy(angular.extend($scope._productObj, { cantidad : 1, total : $scope._productObj.precio_venta})));
          }

          delete $scope._product;
      }
    });

    $scope.delete = function(){
        var _record = this.record;
        $scope.records.splice($scope.records.indexOf(_record), 1);
    }
  } ] );
