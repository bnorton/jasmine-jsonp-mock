#Jasmine Mock JSONP
======

##Webmock Style Mocking Framework for Jasmine Testing

To stub requests that look like these

```javascript
  var url = "http://api.twitter.com/1/trends/available.json?callback=?";

  $.getJSON(url).
    success(function(data) {
      console.log("success", data);
	});
```

The resulting JSONP object has all of the standard jqXHR methods.

```javascript
// Setup a JSONP request object
  var request = jasmine.JSONP.stubRequest(url);
```

Calling `.success`, `.error` or `.complete` on this object will perform the specified callback.

```javascript
// Then simply invoke the appropriate callback
  request.success([{"url": "http://t.co/someurl", "name": "#justinbieber"}])
```

##Full Example

```javascript

// /javascripts/agents/trends.js
  var url = "http://api.twitter.com/1/trends/available.json?callback=?";

  $.getJSON(url).
    success(function(data) {
      var urls = _.map(data, function(trend) {
        return trend.url;     
      };

	  that.model.set("trend_urls", urls);
	  that.model.trigger("change:trendUrls");
	}).
    error(function() {
      that.errors.reset([I18n.t("twitter.trends.error")]);
    });
```

```javascript
// /javascripts/agents/trends_spec.js

var model = new app.Model();
var errors = new app.Errors();
var agent = new app.TrendsAgent({model: model, errors: errors});

...

  describe("when fetching the worldwide trends", function() {
    var request, trendUrls;

    beforeEach(function() {
      var event = jasmine.createSpy("Event"),
        url = "http://api.twitter.com/1/trends/available.json?callback=?";

      trendUrls = jasmine.createSpy("trendUrls");
      model.on("change:trendUrls", trendUrls);

      request = jasmine.JSONP.stubRequest(url);

      view.submit(event);
    });

    describe("on success", function() {
      beforeEach(function() {
        request.success([
          { "url": "http://t.co/trend1", "name": "trend 1" },
          { "url": "http://t.co/trend2", "name": "trend 2" }
        ]);
      });

      it("should set the trend urls", function() {
        expect(model.get("trend_urls")).toEqual(["http://t.co/trend1", "http://t.co/trend2"]);
      });

      it("should trigger the change:trendUrls event", function() {
        expect(trendUrls).toHaveBeenCalled();
      });
    });

    describe("on error", function() {
      var reset;

      beforeEach(function() {
        reset = jasmine.createSpy("reset");
        model.on("reset", reset);

        request.error();
      });

      it("should have an error", function() {
        expect(agent.errors.length).toEqual(1);
      });

      it("should set the error message", function() {
        expect(agent.errors.first()).toEqual(I18n.t("twitter.trends.error"));
      });

      it("should trigger the reset event", function() {
        expect(reset).toHaveBeenCalled();
      });
    });
  });
```
