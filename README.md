#Assemble-Boilerplate

This is a clone of generator-havas without the yeoman over head. It assumes iRepper is required (as most projects are now irep).

###Features
---

- Handlebars Templating (https://github.com/danharper/Handlebars-Helpers)
- iOS specific auto-prefixing no more -webkit-
- Stylus
- Minification of all the things
- Removal of unused assets
- etc.

###Getting Started
---

###How to install

```
$ git clone https://github.com/AlexMeah/Bedrock.git
```

To install dependencies, run:

```
$ npm i
```

###The Tasks
---

####Server

```
$ grunt server
```

This will open chrome, and provide you with live reload

####Build

```
$ grunt build
```

Before this does anything it will warn you if you have dev enabled, it will then compile your project and minify it, before scanning through and removing all unused assets.

This output can be uploaded to http://havasite.havaslynx.com/ for early testing/proof-reading.

####Create

```
$ grunt create --name "Page name goes here"
```

Generates the following .hbs, .styl, an img folder. The name is used as the title of the page and converted to the following format PAGE_NAME_GOES_HERE for filenames and folders.

######Optional

Specify what you need if you only need one type of file.

```
$ grunt create --name "Page name goes here" --type js
```

***Supported types***

- js
- css
- img
- hbs

####iRep

```
$ grunt irep
```

It does a lot docs can be found here http://havasite.havaslynx.com/sites/iRepper-Docs/

###A few extras
---

####Scaffolder

This will generate all files and folders as well as some starter code from a csv file, instructions, starter csv and online version here http://node.alexmeah.com:3000

######Mac Users 

Use this it has less steps and is a lot quicker, plus it work offline

http://alexmeah.com/download/InstaRep.dmg

####Icon Generator

```
$ phantomjs gen_icon.js
```

Uses http://node.alexmeah.com:3005

####Dev Helpers

```
ctrl+click
```

Will prompt for a ref number then write the code needed to the console, click around fill them all in then just paste them all into your code :)

####Modules

All the modules in this boilerplate avoid jQuery wherever possible because it's slow at even simple things [http://jsperf.com/add-class-test](http://jsperf.com/add-class-test "http://jsperf.com/add-class-test") what about zepto [http://jsperf.com/add-class-test/2](http://jsperf.com/add-class-test/2 "http://jsperf.com/add-class-test/2")

######Modals

Yo Havas comes with a Modal module, the popups are infinitely stackable, and avoid jQuery where-ever doesn't cause me a headache to stay as performant as possible they run at well above/below depending how you look at it, 60fps in the dev tools timeline.

######Refs popups

Refs are pulled from an array and created on request, again avoiding jQuery. They rely on the modal module for the popup functionality.

## License

[MIT License](http://en.wikipedia.org/wiki/MIT_License)
