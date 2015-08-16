var extend   = require( 'deep-extend' );
var defaults = {
  // can be set via function params
    params       : ''
  , description  : ''
  , handler      : undefined
  , defaultValue : undefined

  // must be set via options object
  , hidden    : false
  , group     : undefined
  , setsGroup : false
  , shortName : undefined
  , longName  : undefined
  , required  : undefined
  , boolean   : undefined
};

function Option( config ){
  this.config = extend( {}, defaults, config );
  this.hidden = this.config.hidden;

  this.parseParams( this.config.params );
}

extend( Option.prototype, {
  is : function( param ){
    return ( this.shortName === param ) || ( this.longName === param );
  }

  , parseParams : function( params ){
    //             (          -key           )(          --key           )(     <      )(      [      )
    var paramRx = /(?=(?:.*(?:^|[^-])-(\w+))?)(?=(?:.*(?:^|[^-])--(\w+))?)(?=(?:.*(<))?)(?=(?:.*(\[))?)/;
    var matches = paramRx.exec( params );

    this.shortName = this.options.shortName || matches[1];
    this.longName  = this.options.longName  || matches[2];
    this.boolean   = ( this.options.boolean != null )
      ? this.options.boolean
      : !( matches[3] || matches[4] );
    this.required  = ( this.options.required != null ) ? this.options.required : !!matches[3];
  }

  , applyHandler : function( value ){
    var handler = this.handler;
    var result;

    if( typeof handler === 'function' ){
      result = handler( value );

    // if regex, validate or set to default
    } else if ( ( typeof handler === 'object' ) && handler.test ) {
      result = handler.test( value ) ? value : undefined;
    }

    return ( result != null ) ? result : this.defaultValue;
  }
} );

module.exports.option = function(/* [options], params, description, handler, defaultValue */){
  var args = arguments.slice();

  // consume the first argument if it's a config object
  var config = ( typeof args[0] === 'object' )
    ? extend( {}, args.shift() )
    : {};

  config = extend( {
      params       : args.shift()
    , description  : args.shift()
    , handler      : args.shift()
    , defaultValue : args.shift()
  }, config || {} );

  var newOpt = new Option( config );

  [ 'shortName', 'longName' ].forEach( function( name ){
    if( this.getOptionByName( name ) ){
      throw new Error( 'The option ' + name + ' cannot be redefined' );
    }
  }.bind( this ) );

  ( this.__options || ( this.__options = [] ) ).push( newOpt );
};

module.exports.getOptionByName = function( name ){
  return this.__options.filter( function( opt ){
    return opt.is( name );
  }).shift();
};
