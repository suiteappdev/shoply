'use strict';
angular.module('shoplyApp')
  .controller('ProfileCtrl', function ($scope, api, modal, constants, $state, storage, account, $rootScope) {

    $scope.crop = function(){
      window.modal = modal.show({templateUrl : 'views/utils/cropper.html', size :'md', scope: $scope}, function($scope){
          $scope.update();
          $scope.$close();
      });
    }

    $scope.removePicture = function(){
      delete $rootScope.user.metadata.picture;
      $scope.update();
    }

    $scope.update = function(){
        api.user($rootScope.user._id).put($rootScope.user).success(function(res){
            if(res){
                storage.update("user", $rootScope.user);
                sweetAlert("Registro Modificado", "Tu perfil ha sido actualizado", "success");
            }
        });
    }
  });