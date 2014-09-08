/**
 * jQuery Recliner
 * A lightweight production ready jQuery plugin 
 * to lazy load images and other dynamic content.
 *
 * Licensed under the MIT license.
 * Copyright 2014 Kam Low
 * http://sourcey.com
 */

;(function($) {

  $.fn.recliner = function(options) {

    var $w = $(window),
      elements = this,
      selector = this.selector,
      loaded,
      timer,
      options = $.extend({
        attrib: "data-src", // lazy element selector
        throttle: 300,      // milisecond interval at which to process events
        threshold: 100,     // scroll distance from element before its loaded
        live: false,        // handle ajax loaded elements
      }, options);

    // load the element source
    function load(e) {
      var $e = $(e),
        source = $e.attr(options.attrib);
        type = $e.prop("tagName");
      if (source) {
          console.log('source', source)
        if (type == 'IMG' || type == 'IFRAME') {
          $e.attr("src", source);
        }
        else {

          // ajax load non image and iframe elements
          $e.load(source, function(ev) {
            onload($e);
          });
          return;
        }
      }

      onload($e);
    }

    // handle load complete
    function onload(e) {

      // remove loading and add loaded class to all elements
      e.removeClass('lazy-loading');
      e.addClass('lazy-loaded');

      // handle lazyshow event for custom processing
      e.trigger('lazyshow');
    }

    // process the next elements in the queue
    function process() {
      var inview = elements.filter(function() {
        var $e = $(this);
        if ($e.is(":hidden")) return;

        var wt = $w.scrollTop(),
            wb = wt + $w.height(),
            et = $e.offset().top,
            eb = et + $e.height();
      
        return eb >= wt - options.threshold && 
          et <= wb + options.threshold;
      });

      loaded = inview.trigger("lazyload");
      elements = elements.not(loaded);
    }

    // initialize elements for lazy loading
    function init(els) {

      // bind the lazyload event for loading elements
      els.one("lazyload", function() {
        load(this);
      });

      // add loading class to all elements
      els.addClass('lazy-loading');

      process();
    }

    // bind lazy loading events
    $w.on("scroll.lazy resize.lazy lookup.lazy", function(ev) {
      if (timer)
        clearTimeout(timer); // throttle events for best performance
      timer = setTimeout(process, options.throttle);
    });

    // handle elements loaded into the dom via ajax
    if (options.live) {
      $(document).ajaxSuccess(function(event, xhr, settings) {
        var $e = $(selector).not('.lazy-loaded').not('.lazy-loading');
        elements = elements.add($e);
        init($e);
      });
    }

    init(this);
    return this;
  };

})(window.jQuery || window.Zepto);