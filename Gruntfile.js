module.exports = function(grunt) {

// Load all grunt-* tasks (load-grunt-tasks plugin)
require('load-grunt-tasks')(grunt);

require('time-grunt')(grunt);

// Project configuration
grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),

    cssmin: {
        // combine: {
        //     files: {
        //         'assets/css/style.css': 'assets/css/style.css.min'
        //     }
        // }
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

// Tasks for development
// grunt.registerTask('build', ['sass', 'cssmin', 'concat', 'uglify']);
};
