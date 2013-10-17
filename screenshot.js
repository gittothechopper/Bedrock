var system = require('system'), dest = system.args[1], files = system.args[2].split(',');

function takeScreenshot(destName, index) {
	var page = require('webpage').create();

	page.onError = function(msg, trace) {
		console.log(destName+'.html');
	};

	// Open the target HTML file
	page.open(dest+'/'+destName+'/'+destName+'.html', function(status) {	
		// Only capture 1024x768 area 
		page.clipRect = { top: 0, left: 0, width: 1024, height: 768 };
		// Save as PNG
		page.render(dest+'/'+destName+'/'+destName+'-full.png');
		
		// Send output to be caught by progress bar
		console.log('OK');
		
		// If the lop has finished exit, otherwise clean memory
		if(files.length == 0) {
			phantom.exit();
		} else {
			page.close();
			takeScreenshot(files.shift());
		}
	});
}

takeScreenshot(files.shift());