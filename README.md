# Recliner.js
   
Recliner is a super lightweight (1KB) jQuery plugin for lazy loading images, iframes and other dynamic (AJAX) content. Being lazy never felt so good, just hook it up, and start sippin' those margaritas!

The script was born out of necessity when one of our clients came to us with massive scroll lag on one of their media heavy mobile news sites. It turned out that `lazy-load-xt` was the culprit, so naturally we tested the other lazy load scripts out there but **none** of them met our simple criteria:

* Lightweight
* Sets stateful CSS classes on elements
* Ability to override event callbacks for custom behaviour
* Can load *any* dynamic content (images, iframes, AJAX) 
* Mobile friendly
* Printer friendly

Recliner is currently used on some very high traffic sites, so it's well tested and production ready. 

## Demo

For more information and a live demo see the project page: [http://sourcey.com/recliner](http://sourcey.com/recliner)

## Installation

If you use `bower` then type:

```bash
bower install recliner
```

Or if you like using `npm` then go ahead and type:

```bash
npm install jquery-recliner
```

Otherwise, just download `recliner.min.js` and stick it in your assets folder :)

## Usage

Add jQuery (2.x or 1.x) and Recliner to your HTML source:

```html
<script src="//code.jquery.com/jquery-2.1.4.min.js"></script>
<script src="recliner.min.js"></script>
```

Bind Recliner on elements with the `.lazy` class:

```javascript
$(".lazy").recliner({
    attrib: "data-src", // selector for attribute containing the media src
    throttle: 300,      // millisecond interval at which to process events
    threshold: 100,     // scroll distance from element before its loaded
    printable: true,    // be printer friendly and show all elements on document print
    live: true          // auto bind lazy loading to ajax loaded elements
});
```

You can also progrmatically trigger an update to check for new elements to be loaded:

```javascript
$(window).trigger("lazyupdate");
```

Recliner can be used to load a range of different dynamic content. 

##### Images

**Note:** It's a good idea to specify image dimensions explicitly so your page height doesn't go berserk as lazy content is loaded into the DOM.

```html
<img src="some-placeholder-image.png" data-src="image-to-lazy-load.png" class="lazy" width="333" height="333" /> 
```

##### Iframes

```html
<iframe data-src="http://sourcey.com" width="333" height="333" class="lazy" frameborder="0" vspace="0" hspace="0"></iframe>
```

##### AJAX

```html
<div data-src="http://sourcey.com" class="lazy" style="width:333px;height:333px">
    Loading, be patient damnit!
</div>
```

## Callback API

Recliner exposes a simple event based API so you can implement your own custom behaviour using callbacks:

##### lazyload

The `lazyload` event will be triggered on elements that are about to be loaded.

```javascript
$(document).on('lazyload', '.lazy', function() {
    var $e = $(this);
    // do something with the element to be loaded...
    console.log('lazyload', $e);
});
```
    
##### lazyshow

The `lazyshow` event will be triggered on elements after they have been loaded.
    
```javascript
$(document).on('lazyshow', '.lazy', function() {
    var $e = $(this);
    // do something with the loaded element...
    console.log('lazyshow', $e);
});
```

## Styling and Animations

Recliner will set the following stateful CSS classes on your elements:

* `lazy-loading`: Set while the element is being loaded
* `lazy-loaded`: Set when the element has loaded

Using the stateful classes you can add some fancy transitions to your images:

```css
img {
  opacity: 0;
  transition: opacity .333s ease-in;
}

img.lazy-loaded {
  opacity: 1;
} 
```

## Contributing

1. Fork it
2. Create your feature branch (`git checkout -b my-new-feature`)
3. Commit your changes (`git commit -am 'Add some feature'`)
4. Push to the branch (`git push origin my-new-feature`)
5. Create new Pull Request

## Issues

If you find any bugs please use the [Github issue tracker](https://github.com/sourcey/recliner/issues).

