module.exports = function(grunt) {

// Props to https://github.com/3themes/spring-theme for basic Gruntfile set up

// Load all grunt-* tasks (load-grunt-tasks plugin)
require('load-grunt-tasks')(grunt);

require('time-grunt')(grunt);

// Project configuration
grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),

    cssmin: {
        minify: {
            files: [
                {
                    src: 'assets/css/style.css',
                    dest: 'assets/css/style.min.css'
                }
            ]
        },
    },

    jshint: {
        beforeconcat: ['assets/js/*.js']
    },

    uglify: {
        build: {
            src: 'assets/js/edd-free-downloads.js',
            dest: 'assets/js/edd-free-downloads.min.js'
        }
    },
});

// Default task is to rebuild
grunt.registerTask('default', ['cssmin', 'uglify']);

};
