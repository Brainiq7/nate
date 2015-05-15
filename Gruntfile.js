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
	    src: ['<%= config.src %>/**/*'] // Your node-webkit app
	  },
    copy: {
      data: {
        expand: true,
        cwd: '<%= config.src %>/',
        src: ['package.json'],
        dest: '<%= config.dist %>/'
      }
    },
    watch: {
      data: {
        files: ['<%= config.src %>*.json'],
        tasks: ['copy']
      }
    }
  });

  require('load-grunt-tasks')(grunt);

  grunt.registerTask('build', ['nodewebkit']);
  grunt.registerTask('default', ['build', 'watch']);

};