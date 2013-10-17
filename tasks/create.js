module.exports = function (grunt) {

    /*
        Create template pages and their associated assets
        Run from the command line as follows: grunt create --name=$var
    */

    var name = grunt.option('name') || null;

    grunt.registerTask('create', function () {

        var title = name,
            filename = name.toUpperCase().split(' ').join('_'),
            pagesDirectory = 'app/templates/pages/',
            cssDirectory = 'app/assets/styles/pages/',
            imagesDirectory = 'app/assets/img/',
            javascriptDirectory = 'app/assets/scripts/',
            modulePattern = 'var ' + name + ' = (function () {\n\tfunction init () {\n\t}\n\treturn {\n\t\tinit: init\n\t}\n}());\n\n$(function () {\n\t' + name + '.init();\n});',
            templateContent = '---\ntitle: ' + title + '\ncssname: ' + filename + '\njsname: ' + filename + '\n---';

        // Cursory check that the file doesn't exist
        if (grunt.file.exists(pagesDirectory + filename + '.hbs')) {
            grunt.fail.warn('Sorry, that page already exists', 1);
        }

        // Make img directory
        grunt.file.mkdir(imagesDirectory + filename);

        // create css
        grunt.file.write(cssDirectory + filename + '.scss', '#' + filename + ' {\n\n}');

        // create js module
        grunt.file.write(javascriptDirectory + filename + '.js', modulePattern);

        // create page template
        grunt.file.write(pagesDirectory + filename + '.hbs', templateContent);

    });
};