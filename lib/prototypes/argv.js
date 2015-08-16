function isValidOpt( names, rest ){
  return function( opt, index ){
    if( typeof opt === 'undefined' ) {
      throw new Error( 'Unknown option: ' + names[index] );
    }
  };
}

module.exports.processArgs = function(){
  process.nextTick( function(){
    var numNodeArgs = /^(node|iojs)$/.test( process.argv[0] ) ? 2 : 1; // TODO: better way?
    var argv        = process.argv.slice( numNodeArgs );
    var config      = { _ : [] };
    var argRx       = /^-(-)?(\w+)(?:=(.*))?$/;

    function argIsValue( index ){
      return !argRx.test( argv[index] );
    }

    function createReturnArray( opt ){
      var ary = config[ opt.shortName || opt.longName ];

      if( !ary ){
        ary = [];
        ary.valueOf = function(){ return this[0]; };

        if( opt.shortName ){ config[ opt.shortName ] = ary; }
        if( opt.longName  ){ config[ opt.longName  ] = ary; }
      }

      return ary;
    }

    for( var i=0, l=argv.length; i<l; i++ ){
      var parsedArg = argRx.exec( argv[i] );

      if( parsedArg ){
        var long      = parsedArg[1];
        var name      = parsedArg[2];
        var value     = parsedArg[3];

      }else{
        config._.push( argv[i] );
        continue;
      }

      // split -xyz into x, y, z
      var names    = ( long ? [ name ] : name.split( '' ) );
      var options  = names.map( this.getOptionByName.bind( this ) );
      var hasValue = value || argIsValue( i+1 );
      var reqValue = options.some( function( opt ){
        return opt.boolean ? false : ( opt.required && hasValue ) || hasValue;
      } );

      var val;
      if( reqValue ){
        // consume the next argument if a value wasn't provided as `--param=foo`
        val = value || argv[ ++i ];
      }

      // validate that all options are expected
      options.forEach( isValidOpt( names ) );

      // throw errors on options that mis-match whether nor not a value was provided
      options.forEach( function( opt ){
        if( opt.boolean && reqValue ){
          throw new Error( 'option ' + name + ' can\'t accept a value' );

        }else if( opt.required && !reqValue ){
          throw new Error( 'option ' + name + ' requires a value' );
        }
      } );

      // add value(s) to option output
      options.forEach( function( opt ){
        createReturnArray( opt ).concat( val );
      } );
    }

    this.trigger();
  }.bind( this ) );

  return this;
};
