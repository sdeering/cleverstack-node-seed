/*
 * CleverStack.io
 * https://github.com/clevertech/cleverstack-node-seed/
 *
 * Copyright (c) 2013 CleverTech.biz
 * Licensed under the MIT license.
 */

'use strict';

module.exports = function (grunt) {

  // Grunt helpers
  require('time-grunt')(grunt);
  require('autostrip-json-comments');

  // Load grunt tasks automatically
  require('load-grunt-tasks')(grunt);

  // Settings
  var appSettings = require('./config/local.conf.json');

  // grunt.config.init({
  grunt.initConfig({

    // Set the application settings
    settings: appSettings,

    // Server config
    connect: {
      options: {
        hostname: '<%= settings.web.hostname %>',
        port: '<%= settings.web.port %>'
      }
    },

    // jsHint config
    jshint: {
      options: {
        jshintrc: __dirname + '/.jshintrc',
        reporter: require('jshint-stylish'),
        force: true
      },
      all: [
        // 'Gruntfile.js',
        '<%= settings.web.dir %>/**/*.js'
      ],
      test: {
        options: {
          jshintrc: __dirname + '/.jshintrc'
        },
        src: ['<%= settings.test.dir %>/**/*.js']
      }
    },

    // Documentation config.
    docular: {
        docular_webapp_target: '<%= settings.docs.dir %>',
        showDocularDocs: '<%= settings.docs.showDocularDocs %>',
        showAngularDocs: false,
        groups: [{
            groupTitle: 'CleverStack Node',
            groupId: 'cleverstack',
            groupIcon: 'icon-book',
            sections: [
                {
                    id: 'api',
                    title: 'API',
                    showSource: true,
                    docs: [
                        'api.doc'
                    ],
                    scripts: [
                      'src',
                      'routes.js'
                    ]
                }
            ]
        }]
    },
    'docular-server': {
        port: '<%= settings.docs.port %>'
    },

    // Clean config
    clean: {
      docs: '<%= settings.docs.dir %>'
    },

    // Open config
    open: {
      docs: {
        path: 'http://<%= settings.web.hostname %>:<%= settings.docs.port %>'
      }
    },

    // Node monitor config
    nodemon: {
      web: {
        options: {
          file: 'app.js',
          ignoredFiles: ['README.md', 'node_modules/**', 'docs'],
          watchedExtensions: ['js'],
          watchedFolders: ['<%= settings.web.dir %>'],
          delayTime: 1,
          cwd: __dirname
        }
      }
    },

    // Concurrent servers config
    concurrent: {
      servers: {
        tasks: [
          'server:web',
          // 'server:docs'
        ],
        options: {
            logConcurrentOutput: true
        }
      }
    },

    // Shell execute commands
    exec: {
      rebase: {
        cmd: 'node src/utils/bin/rebase.js'
      },
      seed: {
        cmd: 'node src/utils/bin/seedModels.js'
      }
    }

  });


  /* -- SERVER TASKS ----------------------------------------------- */

  grunt.registerTask('server', 'Start up all servers.', [
    'concurrent:servers'
  ]);

  grunt.registerTask('server:web', 'Start up the node express server live restart server.', [
    'nodemon:web'
  ]);

  grunt.registerTask('server:docs', 'Start up the api documentation server.', [
    'docular-server'
  ]);



  /* -- TEST TASKS ------------------------------------------------ */



  /* -- DOCS TASKS ----------------------------------------------- */

  grunt.registerTask('docs:build', 'Build the api documentation.', [
    'clean:docs',
    'docular'
  ]);
  grunt.registerTask('docs', 'Build the docs and start the docs server.', [
    'docs:build',
    'server:docs'
  ]);


  /* -- DATABASE TASKS ------------------------------------------- */

  grunt.registerTask('db', 'Rebase and seed the database.', [
    'db:rebase',
    'db:seed'
  ]);

  grunt.registerTask('db:rebase', 'Remove all tables and data from database.', [
    'exec:rebase'
  ]);

  grunt.registerTask('db:seed', 'Populate tables and data based on models and schema seed data.', [
    'exec:seed'
  ]);


  /* -- INSTALL TASKS -------------------------------------------- */

  grunt.registerTask('install', 'Install stuff that is required for development servers.', [
    'clean',
    'shell:npm_install',
    'db',
    'docs:build'
  ]);


  /* -- DEFAULT TASK --------------------------------------------- */

  grunt.registerTask('default', 'Run all servers.', [
    'server'
  ]);

};
