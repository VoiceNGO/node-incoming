module.exports = {
  version : function( v ){
    this.__version = v;

    this
      .option( {
          args        : '-v, --version'
        , description : 'Displayings version info'
        , hidden      : true
      } )
      .then( function( args ){
        if( args.v ){
          return this.__version;
        }
      } );

    return this;
  }
};
