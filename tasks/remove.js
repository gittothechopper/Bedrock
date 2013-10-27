var fs = require('fs'),
	_ = require('underscore'),
	path =require('path');

module.exports = function (grunt) {

	grunt.registerTask('remove', function () {

		// Store all assets in dist folder
		var assets = grunt.file.expand({
						filter: 'isFile',
						cwd: 'dist'
					}, ['**/*.{js,jpg,png,mp4,pdf,css}' ]);

		// Store files that need scanning only css and html should contain links but js is there just in case
		var files = grunt.file.expand({
							 filter: 'isFile',
							 cwd: 'dist'
						 }, ['**/*.{js,css,html}']);

		// Now that is some serious regex! Go to http://imgur.com/38iVjJf for a visual.
		var regex = new RegExp('(?:href|src|url)[\=\(][\'"](?!(?:http|#|\s|"))(.+?(?=jpg|png|mp4|pdf|js)?)[\'"]', 'ig'),
			links = [],
			assetsBase = [];

		// Look for assets links in files
		files.forEach( function(file, i) {
			var fileSrc = grunt.file.read('dist/' + file);
			while ((matchesLink = regex.exec(fileSrc)) !== null) {
				// Account for links with some form of ../
				links.push(path.join(path.dirname(file), path.normalize(matchesLink[1])));
			}
		});

		// Remove dupes
		var linksUnique = _.unique(links);

		// Remove files that are being used from the array
		for (var i=0; i<linksUnique.length; i++) {
			index = assets.indexOf(linksUnique[i].replace(/\\/g, '/'));
			if (index > -1) {
				assets.splice(index, 1);
			}
		}

		// Delete unused files
		assets.forEach( function(file) {
			console.log('Removing: ', file)
			grunt.file.delete('dist/' + file);
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
