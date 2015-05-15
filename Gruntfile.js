module.exports = function(grunt) {

  // Project configuration.
  grunt.initConfig({
    config: {
      src:          './src',
      dist:         './build',
      webkitbuilds: './webkitbuilds'
    },
    pkg: grunt.file.readJSON('package.json'),
	
	  nodewebkit: {
	    options: {
	        platforms: ['win', 'linux', 'osx'],
	        buildDir: '<%= config.webkitbuilds %>', // Where the build version of my node-webkit app is saved
	    },
	    src: ['<%= config.build %>/**/*'] // Your node-webkit app
	  },
    copy: {
      main: {
        expand: true,
        cwd: '<%= config.src %>/',
        src: ['package.json', 'main.html'],
        dest: '<%= config.dist %>/'
      },
      style: {
        expand: true,
        cwd: '<%= config.src %>/less/',
        src: ['*.less'],
        dest: '<%= config.dist %>/less/'
      },
      less: {
        expand: true,
        cwd: '<%= config.src %>/bower_components/less/dist/',
        src: ['less.min.js'],
        dest: '<%= config.dist %>/bower_components/less/dist/'
      },
      zepto: {
        expand: true,
        cwd: '<%= config.src %>/bower_components/zepto/',
        src: ['zepto.min.js'],
        dest: '<%= config.dist %>/bower_components/zepto/'
      },
      ace: {
        expand: true,
        cwd: '<%= config.src %>/js/ace-builds/src-min-noconflict/',
        src: ['**/*.js'],
        dest: '<%= config.dist %>/js/ace-builds/src-min-noconflict/'
      },
      js: {
        expand: true,
        cwd: '<%= config.src %>/js/',
        src: ['*.js'],
        dest: '<%= config.dist %>/js/'
      },
      node_modules: {
        expand: true,
        cwd: 'node_modules/',
        src: ['node-watch/**/*'],
        dest: '<%= config.dist %>/node_modules/'
      }
    },
    clean: {
      build: {
        files: [
          {
            expand: true,
            cwd: 'build/',
            src: '**/*',
          },
        ],
      }
    },
    watch: {
      data: {
        files: [
          'node_modules/',
          '<%= config.src %>/**/*'
            
        ],
        tasks: ['copy']
      }
    }
  });

  require('load-grunt-tasks')(grunt);
  
  grunt.registerTask('build', ['clean', 'copy']);
  grunt.registerTask('release', ['build', 'nodewebkit']);
  grunt.registerTask('default', ['release', 'watch']);

};