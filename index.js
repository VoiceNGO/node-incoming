var path    = require( 'path' );
var modules = require( 'require-all' )( path.join( __dirname, 'lib', 'prototypes' ) );

function Incoming(){}

modules.forEach( function( module ){
  for( var proto in Object.keys( module ) ){
    Incoming.prototype[ proto ] = module[ proto ];
  }
} );

module.exports = Incoming;
