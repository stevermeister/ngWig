module.exports = function(grunt) {
  require('load-grunt-tasks')(grunt);

  var srcPath = './src',
      distPath = './dist';

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
          {src: 'bower_components/angular/angular.js', dest:'src/javascript/libs/angular.js'},
        ]
      }
    },
    ngmin:{
      build: {
        src: ['src/javascript/app/ng-wig/*.js',
              srcPath + '/javascript/app/templates.js',
              '!src/javascript/app/**/tests/*.js'],
        dest: distPath + '/ng-wig.js'
      }
    },
    uglify: {
      build: {
        files: {
           'dist/ng-wig.min.js': [ distPath +'/ng-wig.js']
        }
      }
    },
    clean:{
      libs:  ['src/javascript/libs/**/*'],
      bower: ['bower_components'],
      target: ['dist/**']
    },
    html2js: {
      options: {
        base: srcPath + '/javascript/app/',
        module: 'app-templates'
      },
      main: {
        src: [ srcPath + '/javascript/app/ng-wig/views/*.html'],
        dest: srcPath + '/javascript/app/templates.js'
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
  grunt.registerTask('build', ['html2js', 'ngmin', 'uglify']);

};