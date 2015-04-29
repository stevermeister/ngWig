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
          port: Number(process.env.PORT || 3000),
          livereload: true
        }
      }
    },
    copy: {
      dev: {
        files: [
          {src: 'bower_components/angular/angular.js', dest:'src/javascript/libs/angular.js'},
        ]
      },
      dist: {
        files: [
          {src: srcPath + '/css/ng-wig.css', dest: distPath + '/css/ng-wig.css'},
        ]
      }
    },
    ngAnnotate: {
      app1: {
        files: {
          '<%= distPath %>/ng-wig.js': [
              srcPath + '/javascript/app/ng-wig/!(angular.element.outerHeight).js',
              srcPath + '/javascript/app/ng-wig/angular.element.outerHeight.js',
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
      }
    },
    bump: {
      options: {
        files: ['package.json', 'bower.json', 'dist/ng-wig.js'],
        //commitFiles: ['package.json', 'bower.json'],
        //createTag: true,
        //tagName: 'v%VERSION%',
        tagMessage: 'Version %VERSION%',
        push: false
      }
    }
  });

  grunt.registerTask('default', ['start']);
  grunt.registerTask('start', ['html2js', 'express', 'watch', 'express-keepalive',]);
  grunt.registerTask('install', ['clean:libs', 'copy:dev', 'clean:bower', 'html2js']);
  grunt.registerTask('build', ['html2js', 'copy:dist', 'ngAnnotate', 'uglify', 'bump:patch']);
  grunt.registerTask('upversion', ['bump:minor']);
  //grunt.registerTask('upversion', ['bump:major']);
  grunt.registerTask('icons', ['clean:icons', 'grunticon']);
};
