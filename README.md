##Assemble-Boilerplate

This is a clone of generator-havas without the yeoman over head. It assume iRepper is required (as most projects are now irep). 

This doesn't effect the build in anyway and all tasks will work if you don't want to use iRepper.

## Getting Started

### How to install

```
$ git clone https://github.com/AlexMeah/Assemble-Boilerplate.git
```

To install dependencies, run:

```
$ npm i & bower i
```

### A few extras

######Page/Slide creation

Yo Havas will also build and scaffold all the elements necessary for a new page, just run

```
$ grunt create --name "Page Name Goes Here"
```

The string will be used as the title of the page, and will be converted to upper-case with spaces converted to underscores for file and folder names.

The command creates a .hbs file, a sass file and a img folder. If you need a js file create that manually as not every page needs one.

A separate css file is required to stop iRepper pulling in all assets, so don't move this to inside the build block

####Modules

All the modules in this boilerplate avoid jQuery wherever possible because it's slow at even simple things [http://jsperf.com/add-class-test](http://jsperf.com/add-class-test "http://jsperf.com/add-class-test")

######Modals

Yo Havas comes with a Modal module, the popups are infinitely stackable, and avoid jQuery where-ever doesn't cause me a headache to stay as performant as possible they run at well above/below depending how you look at it, 60fps in the dev tools timeline. 

######Refs popups

Refs are pulled from an array and created on request, again avoiding jQuery. They rely on the modal module for the popup functionality. 

## License

[MIT License](http://en.wikipedia.org/wiki/MIT_License)
