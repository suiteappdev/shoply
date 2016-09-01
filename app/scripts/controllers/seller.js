'use strict';

angular.module('shoplyApp')
  .controller('SellerCtrl', function ($scope,$timeout, sweetAlert, constants, $state, modal, api, storage) {
    $scope.Records = false; 
  	
    $scope.load = function(){
      api.user().get().success(function(res){
          $scope.records = res.filter(function(_o){
              return _o.type == "SELLER";
          });     
          $scope.Records = true;
      });
  	}

  	$scope.agregar = function(){
       modal.show({templateUrl : 'views/vendedores/agregar_vendedor.html', size :'md', scope: $scope, backdrop:'static'}, function($scope){
            if($scope.formVendedor.$invalid){
                 modal.incompleteForm();
                return;
            }
            
            //angular.extend($scope.form.data , {type : "SELLER"});
            $scope.form.type = "SELLER";
            api.user().post($scope.form).success(function(res){
              if(res){
                sweetAlert.swal("Registro completado.", "has registrado un nuevo vendedor.", "success");
                $scope.$close();
                $scope.load();
                delete $scope.form;
              }
            }).error(function(data, status){
                if(status == 409){
                    sweetAlert.swal("No se pudo registrar.", "Este email ya esta registrado.", "error");
                }
            });
        });
  	}

    $scope.edit = function(){
      $scope.formEdit = angular.copy(this.record);
      $scope.formEdit._route = $scope.formEdit._route.map(function(_o){return _o._id});
      delete $scope.formEdit.password;
      
      modal.show({templateUrl : 'views/vendedores/editar_vendedor.html', size :'md', scope: $scope, backdrop:'static'}, function($scope){
            if($scope.formEditVendedor.$invalid){
                 modal.incompleteForm();
                return;
            }

            api.user($scope.formEdit._id).put($scope.formEdit).success(function(res){
                if(res){
                    sweetAlert.swal("Registro Modificado", "Registro modificado correctamente.", "success");
                    $scope.load();
                    $scope.$close();
                    delete $scope.formEdit;
                }
            });
      });
    }

    $scope.borrar = function(){
        var _record = this.record;

        modal.removeConfirm({closeOnConfirm : true}, 
            function(isConfirm){ 
               if (isConfirm) {
                    api.user(_record._id).delete().success(function(res){
                        $scope.records.splice($scope.records.indexOf(_record), 1);
                    });
               }
           })
    }
  });
