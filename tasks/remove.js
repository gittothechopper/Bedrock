var fs = require('fs');

module.exports = function (grunt) {

	grunt.registerTask('remove_unused', function () {

		// Store all files in dist folder
		var files = grunt.file.expand({
						filter: 'isFile',
						cwd: 'dist'
					}, ['**/*.{js,jpg,png,mp4,pdf,css}' ]);

		// Store files that need scanning only css and html should contain links but js is there just in case
		var filesToScan = grunt.file.expand({
							 filter: 'isFile',
							 cwd: 'dist'
						 }, ['**/*.{js,css,html}' ]);

		// Now that is some serious regex! Go to http://imgur.com/38iVjJf for a visual.
		var regex = new RegExp('(?:href|src|url)[\=\(][\'"](?!(?:http|#|\s|"))(.+?(?=jpg|png|mp4|pdf|js)?)[\'"]', 'ig'),
			orginal = files.length,
			found = 0;

		var links = [];

		// Look for links to files
		filesToScan.forEach( function(path, i) {
			var fileSrc = grunt.file.read('dist/' + path);
			while ((matchesLink = regex.exec(fileSrc)) !== null) {
				links.push(matchesLink[1]);
			}
		});

		// Remove files that are being used from the array
		links.forEach( function(path, i) {
			if(files.indexOf(path) > -1) {
				files.splice(files.indexOf(path), 1);
			}
		});

		// Move unused files to unused folder
		files.forEach( function(path) {
			grunt.file.delete('dist/' + path);
		});
	});
}

/*
Test links

<link rel="stylesheet" href="assets/styles/main.css">
<!-- build:js(app) assets/scripts/main.js -->
<script src="assets/bower_components/jquery/jquery.js"></script>
<script src="assets/scripts/jquery.touch.js"></script>
<script src="assets/scripts/fastclick.js"></script>
<script src="assets/scripts/polyfills.js"></script>
<script src="assets/scripts/refs.js"></script>
<script src="assets/scripts/modal.js"></script>
<script src="assets/scripts/main.js"></script>
background: url('sdfc.png');
<!-- endbuild -->

{{!-- Page Specific JS if needed --}}
{{#if jsname}}<script src="assets/scripts/pages/{{jsname}}.js"></script>{{/if}}

{{#if_eq config.dev compare='true'}}<script src="assets/scripts/dev.js"></script>{{/if_eq}}

<h5>Image for imagemin test</h5>

<img src="assets/img/cat.jpg" alt="cat" width="640" height="480">

<h5>Test if new regex picks up stray assets</h5>

<img src="cat2_the_things_ive_seen.jpg" alt="cat" width="640" height="480">

*/