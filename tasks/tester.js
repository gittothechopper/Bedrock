// **Tester** is a Grunt task that automates the testing for missing assets and 
// includes. It was designed to be used by the iRepper Grunt task, but can be 
// used as a standalone tool.

// ## Disclaimer
// The Grunt process has only been tested on a Mac. if you're on Windows, I'm 
// sorry. Sorry you're on Windows.
// 
// Whilst this tool is amazing, I'm not guaranteeing anything. You still need to
// check that the generated files work and look as expected.

module.exports = function(grunt) {

    grunt.registerMultiTask('tester', 'Site test automation task', function() {

        var cfg = this.data,
            assetsMissing = new Object(),
            includesMissing = new Object(),
            files = grunt.file.expand({ cwd: cfg.src+'/', filter: 'isFile'},'*.html'),
            path = require('path'),
            strIncludes = '',
            strAssets = '',
            strError = '',

        // ## The Function
        // **checkFile** searches through the source code of the HTML file and any
        // linked CSS files to find URLs of assets that need to be checked. If the asset
        // does not exist or an include error is detected the path of the asset and the 
        // originating file name are logged.
        checkFile = function(fileSrc, fileName) {
            var regexCSS = new RegExp('url\\([\'"]?('+cfg.assets+'/.*?)[\'"]?\\)', 'ig'),
                regexCSSLink = new RegExp('url\\([\'"]?(.*?)[\'"]?\\)', 'ig'),
                regexBody = new RegExp('[href|src]=[\'"]('+cfg.assets+'/.*?)[\'"]', 'ig'),
                regexIncludes = new RegExp('(Included file \'(.*?)\' not found in (.*?) directory)', 'ig'),
                matchesCSS = new Array(),
                matchesCSSLink = new Array(),
                matchesBody = new Array(),
                matchesIncludes = new Array();

            // Check assets from the CSS.
            while ((matchesCSS = regexCSS.exec(fileSrc)) !== null) {
                if(!grunt.file.exists(cfg.src+'/'+matchesCSS[1])) {
                    if(assetsMissing[fileName+'.html']==undefined) {
                        assetsMissing[fileName+'.html'] = new Array();
                    }
                    if(assetsMissing[fileName+'.html'].indexOf(matchesCSS[1])<0) {
                        assetsMissing[fileName+'.html'].push(matchesCSS[1]);
                    }
                }
            }

            // Check assets from the body.
            while ((matchesBody = regexBody.exec(fileSrc)) !== null) {
                if(!grunt.file.exists(cfg.src+'/'+matchesBody[1])) {
                    if(assetsMissing[fileName+'.html']==undefined) {
                        assetsMissing[fileName+'.html'] = new Array();
                    }
                    if(assetsMissing[fileName+'.html'].indexOf(matchesBody[1])<0) {
                        assetsMissing[fileName+'.html'].push(matchesBody[1]);
                    }
                }

                if(matchesBody[1].match(/[^.]*?\.css/i)) {
                    // Check linked CSS files for assets, ignoring remote assets.
                    var fileSrcCSS = grunt.file.read(cfg.src+'/'+matchesBody[1]);

                    while ((matchesCSSLink = regexCSSLink.exec(fileSrcCSS)) !== null) {
                        var ignored = new Array('http:/', 'https:');
                        
                        if(ignored.indexOf(matchesCSSLink[1].substr(0,6))<0) {
                            var realPath = path.join(path.dirname(matchesBody[1])+'/'+matchesCSSLink[1]);

                            if(!grunt.file.exists(cfg.src+'/'+realPath)) { 
                                if(assetsMissing[path.basename(matchesBody[1])]==undefined) {
                                    assetsMissing[path.basename(matchesBody[1])] = new Array();
                                }
                                if(assetsMissing[path.basename(matchesBody[1])].indexOf(matchesCSSLink[1])<0) {
                                    assetsMissing[path.basename(matchesBody[1])].push(matchesCSSLink[1]);
                                }
                            }
                        }
                    }
                }
            }

            // Check for missing includes.
            while ((matchesIncludes = regexIncludes.exec(fileSrc)) !== null) {
                if(includesMissing[fileName+'.html']==undefined) {
                    includesMissing[fileName+'.html'] = new Array();
                }
                if(assetsMissing[fileName+'.html'].indexOf(matchesIncludes[2])<0) {
                    includesMissing[fileName+'.html'].push(matchesIncludes[2]);
                }
            }

        };

        // ## The Task
        // The task is initiated here, and completed by the function above. We start by
        // looping through each HTML file and passing it through the `checkFile` 
        // function. If any missing assets or includes are detected then a grouped error
        // message is displayed to the user.
        //
        // ## Options
        // **src**  
        //The directory to look for HTML files, relative to the `_app` folder.
        // 
        // **assets**  
        // The directory where assets are stored, relative to `src`.
        // 
        // ### Example 
        //     tester: {
        //         default: {
        //             src: '../_site',
        //             assets: 'assets'
        //         }
        //     }
        grunt.log.write('Checking files... ');

        files.forEach(function(file) {
            var fileSrc = grunt.file.read(cfg.src+'/'+file), 
                fileName = file.replace('.html','');

            checkFile(fileSrc, fileName);
            
        });

        grunt.log.write('Done\n');

        for(var file in includesMissing) {
            strIncludes+=file+': \n\t'+includesMissing[file].join('\n\t')+'\n\n';
        }

        if(strIncludes!='') {
            strIncludes = 'Missing Jekyll includes detected:\n\n'+strIncludes;
        }

        for(var file in assetsMissing) {
            strAssets+=file+': \n\t'+assetsMissing[file].join('\n\t')+'\n\n';
        }

        if(strAssets!='') {
            strAssets = 'Missing assets detected:\n\n'+strAssets;
        }

        if(strAssets != '' || strIncludes != '') {
            grunt.fail.warn(strIncludes+strAssets);
        }

    });

};