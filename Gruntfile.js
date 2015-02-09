module.exports = function (grunt) {
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        uglify: {
            js: {
                files: {
                    'jquery.recliner.min.js': ['jquery.recliner.js']
                }
            }
        },
        watch: {
          files: ['jquery.recliner.js'],
          tasks: ['uglify']
       }
    });
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.registerTask('default', ['uglify:js']);
};
