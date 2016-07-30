'use strict';

/**
 * @ngdoc function
 * @name shoplyApp.controller:LoginCtrl
 * @description
 * # CompanyCtrl
 * Controller of the shoplyApp
 */
angular.module('shoplyApp')
  .controller('ArqueoCtrl', function ($scope,$rootScope,  sweetAlert, constants, $state, modal, api, storage) {
    
    $scope.Records = false; 

    $scope.form = new Object();
    $scope.form.metadata = {};
    $scope.form.metadata.total_sistema = 0;

    $scope.load = function(){
        api.arqueos().get().success(function(res){
          $scope.records = res || [];
          $scope.Records = true;
        });
  	}

    $scope.download = function(){
      $scope._schema = $scope.form._request.map(function(o){
          var _output = new Object();

           // _ouput.seller = o._seller.name + " " + o.last_name || "no definido"; 
            _output.date = o.createdAt.toString(); 
           // _ouput.client = o._client.name + " " + o.last_name || "no definido"; 
            _output.total = o.metadata.total.toString();
            _output.status = o.metadata.estado.toString();

          return _output; 
      });

      alasql('SELECT * INTO XLSX("reporte.xlsx",{headers:true}) FROM ?',[$scope._schema]);
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

              var _data = angular.copy($scope.form);
              _data.metadata.arqueo = inputValue;
              _data._request = $scope.form._request.map(function(o){
                return o._id;
              });

              api.arqueos().post(_data).success(function(res){
                if(res){
                   sweetAlert.swal("Registro Creado", "Registro creado correctamente.", "success");
                   $scope.form._request = [];
                   $scope.form.metadata = {};
                   $scope.form.metadata.total_sistema = 0;
                   $scope.form.metadata.sobrante = 0;
                   $scope.form.metadata.faltante = 0;
                }
              });
            
            });
    }

    $scope.get = function(){
      $scope.loading = true;
       api.pedido()
          .add($scope.vendedor).
           add("/" + $scope.ini)
          .add("/" +$scope.end).get().success(function(res){
            if(res){
              $scope.form._request = res || [];
              $scope.totalize();
              $scope.loading = false;
            }
          });
    }

    $scope.totalize = function(){
      angular.forEach($scope.form._request, function(o){
        $scope.form.metadata.total_sistema += o.metadata.total;
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

  	$scope.create = function(){

  	}

    $scope.update = function(){

    }


    $scope.delete = function(){

    }

  });
