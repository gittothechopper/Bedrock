// **Irepper** is a Grunt task that automates the conversion of a standard PM3
// site into an iRep ready collection of ZIP files. These files can then be
// uploaded to iRep either via the Salesforce control panel, or via FTP using
// the generated control files.

// ## Dependencies
// Before you run `npm install` you'll need to install [Ghostscript]
// (http://www.ghostscript.com/) and [ImageMagick](http://www.imagemagick.org/).
// These are used to open PDFs and create screenshots and thumbnails.

// ## Disclaimer
// The Grunt process has only been tested on a Mac. if you're on Windows, I'm
// sorry. Sorry you're on Windows.
//
// Whilst this tool is amazing, I'm not guaranteeing anything. You still need to
// check that the generated files work and look as expected.

// MODIFIED RW 20130924: added `name` to control file output

module.exports = function(grunt) {

	grunt.registerMultiTask('irepper', 'iRep build automation task', function() {

		var cfg = this.data,
			filesDone = new Array(),
			pdfsDone = new Array(),
			files = grunt.file.expand({ cwd: cfg.src+'/', filter: 'isFile'},'*.html'),
			path = require('path'),
			phantonjs_path = 'phantomjs',
			exec = require('child_process').exec,
			child,
			done = grunt.task.current.async(),
			Zip = require('node-zip'),
			fs = require('fs'),
			im = require('imagemagick'),
			progressBar = require('progress'),
			progressHTML,
			progressPDF,
			progressZIP,
			fileNameRegex = new RegExp('[^\\w\\d_-]', 'ig'),
			fileNameLengthMax = 116,
			filesRenamed = new Object(),
			filesCopy = new Array(),

		// ## The Functions
		// ** convertStructure ** starts by creating the iRep folder structure, using the options set in the `_config.yml` file.
		convertStructure = function() {
			grunt.log.write('Creating iRep directory structure... ');

			var info = new Array(),
				filesOnly = (grunt.option('files')) ? grunt.option('files').split(',') : false;

			files.forEach(function(file) {
				var fileSrc = grunt.file.read(cfg.src+'/'+file),
					fileName = file.replace('.html',''),
					destName = renameFile(fileName);
				// Check if files match array of specific files set via the `--files` flag or do
				// all if we're not bothered.
				if((filesOnly && filesOnly.indexOf(fileName)>=0) || !filesOnly) {
					// Create a new directory and copy the HTML file into it using the new name. Copy
					// in the iRep JavaScript library and then the global assets directories as defined
					// in the `_config.yml` file. Prepare file specific assets to be copied and then
					// convert links to the iRep format before finally creating an array of filenames
					// to screenshot.
					grunt.file.mkdir(cfg.dest+'/'+destName);
					grunt.file.copy(cfg.src+'/'+file, cfg.dest+'/'+destName+'/'+destName+'.html');
					cfg.global_assets.forEach(function(dir) {
						copyGlobalAssets(cfg.dest+'/'+destName, dir, '');
					});
					prepareSpecificAssets(cfg.dest+'/'+destName, fileSrc, fileName);
					convertLinks(destName, fileSrc);
					filesDone.push(destName);
				}
			});

			grunt.log.write('Done\n');

			// If any files have been renamed then alert the user, but carry on.
			for (file in filesRenamed) {
				var item = filesRenamed[file], str = '"'+item.fileName+'" ';

				if(item.invalidChars && item.tooLong) {
					str += '(invalid characters and excessive length)';
				} else if(item.invalidChars) {
					str += '(invalid characters)';
				} else if(item.tooLong) {
					str += '(excessive length)';
				}

				info.push(str)
			};

			if(info.length>0) {
				grunt.log.writeln(grunt.log.wordlist(['Info: The following files were renamed:\n\t'+info.join('\n\t')],{color: 'cyan'}));
			}

			copySpecificAssets();
		},


		// ** copyGlobalAssets ** uses the `global_assets` variable set in
		// `_config.yml`, to copy any file within those directories.
		copyGlobalAssets = function(destName, dir, filter) {
			var files = grunt.file.expand({ cwd: cfg.src+'/'+cfg.assets+'/'+dir+'/', filter: 'isFile'},'*'+filter);

			files.forEach(function(file) {
				grunt.file.copy(cfg.src+'/'+cfg.assets+'/'+dir+'/'+file, destName+'/'+cfg.assets+'/'+dir+'/'+file);
			});
		},

		// ** prepareSpecificAssets ** searches through the source code of each file and
		// any linked CSS files to find URLs of assets that need to be copied.
		prepareSpecificAssets = function(destName, fileSrc, fileName) {
			var regexCSS = new RegExp('url\\([\'"]?('+cfg.assets+'/.*?)[\'"]?\\)', 'ig'),
				regexCSSLink = new RegExp('url\\([\'"]?(.*?)[\'"]?\\)', 'ig'),
				regexBody = new RegExp('(?:href|src)=[\'"](.*?)[\'"]', 'ig'),
				matchesCSS = new Array(),
				matchesCSSLink = new Array(),
				matchesBody = new Array();

			while ((matchesCSS = regexCSS.exec(fileSrc)) !== null) {
				var match = { type: 'CSS', fileName: matchesCSS[1], dest: destName };
				filesCopy.push(match);
			}

			while ((matchesBody = regexBody.exec(fileSrc)) !== null) {
				if(matchesBody[1].match(/[^.]*?\.pdf/i)) {
					// Separate out PDFs into their own slides, unless the `--nopdfs` flag is used.
					if(!grunt.option('nopdfs')) {
						var pdfName = renameFile(path.basename(matchesBody[1],'.pdf'),'PDF'),
							match = { fileName: matchesBody[1], dest: cfg.dest+'/'+pdfName, pdfName: pdfName };
						filesCopy.push(match);
					}
				} else if(matchesBody[1].match(/[^.]*?\.css/i)) {
					// Check linked CSS files for assets, ignoring remote assets. Also ignore global
					// assets, which have already been copied.
					var fileSrcCSS = grunt.file.read(cfg.src+'/'+matchesBody[1]);

					while ((matchesCSSLink = regexCSSLink.exec(fileSrcCSS)) !== null) {
						var ignored = new Array('http:/', 'https:');

						if(ignored.indexOf(matchesCSSLink[1].substr(0,6))<0) {
							var realPath = path.join(path.dirname(matchesBody[1])+'/'+matchesCSSLink[1]),
							match = { type: 'CSS', fileName: realPath, dest: destName },
							global = false;

							cfg.global_assets.forEach(function(dir) {
								if(realPath.indexOf(cfg.assets+'/'+dir+'/')>=0) {
									global = true;
								}
							});

							if(!global) {
								filesCopy.push(match);
							}
						}
					}

					var match = { fileName: matchesBody[1], dest: destName };
					filesCopy.push(match);
				} else {
					var match = { fileName: matchesBody[1], dest: destName };
					filesCopy.push(match);
				}
			}
		},

		// ** copySpecificAssets ** loops through the array of files found in `prepareSpecificAssets`
		// and copies them across, ignoring PDFs if the `--nopdfs` flag is used.
		copySpecificAssets = function() {
			grunt.log.write('Copying assets... ');

			filesCopy.forEach(function(file) {
				if(file.pdfName!=undefined) {
					var dest = file.dest+'/'+file.pdfName+'.pdf';
					if(pdfsDone.indexOf(file.pdfName)<0) {
						pdfsDone.push(file.pdfName);
					}
				} else {
					var dest = file.dest+'/'+file.fileName;
				}
				grunt.file.copy(cfg.src+'/'+file.fileName, dest);
			});

			if(pdfsDone.length === 0 && !grunt.option('nopdfs')) {
				grunt.fail.fatal('Please use the --nopdfs flag' , 1);
			}

			grunt.log.write('Done\n');
		},

		// ** convertLinks ** finds URLs to any local HTML and PDF files and converts
		// them to the `veeva:gotoSlide(...)` format. The `data-jumpto` attribute is
		// used with localStorage to enable jumping to specific slides within a slide.
		// The code for this functionality is contained within the iRep JavaScript
		// library which is appended to the end of the HTML file.
		convertLinks = function(destName,file) {
			var regexLink = new RegExp('<a(.*?)href=[\'"]([a-z0-9_-]+?\.html)(#slide([0-9]+))?[\'"]', 'ig'),
				regexPDF = new RegExp('<a(.*?)href=[\'"]('+cfg.assets+'/.*?\.pdf)?[\'"]', 'ig'),
				result = file.replace(regexLink, function(match,a,b,c,d) {

					var fileName = path.basename(b,'.html'),
						zipName = renameFile(fileName),
						link = '<a'+a+'href="veeva:gotoSlide('+zipName+'.zip)"';

					if(c!=undefined) {
						link+=' data-jumpto="'+d+'"';
					}

					return link;
				}).replace(regexPDF, function(match,a,b) {
					var fileName = path.basename(b,'.pdf'),
						pdfName = renameFile(fileName, 'PDF');

					return '<a'+a+'href="veeva:gotoSlide('+pdfName+'.zip)"';
				}).replace(new RegExp('(<\/body>)','i'), function(match,a) {
					return '<script src="'+cfg.assets+'/js/irep.js"></script></body>';
				});
			grunt.file.write(cfg.dest+'/'+destName+'/'+destName+'.html', result);
		},

		// ** renameFile ** removes invalid characters and truncates file names so
		// as to comply with iRep's naming convention. It aslo prefixes and suffixes
		// the file name with the variables set in the `_config.yml` file.
		renameFile = function(fileName, filePrefix) {
			var prefix = cfg.prefix+cfg.separator,
				suffix = cfg.separator+cfg.suffix,
				maxLength = fileNameLengthMax-prefix.length-suffix.length,
				ext = (filePrefix=='PDF') ? 'pdf' : 'html';

			filePrefix = (filePrefix==undefined) ? '' : filePrefix+cfg.separator;

			var fileNameNew = filePrefix+fileName;

			if(fileNameNew.match(fileNameRegex)) {
				fileNameNew = fileNameNew.replace(fileNameRegex,'');
				if(filesRenamed[fileNameNew]==undefined) {
					filesRenamed[fileNameNew] = { fileName: fileName+'.'+ext, invalidChars: true, tooLong: false};
				} else {
					filesRenamed[fileNameNew].invalidChars = true;
				}
			}

			if(fileNameNew.length>maxLength) {
				fileNameNew = fileNameNew.substring(0,maxLength);
				if(filesRenamed[fileNameNew]==undefined) {
					filesRenamed[fileNameNew] = { fileName: fileName+'.'+ext, invalidChars: false, tooLong: true};
				} else {
					filesRenamed[fileNameNew].tooLong = true;
				}
			}

			return prefix+fileNameNew+suffix;
		},

		// ** parseTitle ** creates a human-friendly title from the file name, which
		// is displayed in iRep and set via the control file.
		parseTitle = function(destName) {
			var title = destName.replace(cfg.prefix+cfg.separator, '').replace(cfg.separator+cfg.suffix,'').replace(/_/g,' ');
			title = title[0].toUpperCase()+title.slice(1);
			title = (title=='Index') ? 'Cover' : title;
			title = (title=='Pi') ? 'PI' : title;
			return title;
		},

		// ** createControlFiles ** creates the files that iRep uses to automatically
		// process files uploaded by FTP. iRep's default swipe navigation is disabled
		// using this file, and replaced with custom functionality set in the iRep
		// JavaScript library that was included previously.
		createControlFiles = function() {
			var filesZip = filesDone.concat(pdfsDone);

			grunt.log.write('Creating control files... ');

			var i = 0;

			filesZip.forEach(function(destName) {
				i +=1;
				content = 'USER='+cfg.login.username+'\n'+
						  'PASSWORD='+cfg.login.password+'\n'+
						  'FILENAME='+destName+'.zip'+'\n'+
						  'Name='+destName+'\n'+
						  'Description_vod__c='+parseTitle(destName)+'\n'+
						  'Product_vod__c='+cfg.product+'\n'+
						  'Display_Order_vod__c='+i+'\n'+
						  'CLM_ID_vod__c='+cfg.CLM_ID_vod__c+'\n'+
						  // that's the wrong Veeva object field-name for `PRODUCT` and `PRESENTATION`
						  // can't find the right ones yet
						  'Disable_Actions_vod__c=Swipe_vod';

				grunt.file.write(cfg.dest+'/ctlfile/'+destName+'.ctl', content , {encoding: 'utf8'});
			});

			grunt.log.write('Done\n');
		},

		// ** takeScreenshots ** is a wrapper function that first takes screenshots of
		// HTML files and then PDF files.
		takeScreenshots = function(callback) {
			takeScreenshotsHTML(function() {
				grunt.log.write('\n');
				takeScreenshotsPDF(callback);
			});
		},

		// ** takeScreenshotsHTML ** will loop through each HTML file and create a full-
		// size screenshot and a thumbnail. It does this by executing [PhantomJS](http://phantomjs.org/) as a
		// child process. It also uses PhantomJS to detect any JavaScript parsing errors
		// and warns the user if any are found.
		takeScreenshotsHTML = function(callback) {
			var count = 0,
				files = filesDone.slice(0),
				child,
				errors = new Array(),

				takeScreenshot = function(file) {
					im.resize({srcPath: cfg.dest+'/'+file+'/'+file+'-full.png', dstPath: cfg.dest+'/'+file+'/'+file+'-thumb.png', width: 200, height: 150, format: 'png'}, function(error, stdout) {
							if (error) {
								throw error;
							}
							if(files.length == 0) {
								callback();
							} else {
								takeScreenshot(files.shift());
							}
						});
				};

			progressHTML = new progressBar('Taking screenshots of HTML files [:bar] :percent ', { total: filesDone.length, complete: '=', incomplete: ' ', width: 20});
			progressHTML.tick(0);

			child = grunt.util.spawn({ cmd: phantonjs_path, args: ['screenshot.js', cfg.dest, filesDone.join(',')]}, function() {
				if(errors.length>0) {
					grunt.log.write(grunt.log.wordlist(['\nWarning: JavaScript errors were detected in the following files:\n\t'+errors.join('\n\t')],{color: 'yellow'}));
				}
				takeScreenshot(files.shift());
			});

			child.stdout.on('data',function(d) {
				if(d.toString().substr(0,2)=='OK') {
					progressHTML.tick();
				} else {
					errors.push(d.toString().replace(/^\s+|\s+$/g, ''));
				}
			});

			child.stderr.on('data',function(e) { throw e });

		},

		// ** takeScreenshotsPDF ** will loop through each PDF and create a full-size
		// screenshot and a thumbnail, unless the `--nopdfs` flag is used.
		takeScreenshotsPDF = function(callback) {
			if(grunt.option('nopdfs')) {
				callback();
				return;
			}

			var count = 0,
				files = pdfsDone.slice(0),

				initScreenshots = function() {
					if(files.length == 0) {
					grunt.log.write('\n');
						callback();
					} else {
						takeScreenshot(files.shift());
						progressPDF.tick();
					}
				},

				takeScreenshot = function(file) {
					im.convert([cfg.dest+'/'+file+'/'+file+'.pdf[0]', '-thumbnail', '1024x768', '-background', 'white', '-gravity', 'center', '-extent', '1024x768', cfg.dest+'/'+file+'/'+file+'-full.png'],
						function(error, stdout) {
							if(error) {
								throw error;
							}

							im.resize({srcPath: cfg.dest+'/'+file+'/'+file+'-full.png', dstPath: cfg.dest+'/'+file+'/'+file+'-thumb.png', width: 200, height: 150, format: 'png'},
								function(error, stdout) {
									if (error) {
										throw error;
									}
									initScreenshots();
								}
							);
						}
					);
				};

			progressPDF = new progressBar('Taking screenshots of PDF files [:bar] :percent ', { total: pdfsDone.length, complete: '=', incomplete: ' ', width: 20});
			progressPDF.tick(0);

			initScreenshots();
		},

		// ** compressPackages ** will loop through each directory that has been created
		// for iRep and compress it into a ZIP file with a corresponding name.
		compressPackages = function(callback) {
			var filesZip = filesDone.concat(pdfsDone);

			progressZIP = new progressBar('Compressing packages [:bar] :percent ', { total: filesZip.length, complete: '=', incomplete: ' ', width: 20});
			progressZIP.tick(0);

			filesZip.forEach(function(destName) {
				var files = grunt.file.expand({cwd: cfg.dest+'/'+destName+'/', filter: 'isFile'},'**/*'),
					zip = new Zip();

				files.forEach(function(file) {
					var input = fs.readFileSync(cfg.dest+'/'+destName+'/'+file, 'binary');
					zip.file(destName+'/'+file, input, {binary: true});
				});

				var output = zip.generate({base64: false});
				fs.writeFileSync(cfg.dest+'/'+destName+'.zip', output, 'binary');
				progressZIP.tick();
			});

			callback();
		},

		// ** cleanUp ** will remove the directories that have just been compressed,
		// leaving only the ZIP files and ctlfile directory.
		cleanUp = function() {
			var filesClean = filesDone.concat(pdfsDone);

			grunt.log.write('\nCleaning up... ');

			filesClean.forEach(function(destName) {
				if(grunt.file.exists(cfg.dest+'/'+destName)) {
					grunt.file.delete(cfg.dest+'/'+destName);
				}
			});

			grunt.log.write('Done\n');

			done();
		},

		// ** emptyDest ** will remove previous iRep build files, without removing the
		// `dest` directory, which can cause annoying loss of place in FTP clients.
		emptyDest = function(abspath) {
			if(path.dirname(abspath)=='ctlfile' && grunt.file.isDir(abspath)) {
				return;
			}
			grunt.file.delete(abspath);
		};

		// ## The Task
		// The task is initiated here, and completed by the functions above. We start by
		// removing any previously generated content, if it exists. We then let the user
		// know if the `--nopdfs` flag is being used, and finally begin the conversion.
		//
		// ## Options

		// **src**
		//The directory to look for HTML files, relative to the `_app` folder. Trailing
		// slash please.
		//
		// **dest**
		// The directory where assets are output, relative to the `_app` folder. No
		// trailing slashes please.
		//
		// **assets**
		// The directory where assets are stored, relative to `src`. No trailing slashes
		// please.
		//
		// **global_assets**
		// An array of directories where global assets are stored, relative to `src`. No
		// trailing slashes please.
		//
		// **prefix / suffix / separator**
		// Used to create the new name of the folders and files.
		//
		// **username / password**
		// iRep Salesforce login details, used in control file creation.
		//
		// ### Example
		//     irepper: {
		//         default: {
		//             dest: '_irep',
		//             assets: 'assets',
		//             global_assets: ['img/global', 'css', 'js', 'fonts'],
		//             prefix: 'INTELENCE',
		//             suffix: 'ICONNECT',
		//             separator: '_',
		//             login: {
		//                 username: 'cloader@veeva.partner.havas',
		//                 password: 'oHfB/+Iw8>|X#fA'
		//             }
		//         }
		//     }

		if(grunt.file.exists(cfg.dest)) {
			grunt.file.recurse(cfg.dest, emptyDest);
		}

		if(grunt.option('nopdfs')) {
			grunt.log.writeln(grunt.log.wordlist(['Info: PDFs are not being processed'],{color: 'cyan'}));
		}

		convertStructure();
		createControlFiles();
		takeScreenshots(function() {
			compressPackages(cleanUp);
		});
	});

};