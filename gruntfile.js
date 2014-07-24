module.exports = function(grunt) {
  require('load-grunt-tasks')(grunt);

  var srcPath = './src',
      distPath = './dist';

  grunt.initConfig({

    srcPath: srcPath,

    distPath: distPath,

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
    ngAnnotate: {
      app1: {
        files: {
          '<%= distPath %>/ng-wig.js': ['src/javascript/app/ng-wig/*.js',
              srcPath + '/javascript/app/templates.js',
            '!src/javascript/app/**/tests/*.js']
        }
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
      target: ['dist/**'],
      icons: ['svg-icons-out/**/*'],
    },
    compass: {
      dev: {
        options: {
          sassDir: 'src/scss',
          cssDir: 'src/css'
        }
      },
      dist: {
        options: {
          sassDir: 'src/scss',
          cssDir: 'dist/css'
        }
      }
    },
    html2js: {
      options: {
        base: srcPath + '/javascript/app/',
        module: 'ngwig-app-templates'
      },
      main: {
        src: [ srcPath + '/javascript/app/ng-wig/views/*.html'],
        dest: srcPath + '/javascript/app/templates.js'
      }
    },
    grunticon: {
      icons: {
        files: [
          {
            expand: true,
            cwd: 'svg-icons-src',
            src: ['*.svg'],
            dest: 'svg-icons-out'
          }
        ],
        options: {}
      }
    },
    watch: {
      templates: {
        files:['src/javascript/app/**/views/**/*.html'],
        tasks: ['html2js']
      },
      css: {
        files: ['src/scss/**/*.scss'],
        tasks: ['compass']
      }
    }
  });

  grunt.registerTask('default', ['start']);
  grunt.registerTask('start', ['compass', 'html2js', 'watch', 'express', 'express-keepalive']);
  grunt.registerTask('install', ['clean:libs', 'copy:dev', 'clean:bower', 'compass', 'html2js']);
  grunt.registerTask('build', ['html2js', 'ngAnnotate', 'uglify']);
  grunt.registerTask('icons', ['clean:icons', 'grunticon']);
};