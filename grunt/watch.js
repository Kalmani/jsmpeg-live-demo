module.exports = function(grunt) {
  grunt.config('watch.css', {
      files: ['www/theme/*.css', '!www/theme/main.css'],
      tasks: ['cssmin']
  });

  grunt.config('watch.scripts', {
      files: ['www/*.js'],
      tasks: [
        'concat:scripts'
      ]
  });


  grunt.config('watch.templates', {
      files: ['www/*.xml', '!www/main.xml'],
      tasks: [
        'concat:templates'
      ]
  });
  
  grunt.loadNpmTasks('grunt-contrib-watch');
};

