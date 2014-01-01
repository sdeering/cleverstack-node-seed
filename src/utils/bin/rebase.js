/*
    Rebase the database - delete current database and create a new one based on ORM schema.
*/

var srcDir = './../../'
  , fs = require('fs')
  , Injector = require('utils').injector
  , modelInjector = require('utils').modelInjector;

// Get the application config
var config = require( srcDir + '../config' );

// Setup ORM
var Sequelize = require('sequelize');
var sequelize = new Sequelize(
    config.db.database,
    config.db.username,
    config.db.password,
    config.db.options
);

GLOBAL.injector = Injector(  srcDir + 'services', srcDir + 'controllers' );
injector.instance( 'config', config );
injector.instance( 'db', sequelize );
injector.instance( 'sequelize', sequelize );

// Get our models
var models = require( 'models' )
injector.instance( 'models', models );

// Run our model injection service
modelInjector( models );

// Force a sync
console.log('Forcing Database to be created! (Note: All your data will disapear!)');

sequelize
    .sync({force: true})
    .success(function () {
        fs.readFile( srcDir + '../schema/' + config.db.options.dialect + '.sql', function(err, sql) {
            if ( err || !sql ) {
                console.log('Database is rebased');
            } else {
                console.log('Running dialect specific SQL');
                sequelize.query(sql.toString()).success(function() {
                    console.log('Database is rebased');
                }).error(function(err) {
                        console.error(err);
                    });
            }
        });
    })
    .error(function( err ) {
        console.error('Error trying to connect to ' + config.db.options.dialect, err);
    });
