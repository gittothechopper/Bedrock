module.exports = function (grunt) {

	/*
		Warn about dev before doing anything
	*/

	grunt.task.registerTask('dev_warn', 'Warns if dev flag is true', function() {
		var assembleConfig = grunt.file.readJSON('config.json');

		if (assembleConfig.dev === 'true') {
			grunt.fail.warn('I don\'t think you want dev turned on :)');
		}
	});
};