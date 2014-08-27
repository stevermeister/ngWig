module.exports = function(grunt) {
  require('load-grunt-tasks')(grunt);

  grunt.initConfig({
    copy: {
      demo: {
        files: [
          { expand: true, cwd: 'bower_components/ng-wig/dist/', src: '**', dest: 'demo/'}
        ]
      }
    },
    rename: {
      index: { src: 'demo/demo.html', dest: 'demo/index.html' }
    },
    clean: {
      demo: 'demo',
      bower: 'bower_components'
    }
  });

  grunt.registerTask('default', ['demo']);
  grunt.registerTask('demo', ['clean:demo', 'copy:demo', 'rename:index', 'clean:bower']);

};