# The Mathemagician

My [JS1k 2017 entry](http://js1k.com/2017-magic/). A little Canvas and Web Audio piece

[View online](http://js1k.com/2017-magic/demo/2837)


## Supported Browsers

* Chrome
* Firefox

I haven't tested it outside of these two browsers, but it _should_ work in Edge and maybe Safari.


## Minimum Resolution

Due to the background's scrolling logic, you'll require a minimum viewport width of 1024 pixels. Unfortunately, I wasn't able to fix this without surpassing the 1024-byte limit.


## Build Script

I attempted to automate the build process, from initial minification with Closure Compiler to crushing with RegPack. However, I was unable to get this to work, plus I reached the stage at which it was easier to work with the minified code directly.

Nontheless, the recorded bundle sizes data should still serve as an accurate means of determining how the build sizes changed as my entry progressed. I will graph this as part of my post-mortem.
