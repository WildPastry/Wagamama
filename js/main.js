/*jslint browser:true */

// SLIDESHOW
$(function () {
  $('.slide--control div:gt(0)').hide();
  setInterval(function () {
    $('.slide--control :first-child').fadeOut().next('div').fadeIn().end().appendTo('.slide--control');
  }, 5000);

  // SELECTABLE LIST
  $(function () {
    $(".selectable").selectable();
  });

  // ADDING PRICES
  $("#adding__1").click(function () {
    $("#adding").text("Total: $16");
  });

  $("#adding__1").click(function () {
    $("#adding__btn").text("Pay $16");
  });

  $("#adding__2").click(function () {
    $("#adding").text("Total: $18");
  });

  $("#adding__2").click(function () {
    $("#adding__btn").text("Pay $18");
  });

  $("#adding__3").click(function () {
    $("#adding").text("Total: $19.5");
  });

  $("#adding__3").click(function () {
    $("#adding__btn").text("Pay $19.5");
  });

  $("#adding__4").click(function () {
    $("#adding").text("Total: $20");
  });

  $("#adding__4").click(function () {
    $("#adding__btn").text("Pay $20");
  });

  $("#adding__5").click(function () {
    $("#adding").text("Total: $9.5");
  });

  $("#adding__5").click(function () {
    $("#adding__btn").text("Pay $9.5");
  });

  $("#adding__6").click(function () {
    $("#adding").text("Total: $8");
  });

  $("#adding__6").click(function () {
    $("#adding__btn").text("Pay $8");
  });
});

function preventBack() {
  window.history.back();
}