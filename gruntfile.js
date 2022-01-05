module.exports = function(grunt) {
  require('load-grunt-tasks')(grunt);

  var srcPath = './src',
      distPath = './dist';

  grunt.initConfig({

    srcPath: srcPath,

    distPath: distPath,

    copy: {
      dist: {
        files: [
          {src: srcPath + '/css/ng-wig.css', dest: distPath + '/css/ng-wig.css'},
          {expand: true, cwd: srcPath + '/javascript/app/', src: [
            'plugins/clear-styles.ngWig.js',
            'plugins/forecolor.ngWig.js',
            'plugins/formats.ngWig.js'
          ], dest: distPath}
        ]
      }
    },
    ngAnnotate: {
      app1: {
        files: {
          '<%= distPath %>/ng-wig.js': [
              srcPath + '/javascript/app/ng-wig/ng-wig.js',
              srcPath + '/javascript/app/ng-wig/ng-wig.component.js',
              srcPath + '/javascript/app/ng-wig/ng-wig-toolbar.provider.js',
              srcPath + '/javascript/app/ng-wig/ng-wig-plugin-adapter.component.js',
              srcPath + '/javascript/app/templates.js'
            ]
        }
      },
      plugins: {
        files: [{
           expand: true,
           cwd: srcPath + '/javascript/app/plugins/',
           src: [
             'clear-styles.ngWig.js',
             'forecolor.ngWig.js',
             'formats.ngWig.js'
           ],
           dest: distPath + '/plugins'
        }]
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
      },
      plugins: {
        files: [{
           expand: true,
           cwd: distPath + '/plugins/',
           src: ['*.js'],
           dest: distPath + '/plugins'
        }]
      }
    },
    uglify: {
      build: {
        files: {
           'dist/ng-wig.min.js': [ distPath +'/ng-wig.js']
        }
      },
      plugins: {
        files: [{
           expand: true,
           cwd: distPath + '/plugins/',
           src: [
             'clear-styles.ngWig.js',
             'forecolor.ngWig.js',
             'formats.ngWig.js'
           ],
           dest: distPath + '/plugins',
           ext: ['.ngWig.min.js']
        }]
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
        files: ['package.json', 'dist/ng-wig.js', 'src/javascript/app/ng-wig/ng-wig.js'],
        commitFiles: ['package.json', 'dist/**', 'src/javascript/app/ng-wig/ng-wig.js'],
        createTag: true,
        tagName: 'v%VERSION%',
        tagMessage: 'Version %VERSION%',
        push: false
      }
    },
    karma: {
      unit: {
        configFile: 'karma.conf.js',
        autoWatch: false,
        singleRun: true
      },
      continuous: {
        configFile: 'karma.conf.js'
      }
    }
  });

  grunt.registerTask('default', ['start']);
  grunt.registerTask('start', ['html2js', 'watch']);
  grunt.registerTask('install', ['html2js']);
  grunt.registerTask('build', ['html2js', 'copy:dist', 'ngAnnotate', 'babel', 'uglify', 'cssmin', 'bump:patch']);
  grunt.registerTask('devBuild', ['html2js', 'copy:dist', 'ngAnnotate', 'babel', 'uglify', 'cssmin']);
  grunt.registerTask('upversion', ['bump:minor']);
  //grunt.registerTask('upversion', ['bump:major']);
};
