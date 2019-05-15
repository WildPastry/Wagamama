// SHOPPING CART
(function ($) {

  "use strict";

  var OptionManager = (function () {
    var objToReturn = {};

    var defaultOptions = {
      classCartIcon: 'my-cart-icon',
      classCartBadge: 'my-cart-badge',
      affixCartIcon: true,
      checkoutCart: function (products) {},
      clickOnAddToCart: function ($addTocart) {},
      getDiscountPrice: function (products) {
        return null;
      }
    };

    var getOptions = function (customOptions) {
      var options = $.extend({}, defaultOptions);
      if (typeof customOptions === 'object') {
        $.extend(options, customOptions);
      }
      return options;
    }

    objToReturn.getOptions = getOptions;
    return objToReturn;
  }());

  var ProductManager = (function () {
    var objToReturn = {};
    localStorage.products = localStorage.products ? localStorage.products : "";
    var getIndexOfProduct = function (id) {
      var productIndex = -1;
      var products = getAllProducts();
      $.each(products, function (index, value) {
        if (value.id == id) {
          productIndex = index;
          return;
        }
      });
      return productIndex;
    }
    var setAllProducts = function (products) {
      localStorage.products = JSON.stringify(products);
    }
    var addProduct = function (id, name, summary, price, quantity, image) {
      var products = getAllProducts();
      products.push({
        id: id,
        name: name,
        summary: summary,
        price: price,
        quantity: quantity,
        image: image
      });
      setAllProducts(products);
    }

    var getAllProducts = function () {
      try {
        var products = JSON.parse(localStorage.products);
        return products;
      } catch (e) {
        return [];
      }
    }
    var updatePoduct = function (id, quantity) {
      var productIndex = getIndexOfProduct(id);
      if (productIndex < 0) {
        return false;
      }
      var products = getAllProducts();
      products[productIndex].quantity = typeof quantity === "undefined" ? products[productIndex].quantity * 1 + 1 : quantity;
      setAllProducts(products);
      return true;
    }
    var setProduct = function (id, name, summary, price, quantity, image) {
      if (typeof id === "undefined") {
        console.error("id required")
        return false;
      }
      if (typeof name === "undefined") {
        console.error("name required")
        return false;
      }
      if (typeof image === "undefined") {
        console.error("image required")
        return false;
      }
      if (!$.isNumeric(price)) {
        console.error("price is not a number")
        return false;
      }
      if (!$.isNumeric(quantity)) {
        console.error("quantity is not a number");
        return false;
      }
      summary = typeof summary === "undefined" ? "" : summary;

      if (!updatePoduct(id)) {
        addProduct(id, name, summary, price, quantity, image);
      }
    }
    var clearProduct = function () {
      setAllProducts([]);
    }
    var removeProduct = function (id) {
      var products = getAllProducts();
      products = $.grep(products, function (value, index) {
        return value.id != id;
      });
      setAllProducts(products);
    }
    var getTotalQuantityOfProduct = function () {
      var total = 0;
      var products = getAllProducts();
      $.each(products, function (index, value) {
        total += value.quantity * 1;
      });
      return total;
    }

    objToReturn.getAllProducts = getAllProducts;
    objToReturn.updatePoduct = updatePoduct;
    objToReturn.setProduct = setProduct;
    objToReturn.clearProduct = clearProduct;
    objToReturn.removeProduct = removeProduct;
    objToReturn.getTotalQuantityOfProduct = getTotalQuantityOfProduct;
    return objToReturn;
  }());

  var loadMyCartEvent = function (userOptions) {

    var options = OptionManager.getOptions(userOptions);
    var $cartIcon = $("." + options.classCartIcon);
    var $cartBadge = $("." + options.classCartBadge);

    var idCartModal = 'my-cart-modal';
    var idCartTable = 'my-cart-table';
    var classProductQuantity = 'my-product-quantity';
    var classProductTotal = 'my-product-total';
    var idGrandTotal = 'my-cart-grand-total';
    var idCheckoutCart = 'checkout-my-cart';
    var classProductRemove = 'my-product-remove';
    var idEmptyCartMessage = 'my-cart-empty-message';
    var classAffixMyCartIcon = 'my-cart-icon-affix';
    var idDiscountPrice = 'my-cart-discount-price';

    $cartBadge.text(ProductManager.getTotalQuantityOfProduct());

    if (!$("#" + idCartModal).length) {
      $('body').append(
        '<div class="modal fade" id="' + idCartModal + '" tabindex="-1" role="dialog" aria-labelledby="myModalLabel">' +
        '<div class="modal-dialog" role="document">' +
        '<div class="modal-content">' +
        '<div class="modal-header">' +
        '<button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>' +
        '<h3 class="modal-title" id="myModalLabel"></span>Review Order</h3>' +
        '</div>' +
        '<div class="modal-body">' +
        '<table class="table table-hover table-responsive" id="' + idCartTable + '"></table>' +
        '</div>' +
        '<div class="modal-footer">' +
        '<button type="button" class="btn btn--red" data-dismiss="modal">Back</button>' +
        '<a href="sure.html"><input class="btn btn--grn" type="submit" value="Place Order"></a>' +
        '</div>' +
        '</div>' +
        '</div>' +
        '</div>'
      );
    }

    var drawTable = function () {
      var $cartTable = $("#" + idCartTable);
      $cartTable.empty();

      var products = ProductManager.getAllProducts();
      $.each(products, function () {
        var total = this.quantity * this.price;
        $cartTable.append(
          '<tr title="' + this.summary + '" data-id="' + this.id + '" data-price="' + this.price + '">' +
          '<td class="text-center"</td>' +
          '<td>' + this.name + '</td>' +
          '<td title="Unit Price">$' + this.price + '</td>' +
          '<td title="Quantity"><input type="number" min="1" style="width: 70px;" class="' + classProductQuantity + '" value="' + this.quantity + '"/></td>' +
          '<td title="Total" class="' + classProductTotal + '">$' + total +
          '<td title="Remove from Order" class="text-center" style="width: 30px;"><a href="javascript:void(0);" class="btn btn--red btn--xs btn-danger ' + classProductRemove + '">X</a></td>' +
          '</tr>'
        );
      });

      $cartTable.append(products.length ?
        '<tr>' +
        '<td></td>' +
        '<td><strong>Total</strong></td>' +
        '<td></td>' +
        '<td></td>' +
        '<td><strong id="' + idGrandTotal + '">$</strong></td>' +
        '<td></td>' +
        '</tr>' :
        '<div class="alert alert-danger" role="alert" id="' + idEmptyCartMessage + '">Your order is empty</div>'
      );

      var discountPrice = options.getDiscountPrice(products);
      if (discountPrice !== null) {
        $cartTable.append();
      }

      showGrandTotal(products);
      showDiscountPrice(products);
    }
    var showModal = function () {
      drawTable();
      $("#" + idCartModal).modal('show');
    }
    var updateCart = function () {
      $.each($("." + classProductQuantity), function () {
        var id = $(this).closest("tr").data("id");
        ProductManager.updatePoduct(id, $(this).val());
      });
    }
    var showGrandTotal = function (products) {
      var total = 0;
      $.each(products, function () {
        total += this.quantity * this.price;
      });
      $("#" + idGrandTotal).text("$" + total);
    }
    var showDiscountPrice = function (products) {
      $("#" + idDiscountPrice).text("$" + options.getDiscountPrice(products));
    }

    if (options.affixCartIcon) {
      var cartIconBottom = $cartIcon.offset().top * 1 + $cartIcon.css("height").match(/\d+/) * 1;
      var cartIconPosition = $cartIcon.css('position');
      $(window).scroll(function () {
        if ($(window).scrollTop() >= cartIconBottom) {
          $cartIcon.css('position', 'fixed').css('z-index', '999').addClass(classAffixMyCartIcon);
        } else {
          $cartIcon.css('position', cartIconPosition).css('background-color', 'inherit').removeClass(classAffixMyCartIcon);
        }
      });
    }

    $cartIcon.click(showModal);

    $(document).on("input", "." + classProductQuantity, function () {
      var price = $(this).closest("tr").data("price");
      var id = $(this).closest("tr").data("id");
      var quantity = $(this).val();

      $(this).parent("td").next("." + classProductTotal).text("$" + price * quantity);
      ProductManager.updatePoduct(id, quantity);

      $cartBadge.text(ProductManager.getTotalQuantityOfProduct());
      var products = ProductManager.getAllProducts();
      showGrandTotal(products);
      showDiscountPrice(products);
    });

    $(document).on('click', "." + classProductRemove, function () {
      var $tr = $(this).closest("tr");
      var id = $tr.data("id");
      $tr.hide(50, function () {
        ProductManager.removeProduct(id);
        drawTable();
        $cartBadge.text(ProductManager.getTotalQuantityOfProduct());
      });
    });

    $("#" + idCheckoutCart).click(function () {
      var products = ProductManager.getAllProducts();
      if (!products.length) {
        $("#" + idEmptyCartMessage).fadeTo('fast', 0.3).fadeTo('fast', 0.3);
        return;
      }
      updateCart();
      options.checkoutCart(ProductManager.getAllProducts());
      ProductManager.clearProduct();
      $cartBadge.text(ProductManager.getTotalQuantityOfProduct());
      $("#" + idCartModal).modal("hide");
    });

    $(document).on('keypress', "." + classProductQuantity, function (evt) {
      if (evt.keyCode == 38 || evt.keyCode == 40) {
        return;
      }
      evt.preventDefault();
    });
  }

  var MyCart = function (target, userOptions) {

    var $target = $(target);
    var options = OptionManager.getOptions(userOptions);
    var $cartIcon = $("." + options.classCartIcon);
    var $cartBadge = $("." + options.classCartBadge);

    $target.click(function () {
      options.clickOnAddToCart($target);

      var id = $target.data('id');
      var name = $target.data('name');
      var summary = $target.data('summary');
      var price = $target.data('price');
      var quantity = $target.data('quantity');
      var image = $target.data('image');

      ProductManager.setProduct(id, name, summary, price, quantity, image);
      $cartBadge.text(ProductManager.getTotalQuantityOfProduct());
    });

  }

  $.fn.myCart = function (userOptions) {
    loadMyCartEvent(userOptions);
    return $.each(this, function () {
      new MyCart(this, userOptions);
    });
  }

  $(function () {

    var goToCartIcon = function ($addTocartBtn) {
      var $cartIcon = $(".my-cart-icon");
      var $image = $('<img width="30px" height="30px" src="' + $addTocartBtn.data("image") + '"/>').css({
        "position": "fixed",
        "z-index": "999"
      });
      $addTocartBtn.prepend($image);
      var position = $cartIcon.position();
      $image.animate({
        top: position.top,
        left: position.left
      }, 500, "linear", function () {
        $image.remove();
      });
    }

    $('.my-cart-btn').myCart({
      currencySymbol: '$',
      classCartIcon: 'my-cart-icon',
      classCartBadge: 'my-cart-badge',
      classProductQuantity: 'my-product-quantity',
      classProductRemove: 'my-product-remove',
      classCheckoutCart: 'my-cart-checkout',
      affixCartIcon: true,
      showCheckoutModal: true,
      numberOfDecimals: 0,
      cartItems: [{
          id: 1,
          name: 'Hungi Donburi',
          summary: 'summary 1',
          price: 18.5,
          quantity: 1,
          image: 'images/img_1.png'
        },
        {
          id: 2,
          name: 'product 2',
          summary: 'summary 2',
          price: 20,
          quantity: 2,
          image: 'images/img_2.png'
        },
        {
          id: 3,
          name: 'product 3',
          summary: 'summary 3',
          price: 30,
          quantity: 1,
          image: 'images/img_3.png'
        }
      ],
      clickOnAddToCart: function ($addTocart) {
        goToCartIcon($addTocart);
      },
      afterAddOnCart: function (products, totalPrice, totalQuantity) {
        console.log("afterAddOnCart", products, totalPrice, totalQuantity);
      },
      clickOnCartIcon: function ($cartIcon, products, totalPrice, totalQuantity) {
        console.log("cart icon clicked", $cartIcon, products, totalPrice, totalQuantity);
      },
      checkoutCart: function (products, totalPrice, totalQuantity) {
        var checkoutString = "Total Price: " + totalPrice + "\nTotal Quantity: " + totalQuantity;
        checkoutString += "\n\n id \t name \t summary \t price \t quantity \t image path";
        $.each(products, function () {
          checkoutString += ("\n " + this.id + " \t " + this.name + " \t " + this.summary + " \t " +
            this.price + " \t " + this.quantity + " \t " + this.image);
        });
        alert(checkoutString)
        console.log("checking out", products, totalPrice, totalQuantity);
      },
      getDiscountPrice: function (products, totalPrice, totalQuantity) {
        console.log("calculating discount", products, totalPrice, totalQuantity);
        return totalPrice * 0.5;
      }
    });

    $("#addNewProduct").click(function (event) {
      var currentElementNo = $(".row").children().length + 1;
      $(".row").append(
        '<div class="col-md-3 text-center"><img src="images/img_empty.png" width="150px" height="150px"><br>product ' +
        currentElementNo + ' - <strong>$' + currentElementNo +
        '</strong><br><button class="btn btn-danger my-cart-btn" data-id="' + currentElementNo +
        '" data-name="product ' + currentElementNo + '" data-summary="summary ' + currentElementNo +
        '" data-price="' + currentElementNo +
        '" data-quantity="1" data-image="images/img_empty.png">Add to Cart</button><a href="#" class="btn btn-info">Details</a></div>'
      )
    });
  });
})(jQuery);