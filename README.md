# generator-havas [![Build Status](https://secure.travis-ci.org/AlexMeah/generator-havas.png?branch=master)](https://travis-ci.org/AlexMeah/generator-havas)

A generator for [Yeoman](http://yeoman.io).


## Getting Started

### How to install

Make sure you have yo installed.

```
$ npm install -g yo
```

To install generator-havas from npm, run:

```
$ npm install -g generator-havas
```

Finally, initiate the generator:

```
$ yo havas
```

### A few extras

######Page/Slide creation

Yo Havas will also build and scaffold all the elements necessary for a new page, just run

```
$ yo havas:page "Page Name Goes Here"
```

The string will be used as the title of the page, and will also be converted to uppercase and spaces converted to underscores for file and folder names.

The command creates a .hbs file, a sass file and a img folder.

A separate css file is required to stop irepper pulling in all assets, so don't move this to inside the build block

####Modules

All the modules in this boilerplate avoid jQuery wherever possible because it's slow at even simple things [http://jsperf.com/add-class-test](http://jsperf.com/add-class-test "http://jsperf.com/add-class-test")

######Modals

Yo Havas comes with a Modal module, the popups are infinitely stackable, and avoid jQuery where-ever doesn't cause me a headache to stay as performant as possible they run at well above/below depending how you look at it, 60fps in the dev tools timeline. 

######Refs popups

Refs are pulled from an array and created on request, again avoiding jQuery. They rely on the modal module for the popup functionality. 

## License

[MIT License](http://en.wikipedia.org/wiki/MIT_License)
