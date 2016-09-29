'use strict';

/**
 * @ngdoc function
 * @name shoplyApp.controller:LoginCtrl
 * @description
 * # CompanyCtrl
 * Controller of the shoplyApp
 */
angular.module('shoplyApp')
  .controller('ArqueoCtrl', function ($scope, $http, $filter,  $rootScope, $stateParams, sweetAlert, constants, $state, modal, api, storage) {
    
    $scope.Records = false; 

    $scope.form = new Object();
    $scope.form.metadata = {};
    $scope.form.metadata.total_sistema = 0;

    $scope.load = function(){
        if($stateParams.arqueo){
          api.arqueos($stateParams.arqueo).get().success(function(res){
            $scope.form._request = res._request || [];
            $scope.form.metadata = res.metadata;
            $scope.Records = true;
          });   
        }else{
          api.arqueos().get().success(function(res){
            $scope.records = res || [];
            //$scope.Records = true;
          });          
        }
  	}

    $scope.create = function(){
      $state.go('dashboard.crear-arqueo');
    }

    $scope.download = function(){
      $scope._schema = $scope.form._billings.map(function(o){
          var _output = new Object();

           _output.vendedor = o._seller.full_name; 
           _output.fecha = new Date(o.createdAt).toISOString().substr(0,10); 
           _output.Cliente = o._client.full_name; 
           _output.total = o.metadata.total.toString();
           _output.Estado = o.metadata.estado.toString();

          return _output; 
      });

    var data1 = $scope._schema;
    var data2 = [$scope.form.metadata];
    var opts = [{sheetid:'Pedidos',header:true},{sheetid:'Facturacion',header:false}];
    var res = alasql('SELECT INTO XLSX("Arqueo.xlsx",?) FROM ?',[opts,[data1,data2]]);
  
    }

    $scope.guardar = function(){
        sweetAlert.swal({
            title: "Confirmar Movimiento!",
            text: "escribe algo referente al movimiento:",
            type: "input",
            showCancelButton: false,
            closeOnConfirm: false,
            animation: "slide-from-top",
            inputPlaceholder: "Nombre del Movimiento" 
          }, function(inputValue){
              if (inputValue === false) return false; 
              
              if (inputValue === "") {
                    swal.showInputError("You need to write something!");
                    return false   
              } 

              var _data = angular.copy($scope.form._billings);
              _data.metadata = {};
              _data.metadata.arqueo = inputValue;

              _data._billings = $scope.form._billings.map(function(o){
                return o._id;
              });

              api.arqueos().post(_data).success(function(res){
                if(res){
                   sweetAlert.swal("Registro Creado", "Registro creado correctamente.", "success");
                   $scope.form._billings = [];
                   $scope.form.metadata = {};
                   $scope.form.metadata.total_sistema = 0;
                   $scope.form.metadata.sobrante = 0;
                   $scope.form.metadata.faltante = 0;
                }
              });
            
            });
    }

    $scope.find = function(){
      $scope.Records = true;
       api.facturacion().add("find/").post($scope.formData).success(function(res){
            if(res){
              $scope.form._billings = res || [];
              $scope.totalize();
              $scope.Records = false;
            }
          });
    }

    $scope.print = function(data){
        Handlebars.registerHelper('formatCurrency', function(value) {
            return value.toString().replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1,");
        });

        Handlebars.registerHelper("DateShort", function(timestamp) {
            return  $filter('date')(timestamp, 'yyyy-MM-dd');
        });

        $http.get('views/prints/arqueo.html').success(function(res){
          var _template = Handlebars.compile(res);
          var w = window.open("", "_blank", "scrollbars=yes,resizable=no,top=200,left=200,width=350");
          
          w.document.write(_template($scope.records));
          w.print();
          w.close();
        });
    }

    $scope.totalize = function(){
      angular.forEach($scope.form._billings, function(o){
        $scope.form.metadata.total_sistema += o.data.total || 0;
      });
    }

    $scope.$watch("form.metadata.total_efectivo", function(n, o){
        if(($scope.form.metadata.total_sistema - $scope.form.metadata.total_efectivo || 0)  < 0){
            $scope.form.metadata.sobrante = ($scope.form.metadata.total_sistema - $scope.form.metadata.total_efectivo) * (-1);
            $scope.form.metadata.faltante = 0;
        }else{
           $scope.form.metadata.faltante = ($scope.form.metadata.total_sistema - $scope.form.metadata.total_efectivo || 0);
           $scope.form.metadata.sobrante = 0;
        }
    });

    $scope.borrar = function(){
        var _record = this.record;
        modal.removeConfirm({closeOnConfirm : true}, 
            function(isConfirm){ 
               if (isConfirm) {
                    api.arqueos(_record._id).delete().success(function(res){
                        if(res){
                            $scope.records.splice($scope.records.indexOf(_record), 1);
                        }
                    });
               }
           })
    }

  });
