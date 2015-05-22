module.exports = function(grunt) {

    // Project configuration.
    grunt.initConfig({
        config: {
          src:          'src',
          dist:         'build',
          webkitbuilds: 'webkitbuilds/'
        },
        pkg: grunt.file.readJSON('package.json'),
    	
    	  nodewebkit: {
    	    options: {
    	        platforms: ['win', 'linux', 'osx'],
    	        buildDir: './webkitbuilds',
              version: '0.12.1' // Where the build version of my node-webkit app is saved
    	    },
    	    src: ['./build/**/*'] // Your node-webkit app
    	  },
        copy: {
          main: {
            expand: true,
            cwd: '<%= config.src %>/',
            src: ['**/*'],
            dest: '<%= config.dist %>/'
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
            ]
        },
        webkitbuilds: {
            files: [
              {
                expand: true,
                cwd: 'webkitbuilds/',
                src: '**/*',
              },
            ],
          }
        },
        watch: {
          data: {
            files: [
              'node_modules/',
              '<%= config.src %>/**/*',
              '<%= config.src %>/js/**/*.js'            
            ],
            tasks: ['build', 'release', 'default', 'watch']
          }
        }
    });

    require('load-grunt-tasks')(grunt);
  
    grunt.registerTask('build', ['clean', 'copy']);
    grunt.registerTask('release', ['build', 'nodewebkit']);
    grunt.registerTask('default', ['release', 'watch']);
};