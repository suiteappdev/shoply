'use strict';

/**
 * @ngdoc overview
 * @name shoplyApp
 * @description
 * # shoplyApp
 *
 * Main module of the application.
 */
angular
  .module('shoplyApp', [
    'ngAnimate',
    'ngCookies',
    'ngResource',
    'ngRoute',
    'ngSanitize',
    'ngTouch',
    'ui.router',
    'firebase',
    'selectize',
    'ui.bootstrap',
    'jsTree.directive',
    'angularUtils.directives.dirPagination',
    'internationalPhoneNumber',
    'ngImgCrop'
  ])
  .config(function ($stateProvider, ipnConfig,  $httpProvider, constants, $urlRouterProvider) {
        ipnConfig.defaultCountry = 'co'
        ipnConfig.preferredCountries = ['pl', 'de', 'fr', 'uk', 'es'];

     $httpProvider.interceptors.push(function($injector, $q) {
        var rootScope = $injector.get('$rootScope');

        return {
            'request': function(config) {
                
                $httpProvider.defaults.withCredentials = false;
                if(window.localStorage.token)
                $httpProvider.defaults.headers.common['x-soply-auth'] =  window.localStorage.token ; // common
                $httpProvider.defaults.headers.common['x-soply-user'] =  angular.fromJson(window.localStorage.user) ?  angular.fromJson(window.localStorage.user)._id : null  ; // common

                console.log(config, 'request')

                for (var x in config.data) {
                    if (typeof config.data[x] === 'boolean') {
                        config.data[x] += '';
                    }
                }

                return config || $q.when(config);
            },
            'response': function(response) {
                return response;

            },
            'responseError': function(rejection) {
                 switch(rejection.status){

                    case 401:
                    if(!window.location.hash.match("login")){
                         sweetAlert.swal({
                                title: "La sesión ha expirado",
                                text: "Tiempo de sesión agotado, por favor ingrese nuevamente",
                                imageUrl:"http://icon-icons.com/icons2/67/PNG/512/watch_13224.png"
                            }, function(){

                                if(window.modal)
                                     window.modal.hide();

                                 if(window.sweet)
                                    window.sweet.hide();

                                window.localStorage.clear();
                                window.location = "#/login";
                               
                            });
                    }
                    else
                      return $q.reject(rejection);
                      break;

                    default:
                    return $q.reject(rejection);
                    break;

                 }
                  
                }
        };
    });

      $urlRouterProvider.otherwise("/dashboard");
      $stateProvider
          .state('home', {
              url: '/',
              templateUrl: 'views/home/content.html'
          })
          .state('about', {
              url: '/about',
              templateUrl: 'views/aboutus/aboutus.html'
          })
          .state('faq', {
              url: '/faq',
              templateUrl: 'views/faq/faq.html'
          })
          .state('login', {
              url: '/login',
              templateUrl: 'views/login/login.html',
              controller : 'LoginCtrl'
          })
          .state('signup', {
                url: '/signup',
                templateUrl: 'views/signup/signup.html',
                controller:'RegistrationCtrl'
          })
          .state('forgot', {
                url: '/forgot',
                templateUrl: 'views/forgot/forgot.html'
          })
          .state('reset', {
                url: '/reset',
                access: { requiredAuthentication: true },
                templateUrl: 'views/reset/reset.html'
          })
          .state('dashboard.change-password', {
                url: '/change-password',
                access: { requiredAuthentication: true },
                templateUrl: 'views/reset/change_password.html'
          })
          .state('dashboard', {
                url: '/dashboard',
                access: { requiredAuthentication: true },
                templateUrl: 'views/dashboard/dashboard.html'
          })
          .state('dashboard.productos', {
                url: '/productos',
                access: { requiredAuthentication: true },
                templateUrl: 'views/productos/productos.html'
          })
          .state('dashboard.categorias', {
                url: '/categorias',
                access: { requiredAuthentication: true },
                templateUrl: 'views/categorias/categorias.html'
          })
          .state('dashboard.detalle_categoria', {
                url: '/detalle-categoria/:categoria',
                access: { requiredAuthentication: true },
                templateUrl: 'views/categorias/detalle-categoria.html'
          })
          .state('dashboard.detalle_producto', {
                url: '/detalle-producto/:producto',
                access: { requiredAuthentication: true },
                templateUrl: 'views/productos/detalle_producto.html'
          })
          .state('dashboard.pedidos', {
                url: '/pedidos',
                access: { requiredAuthentication: true },
                templateUrl: 'views/pedidos/pedidos.html'
          })
          .state('dashboard.perfil', {
                url: '/perfil',
                access: { requiredAuthentication: true },
                templateUrl: 'views/profile/profile.html'
          })
          .state('dashboard.transportador', {
                url: '/transportadores',
                access: { requiredAuthentication: true },
                templateUrl: 'views/transportador/transportador.html'
          })
          .state('dashboard.detalle_pedido', {
                url: '/detalle-pedido/:pedido',
                access: { requiredAuthentication: true },
                templateUrl: 'views/pedidos/detalle-pedido.html'
          });
  }).run(["$rootScope", "constants", "storage", "$state", function($rootScope, constants, storage, $state){
        $rootScope.currency = constants.currency;
        $rootScope.base = constants.uploadFilesUrl;
        $rootScope.base_resource = constants.base_resource;
        $rootScope.isLogged = storage.get('user');
        $rootScope.user = storage.get('user');


      window.socket = new io(constants.socket);
        window.socket.on("connect", function(){
         console.log("Socket Status: OK")
      })

      $rootScope.$on('$stateChangeStart', function(event, nextRoute, toParams, fromState, fromParams){
            if (nextRoute != null && nextRoute.access != null && nextRoute.access.requiredAuthentication && !storage.get('token')) {
                    event.preventDefault();
                    $state.transitionTo('login');
            }
      });
  }]);
