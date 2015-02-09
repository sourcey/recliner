# Recliner.js
   
Recliner is a super-lightweight (1KB), production ready jQuery plugin for lazy loading images and other dynamic content. Being lazy never felt so good, just hook it up, start sippin' on your margarita!

## Why use Recliner?

So why another lazy loading implementation? Recliner was born out of necessity when one of our clients was experiencing massive scrolling lag on the mobile version of their media heavy site. It turned out that `lazy-load-xt` was the culprit, and after testing all the other lazy load scripts **none** of them meet our simple criteria:

* Lightweight
* Sets stateful CSS classes on elements
* Ability to override event callbacks for custom behaviour
* Can load both images and other dynamic (AJAX) content

## Using Recliner

Instantiate Recliner like so:

``` javascript
$(".lazy").recliner({
    attrib: "data-src", // attribute selector containing the media src
	throttle: 300,      // millisecond interval at which to process events
	threshold: 100,     // scroll distance from element before its loaded
	live: true          // auto bind lazy loading to ajax loaded elements
});
```

Recliner uses a simple event based API for implementing custom behaviour:

``` javascript
// Do something with elements that are about to be loaded
$(document).on('lazyload', '.lazy', function() {
    var $e = $(this);
    console.log('lazyshow after', $e);
});
    
// Do something with elements after they have been loaded
$(document).on('lazyshow', '.lazy', function() {
    var $e = $(this);
    console.log('lazyshow after', $e);
});

// Force an update to check for new elements to be loaded
$(window).trigger("lazyupdate");
```

Recliner will set the following stateful CSS classes of your elements:

* `lazy-loading`: The element is currently being loaded
* `lazy-loaded`: The element has loaded

What more do you need?

## Contributing

1. Fork it
2. Create your feature branch (`git checkout -b my-new-feature`)
3. Commit your changes (`git commit -am 'Add some feature'`)
4. Push to the branch (`git push origin my-new-feature`)
5. Create new Pull Request

## Issues

If you find any bugs please use the [Github issue tracker](https://github.com/sourcey/recliner/issues).

