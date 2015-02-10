module.exports = function (grunt) {
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        uglify: {
            js: {
                files: {
                    'recliner.min.js': ['recliner.js']
                }
            }
        },
        watch: {
          files: ['recliner.js'],
          tasks: ['uglify']
       }
    });
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.registerTask('default', ['uglify:js']);
};
