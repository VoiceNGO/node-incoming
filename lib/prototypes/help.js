function formatHelpText( text, maxCol ){

}

function measureOption( option ){

}

function formatOption( option, maxCol ){

}

module.exports.addHelp = function( description ){
  this.__helpDescription = description;

  this
    .option( {
        args        : '-h, --help'
      , description : 'Displayings help'
      , hidden      : true
    } )
    .then( function( args ){
      if( args.h ){
        return ( this.__helpDescription + this.__options );
      }
    } );

};

module.exports.rest = function( name ){

};

module.exports.helpText = function( text ){

};

module.exports.example = function( exampleTet ){

};
