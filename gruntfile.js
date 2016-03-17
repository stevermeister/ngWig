module.exports = function(grunt) {
  require('load-grunt-tasks')(grunt);

  var srcPath = './src',
      distPath = './dist';

  grunt.initConfig({

    srcPath: srcPath,

    distPath: distPath,

    copy: {
      dev: {
        files: [
          {src: 'bower_components/angular/angular.js', dest:'src/libs/angular/angular.js'}
        ]
      },
      dist: {
        files: [
          {src: srcPath + '/css/ng-wig.css', dest: distPath + '/css/ng-wig.css'},
          {expand: true, cwd: srcPath + '/javascript/app/', src: ['plugins/*.js'], dest: distPath}
        ]
      }
    },
    ngAnnotate: {
      app1: {
        files: {
          '<%= distPath %>/ng-wig.js': [
              srcPath + '/javascript/app/ng-wig/ng-wig.js',
              srcPath + '/javascript/app/ng-wig/*.js',
              srcPath + '/javascript/app/plugins/formats.ngWig.js',
              srcPath + '/javascript/app/templates.js']
        }
      }
    },
    babel: {
      options: {
        sourceMap: true,
        presets: ['es2015']
      },
      dist: {
        files: {
          'dist/ng-wig.js': [ distPath +'/ng-wig.js']
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
    cssmin: {
      build: {
        files: {
          'dist/css/ng-wig.min.css': [ distPath +'/css/ng-wig.css']
        }
      }
    },
    clean:{
      libs:  ['src/libs/**/*'],
      bower: ['bower_components'],
      target: ['dist/**']
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
    watch: {
      templates: {
        files:['src/javascript/app/**/views/**/*.html'],
        tasks: ['html2js']
      }
    },
    bump: {
      options: {
        files: ['package.json', 'bower.json', 'dist/ng-wig.js', 'src/javascript/app/ng-wig/ng-wig.js'],
        commitFiles: ['package.json', 'bower.json', 'dist/**', 'src/javascript/app/ng-wig/ng-wig.js'],
        createTag: true,
        tagName: 'v%VERSION%',
        tagMessage: 'Version %VERSION%',
        push: false
      }
    }
  });

  grunt.registerTask('default', ['start']);
  grunt.registerTask('start', ['html2js', 'watch']);
  grunt.registerTask('install', ['clean:libs', 'copy:dev', 'clean:bower', 'html2js']);
  grunt.registerTask('build', ['html2js', 'copy:dist', 'ngAnnotate', 'babel', 'uglify', 'cssmin', 'bump:patch']);
  grunt.registerTask('upversion', ['bump:minor']);
  //grunt.registerTask('upversion', ['bump:major']);
};
