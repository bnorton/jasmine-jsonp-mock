describe("JasmineJSONPMock", function() {
  var request,
      url = 'http://api.example.com/info.json';

  describe("#toHaveBeenRequested", function() {
    beforeEach(function() {
      request = jasmine.JSONP.stubRequest(url);
    });

    it("should exist", function() {
      expect(expect().toHaveBeenRequested).toBeDefined();
    });

    it("should be false", function() {
      expect(request).not.toHaveBeenRequested();
    });

    describe("when the request has been made", function() {
      beforeEach(function() {
        $.getJSON(url);
      });

      it("should should be true", function() {
        expect(request).toHaveBeenRequested();
      });
    });
  });

  describe("#mostRecentJSONPRequest", function() {
    it("should exist", function() {
      expect(typeof mostRecentJSONPRequest).toEqual('function');
    });

    it("should be null", function() {
      expect(mostRecentJSONPRequest()).toBeNull();
    });

    describe("when a request has been made", function() {
      beforeEach(function() {
        $.getJSON(url)
      });

      it("should be defined", function() {
        expect(mostRecentJSONPRequest()).not.toBeNull();
      });
    });
  });

  describe("#clearJSONPRequests", function() {
    it("should exist", function() {
      expect(typeof clearJSONPRequests).toEqual('function');
    });

    it("should be false", function() {
      expect(clearJSONPRequests()).toEqual(false);
    });

    describe("when a request has been made", function() {
      beforeEach(function() {
        $.getJSON(url)
      });

      it("should be true", function() {
        expect(clearJSONPRequests()).toEqual(true);
      });
    });
  });

  function sharedExamplesForaCallbackType(context) {
    var request,
      callback,
      data;

    describe("for callback " + context.method, function() {
      beforeEach(function() {
        callback = jasmine.createSpy(context.method);
        request = jasmine.JSONP.stubRequest(url);

        $.getJSON(url)[context.method](callback);
      });

      it("should exist", function() {
        expect(typeof request[context.method]).toEqual('function');
      });

      it("should invoke the given callback", function() {
        context.makeRequest();

        expect(callback).toHaveBeenCalled();
      });

      describe("when given data", function() {
        beforeEach(function() {
          context.makeRequest();
        });

        it("should invoke with the given data", function() {
          expect(callback).toHaveBeenCalledWith(context.data);
        });
      });
    });
  }

  describe("callbacks", function() {
    var data = {
      id: 1,
      name: "John Doe"
    };

    describe("#success", function() {
      var makeRequest = function() { request.success(data) };

      sharedExamplesForaCallbackType({method: "success", data: data, makeRequest: makeRequest});
    });

    describe("#error", function() {
      var makeRequest = function() { request.error(data); };

      sharedExamplesForaCallbackType({method: "error", data: data, makeRequest: makeRequest});
    });

    describe("#complete", function() {
      var makeRequest = function() { request.complete(data); };

      sharedExamplesForaCallbackType({method: "complete", data: data, makeRequest: makeRequest});
    });
  });
});
