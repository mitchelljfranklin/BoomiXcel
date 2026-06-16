document.arrive(".filter_popup", function (filteredScreen) {
    if (BoomiPlatform.apply_process_filters !== "on") return;
      var matchingxref = document.evaluate(
        "//label[contains(text(),'Cross Reference Table')]",
        document,
        null,
        XPathResult.FIRST_ORDERED_NODE_TYPE,
        null,
      ).singleNodeValue;
      var matchingprocess = document.evaluate(
        "//label[contains(text(),'Process')]",
        document,
        null,
        XPathResult.FIRST_ORDERED_NODE_TYPE,
        null,
      ).singleNodeValue;
      var matchingproprop = document.evaluate(
        "//label[contains(text(),'Process Property')]",
        document,
        null,
        XPathResult.FIRST_ORDERED_NODE_TYPE,
        null,
      ).singleNodeValue;
      var matchingapiserv = document.evaluate(
        "//label[contains(text(),'API Service')]",
        document,
        null,
        XPathResult.FIRST_ORDERED_NODE_TYPE,
        null,
      ).singleNodeValue;

      document.getElementById(matchingprocess.htmlFor).checked = BoomiPlatform.Filter_process;
      document.getElementById(matchingproprop.htmlFor).checked = BoomiPlatform.Filter_processProp;
      document.getElementById(matchingxref.htmlFor).checked = BoomiPlatform.Filter_crossref;
      document.getElementById(matchingapiserv.htmlFor).checked = BoomiPlatform.Filter_api_service;
});
