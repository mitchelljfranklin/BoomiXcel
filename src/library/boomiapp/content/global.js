/*------Global------*/
//Variables
var sPageURL;

/*-------------Global Calling Functions--------------------*/

//Function to retrieve the current URL parameters and split them into each unique record
var getUrlpath = function getUrlpath() {
  sPageURL = $(location).attr("href");
  return sPageURL;
};

//Function to adjust the Dashboard Grids from default to 7 days
function dashboardDays() {
  //Only Actions occur once the screen has been fully loaded
  var accountdashLoaded = setInterval(function () {
    var information = document.getElementsByClassName("gwt-viz-container")[2];

    if (information != undefined) {
      $(".time_range_selector").each(function () {
        var dashVal = $(this).text();

        if (dashVal == "7d") {
          $(this).click();
        }
      });

      clearInterval(accountdashLoaded); //clear the interval now that data has been loaded
    }

    //end of execution once
  }, 1000);
  //////////
}

function getUrlParameter(sParam) {
  var sPageURL = $(location).attr("href"),
    sURLVariables = sPageURL.split(";"),
    sParameterName,
    i;

  for (i = 0; i < sURLVariables.length; i++) {
    sParameterName = sURLVariables[i].split("=");

    if (sParameterName[0] === sParam) {
      return sParameterName[1] === undefined
        ? true
        : decodeURIComponent(sParameterName[1]);
    }
  }
}

function getPageNameWithoutExtension() {
  return window.location.pathname.split("/").pop().split(".")[0];
}

function getGWTPageName() {
  var urlString = $(location).attr("href");
  var page = urlString.substring(
    urlString.indexOf("#") + 1,
    urlString.indexOf(";"),
  );
  return page;
}

function showInformationAlertDialog(message) {
  $(".context_menu").remove();
  $(".context_menu_glass").remove();
  showToast(message, 3000);
}

function fancyTimeFormat(duration) {
  var hrs = ~~(duration / 3600);
  var mins = ~~((duration % 3600) / 60);
  var secs = ~~duration % 60;
  var ret = "";
  if (hrs > 0) {
    ret += "" + hrs + ":" + (mins < 10 ? "0" : "");
  }
  ret += "" + mins + ":" + (secs < 10 ? "0" : "");
  ret += "" + secs;
  return ret;
}
