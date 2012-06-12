jasmine.JSONP = (function(jasmine, $) {
  var self = {},
      mocks = {},
      requested = {},
      requests = [];

  initialize();

  self.stubRequest = function(url) {
    requested[url] = null;

    return buildJSONP(mocks, url);
  };

  beforeEach(function() {
    this.addMatchers({
      toHaveBeenRequested: function() {
        return !!requested[this.actual.url];
      }
    });
  });

  return self;

  function initialize() {
    $.getJSON = function(url) {
      requested[url] = buildJSONP(mocks, url);
      requests.push(url);

      mocks[url] = {};
      return buildMock(mocks, url);
    };

    window.clearJSONPRequests = function() {
      var status = requests.length !== 0;
      requested = {}; requests = [];

      return status;
    };

    window.mostRecentJSONPRequest = function() {
      if(requests.length === 0) return null;

      return buildJSONP(mocks, requests[requests.length - 1])
    };
  }

  function buildJSONP(mock, url) {
    return {
      url: url,
      success: function(data) {
        mock[url].callbacks.success(data)
      },
      error: function(data) {
        mock[url].callbacks.error(data)
      },
      complete: function(data) {
        mock[url].callbacks.complete(data)
      }
    };
  }

  function buildMock(mock, url) {
    mock[url].callbacks = {};

    return {
      success: function(callback) {
        mock[url].callbacks.success = callback;
      },
      error: function(callback) {
        mock[url].callbacks.error = callback;
      },
      complete: function(callback) {
        mock[url].callbacks.complete = callback;
      }
    }
  }

})(jasmine, jQuery);
