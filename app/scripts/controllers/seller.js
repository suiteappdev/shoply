'use strict';

angular.module('shoplyApp')
  .controller('SellerCtrl', function ($scope, $timeout, $rootScope, sweetAlert, constants, $state, modal, api, storage) {
    $scope.Records = false; 
  	
    $scope.load = function(){
      api.user().get().success(function(res){
          $scope.records = res.filter(function(_o){
              return _o.type == "SELLER";
          });     
          $scope.Records = true;
      });
  	}

  	$scope.create = function(){
       window.modal = modal.show({templateUrl : 'views/vendedores/agregar_vendedor.html', size :'md', scope: $scope, backdrop:'static'}, function($scope){
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
      $scope.formEdit = angular.copy($rootScope.grid.value);
      $scope.formEdit._route = $scope.formEdit._route.map(function(_o){return _o._id});
      delete $scope.formEdit.password;
      
     window.modal =  modal.show({templateUrl : 'views/vendedores/editar_vendedor.html', size :'md', scope: $scope, backdrop:'static'}, function($scope){
            if($scope.formEditVendedor.$invalid){
                 modal.incompleteForm();
                return;
            }

            if($scope.formEdit.password){
                api.verification_code().add($scope.formEdit._id).get().success(function(res){
                  if(res){
                     sweetAlert.swal({
                        title: "Escriba el codigo de verificación",
                        type: "input",
                        showCancelButton: false,
                        closeOnConfirm: false,
                        animation: "slide-from-top",
                        inputPlaceholder: "Codigo de verificación" 
                      }, function(inputValue){
                          $scope.formEdit.verificationCode = inputValue;
                          api.user($scope.formEdit._id).put($scope.formEdit).success(function(res){
                              if(res){
                                  sweetAlert.swal("Registro Modificado", "Registro modificado correctamente.", "success");
                                  $scope.load();
                                  $scope.$close();
                                  delete $scope.formEdit;
                              }
                          }).error(function(data, status){
                            if(status == 400){
                              sweetAlert.swal("Error de validación", "Codigo de verificación incorrecto.", "warning");
                            }
                          });
                      });                      
                  }
                });
            }else{
              api.user($scope.formEdit._id).put($scope.formEdit).success(function(res){
                  if(res){
                      sweetAlert.swal("Registro Modificado", "Registro modificado correctamente.", "success");
                      $scope.load();
                      $scope.$close();
                      delete $scope.formEdit;
                  }
              });
            } 
      });
    }

    $scope.delete = function(){
        var _record = $rootScope.grid.value;

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
