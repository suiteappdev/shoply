'use strict';
angular.module('shoplyApp')
  .service('shoppingCart', function ($rootScope) {
  	return {
      totalize : function(products){
        var _total = 0;

        angular.forEach(products, function(_curr){
          _total = _total + (_curr.cantidad * _curr.precio_venta);
        });

        return _total;
      },

      totalizeIva : function(products){
        var _total = 0;

        angular.forEach(products, function(_curr){
              _total = _total + (_curr.valor_iva);
        });

        return _total;
      }
  	};
    // AngularJS will instantiate a singleton by calling "new" on this function
  });
