
/**
 * @doc module
 * @name Routes
 * @description This module contains all the routes for the back-end API. Click "view source" to view code for routes file.
*/

var passport = require('passport');

module.exports = function(app) {
    var injector = app.get('injector');

    injector.inject(function(ExampleController, UserController) {

        /**
         * @doc function
         * @name Routes.example.action
         * @description
         *
         * GET/POST: Dynamic action:id routes for Example controller. For example, calling `/example/create/` will route through to the Example controller's createAction. See base controller `src/classes/Controller.js` for all default actions.
         *
         */
        app.all('/example/?:action?', ExampleController.attach());
        app.all('/example/:action/:id?', ExampleController.attach());

        /**
         * @doc function
         * @name Routes.user.isEmailAvailable
         * @param {string} email the email address to search for.
         * @return {boolean} true if the email is available for register.
         * @description
         *
         * GET/POST: Checks the database to see if the email is available. Requires email address.
         *
         */
        app.all('/user/isEmailAvailable', UserController.isEmailAvailable, UserController.attach());

        /**
         * @doc function
         * @name Routes.user.current
         * @return {obj} user
         * @description
         *
         * GET: Returns the current user details if they are logged in.
         *
         */
        app.get('/user/current', UserController.attach());

        /**
         * @doc function
         * @name Routes.user.login
         * @param {string} username user login username
         * @param {string} password user login password
         * @return {obj} user
         * @description
         *
         * POST: Login for the user, requires username and password
         *
         */
        app.post('/user/login', UserController.attach());

        /**
         * @doc function
         * @name Routes.user.action
         * @param {string} param_name as specified by user controller function.
         * @return {obj} as specified by user controller function.
         * @description
         *
         * GET/POST: See base controller for more default Actions.
         * Example /user/list will call UserController:ListAction.
         *
         */
        app.post('/user', UserController.attach());


        app.all('/user/?:action?', UserController.requiresLogin, UserController.attach());
        app.all('/user/:action/:id?', UserController.requiresLogin, UserController.attach());
    });
};
