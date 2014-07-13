module.exports = function(grunt) {
  require('load-grunt-tasks')(grunt);

  grunt.initConfig({
    express: {
      server: {
        options: {
          server: 'server.js',
          livereload: true
        }
      }
    },
    copy: {
      dev: {
        files: [
          {src: 'bower_components/angular/angular.js', dest:'public/javascript/libs/angular.js'},
        ]
      }
    },

    clean:{
      libs:  ['src/javascript/libs/**/*'],
      bower: ['bower_components'],
      target: ['dist/**']
    },
    html2js: {
      options: {
        base: 'src/javascript/app/',
        module: 'app-templates'
      },
      main: {
        src: ['src/javascript/app/**/views/**/*.html'],
        dest: 'src/javascript/app/templates.js'
      }
    },
    watch: {
      templates: {
        files:['src/javascript/app/**/views/**/*.html'],
        tasks: ['html2js']
      }
    }
  });

  grunt.registerTask('default', ['start']);
  grunt.registerTask('start', ['express', 'watch', 'express-keepalive']);
  grunt.registerTask('install', ['clean:libs', 'copy:dev', 'clean:bower', 'html2js']);

};