# Incoming-args

A utility for parsing command line arguments that can also handle

## Usage

```js
var Program = require( 'node-incoming' );

new Program()
  .version    ( '0.0.1' )
  .option     ( '-a --Apple', 'Apples are round, kinda', handler, 'default' )
  .addHelp    ( 'Description of the module goes here' )
  .processArgs() // deferred call to process command-line arguments

  .observable () // returns an RxJS observable
  ;
```
