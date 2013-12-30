/*
    Example of a custom exception handler used by Clever Controller.
    Usage: throw new ExampleException('my example message');
    See package for more details: https://npmjs.org/package/clever-controller
*/
function Example(message) {
  this.message = message;
}

Example.prototype = new Error;

module.exports = Example;