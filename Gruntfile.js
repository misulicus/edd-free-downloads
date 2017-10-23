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
                    'assets/css/style.min.css' : 'assets/css/style.css',
                    'assets/css/admin.min.css' : 'assets/css/admin.css'
                }
            ]
        },
    },

    jshint: {
        beforeconcat: ['assets/js/*.js']
    },

    uglify: {
        build: {
            files: {
                'assets/js/edd-free-downloads.min.js': 'assets/js/edd-free-downloads.js',
                'assets/js/admin.min.js': 'assets/js/admin.js',
                'assets/js/isMobile.min.js': 'assets/js/isMobile.js'
            }
        }
    },
});

// Default task is to rebuild
grunt.registerTask('default', ['cssmin', 'uglify']);

};
