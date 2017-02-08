/**
 * Recliner.js
 * A super lightweight production ready jQuery plugin
 * for lazy loading images and other dynamic content.
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
        attrib: "data-src", // selector for attribute containing the media src
	      throttle: 300,      // millisecond interval at which to process events
	      threshold: 100,     // scroll distance from element before its loaded
	      printable: true,    // be printer friendly and show all elements on document print
	      live: true,         // auto bind lazy loading to ajax loaded elements
        getScript: false    // load content with `getScript` rather than `ajax`
      }, options);

    // load the element source
    function load(e) {
      var $e = $(e),
        source = $e.attr(options.attrib),
        type = $e.prop('tagName');
      if (source) {
        $e.addClass('lazy-loading');
        if (type == 'IMG' || type == 'IFRAME') {
          $e.attr('src', source);
          $e[0].onload = function(ev) { onload($e); };
        }
        else if (options.getScript === true) {
          $.getScript(source, function(ev) { onload($e); });
        }
        else {
          // ajax load non image and iframe elements
          $e.load(source, function(ev) { onload($e); });
        }
      }
      else {
        onload($e); // set as loaded if no action taken
      }
    }

    // handle element load complete
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
        if ($e.css('display') == 'none') return;

        // If no Doctype is declared jquery's $(window).height() does not work properly
        // See http://stackoverflow.com/a/25274520/322253
        // Therefore use innerHeight instead (if it's available)
        var viewportHeight = (typeof window.innerHeight !== 'undefined') ? window.innerHeight : $w.height();

        var wt = $w.scrollTop(),
          wb = wt + viewportHeight,
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

      process();
    }

    // bind lazy loading events
    $w.on("scroll.lazy resize.lazy lookup.lazy", function(ev) {
      if (timer)
        clearTimeout(timer); // throttle events for best performance
      timer = setTimeout(function() { $w.trigger("lazyupdate"); }, options.throttle);
    });

    $w.on("lazyupdate", function(ev) {
      process();
    });

    // handle elements loaded into the dom via ajax
    if (options.live) {
      $(document).ajaxSuccess(function(ev, xhr, settings) {
        var $e = $(selector).not('.lazy-loaded').not('.lazy-loading');

        elements = elements.add($e);
        init($e);
      });
    }

    // be printer friendly and show all elements on document print
    if (options.printable && window.matchMedia) {
        window
          .matchMedia('print')
          .addListener(function (mql) {
            if (mql.matches) {
              $(selector).trigger('lazyload');
            }
          });
    }

    init(this);
    return this;
  };

})(window.jQuery);
