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
        attrib: 'data-src', // Selector for attribute containing the media src
	      throttle: 300,      // Millisecond interval at which to process events
	      threshold: 100,     // Scroll distance from element before its loaded
	      printable: true,    // Be printer friendly and show all elements on document print
	      live: true,         // Auto bind lazy loading to ajax loaded elements
        getScript: false    // Load content with `getScript` rather than `ajax`
      }, options);

    // Load the element source
    function load(e) {
      var $e = $(e),
        source = $e.attr(options.attrib),
        type = $e.prop('tagName');
      if (source) {
        $e.addClass('lazy-loading');

        // Elements with [src] attribute: <audio>, <embed>, <iframe>, <img>, <input>, <script>, <source>, <track>, <video> (https://developer.mozilla.org/en-US/docs/Web/HTML/Attributes)
        // Excepts: <input>, <script> (use options.getScript instead)
        if (/^(IMG|IFRAME|AUDIO|EMBED|SOURCE|TRACK|VIDEO)$/.test(type)) {
          $e.attr('src', source);
          $e[0].onload = function(ev) { onload($e); };
        }
        else if ($e.data('script')) {
          $.getScript(source, function(ev) { onload($e); });
        }
        else {
          // Ajax load non image and iframe elements
          $e.load(source, function(ev) { onload($e); });
        }
      }
      else {
        onload($e); // set as loaded if no action taken
      }
    }

    // Handle element load complete
    function onload(e) {

      // Remove loading and add loaded class to all elements
      e.removeClass('lazy-loading');
      e.addClass('lazy-loaded');

      // Handle lazyshow event for custom processing
      e.trigger('lazyshow');
    }

    // Process the next elements in the queue
    function process() {
      // If no Doctype is declared jQuery's $(window).height() does not work properly
      // See http://stackoverflow.com/a/25274520/322253
      // Therefore use innerHeight instead (if available)
      var viewportHeight = (typeof window.innerHeight !== 'undefined') ? window.innerHeight : $w.height();

      // Detect if the scroll position is at the bottom of the page
      var eof = (window.innerHeight + window.scrollY) >= document.body.offsetHeight;

      // elements = elements.not('.lazy-loaded').not('.lazy-loading');
      var inview = elements.filter(function() {
        var $e = $(this);
        if ($e.css('display') == 'none') return;

        var wt = $w.scrollTop(),
          wb = wt + viewportHeight,
          et = $e.offset().top,
          eb = et + $e.height();

        return (eb >= wt - options.threshold &&
          et <= wb + options.threshold) || eof;
      });

      loaded = inview.trigger('lazyload');
      elements = elements.not(loaded);
    }

    // Initialize elements for lazy loading
    function init(els) {

      // Bind the lazyload event for loading elements
      els.one('lazyload', function() {
        load(this);
      });

      process();
    }

    // Bind lazy loading events
    $w.on('scroll.lazy resize.lazy lookup.lazy', function(ev) {
      if (timer)
        clearTimeout(timer); // throttle events for best performance
      timer = setTimeout(function() { $w.trigger('lazyupdate'); }, options.throttle);
    });

    $w.on('lazyupdate.lazy', function(ev) {
      process();
    });

    // Handle elements loaded into the dom via ajax
    if (options.live) {
      $(document).on('ajaxSuccess.lazy', function() {
        var $e = $(selector).not('.lazy-loaded').not('.lazy-loading');

        elements = elements.add($e);
        init($e);
      });
    }

    // Be printer friendly and show all elements on document print
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

  // Unbind Recliner events
  $.fn.derecliner = function(options) {
    var $w = $(window);
    $w.off('scroll.lazy resize.lazy lookup.lazy');
    $w.off('lazyupdate.lazy');
    $(document).off('ajaxSuccess.lazy');
  };

})(jQuery);
