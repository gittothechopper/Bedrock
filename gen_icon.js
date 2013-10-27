function nonret() {
	var page = require('webpage').create();

	// Open the target HTML file
	page.open('http://node.alexmeah.com:3005/gen/76', function(status) {
		page.clipRect = { top: 0, left: 0, width: 76, height: 76 };
		// Save as PNG
		page.render('app/icon.png');

		// Send output to be caught by progress bar
		console.log('OK');

		// If the lop has finished exit, otherwise clean memory
		page.close();
		retina();
	});
}

function retina() {
	var page = require('webpage').create();

	// Open the target HTML file
	page.open('http://node.alexmeah.com:3005/gen/152', function(status) {
		page.clipRect = { top: 0, left: 0, width: 152, height: 152 };
		// Save as PNG
		page.render('app/icon@2x.png');

		// Send output to be caught by progress bar
		console.log('OK');

		// Close phantom
		phantom.exit();
	});
}


nonret();
