dojo.provide('urldispatch');
dojo.provide('urldispatch.MissingArgumentError');
dojo.provide('urldispatch.RouteNotFoundError');

dojo.require("dojo.hash");

dojo.declare('urldispatch.Dispatcher',
    null,
    {
        _routes: [],

        constructor: function(/*Array*/ routes) {
            // summary:
            //            Constructs Dispatcher object.
            // description:
            //            Builds inner routing table and subscribes itself
            //            to location hash changes.
            this._parseRoutes(routes);
            dojo.subscribe("/dojo/hashchange", this, 'dispatch');
            this.dispatch(dojo.hash());
        },

        _parseRoutes: function(/*Array*/ routes) {
            // summary:
            //            Builds inner routing table.
            // description:
            //            Transforms abstract URL patterns to regular
            //            expressions and collects keyword arguments.
            dojo.forEach(routes, dojo.hitch(this, function(route) {
                this._routes.push({
                    pattern: new RegExp('^' + route[0].replace(/(:\w+)/, '(\\w+)') + '$', 'g'),
                    path: route[0],
                    view: route[1],
                    kwArgs: route[0].match(/:\w+/g),
                    name: route[2]
                });
            }));
        },

        redirect: function(/*String*/ hash) {
            // summary:
            //            Redirects visitor to argument URL hash.
            dojo.hash(hash);
        },

        reverse: function(/*String*/ name, /*Object*/ context) {
            // summary:
            //            Returns route path for specified name.  Raises error
            //            if no route matched or context arguments are missing.
            var i, j, route;
            for (i = 0; i < this._routes.length; i++) {
                route = this._routes[i];
                if (route.name === name) {
                    if (typeof context === 'undefined') {
                        if (route.kwArgs === null) {
                            // return path if no context arguments present and
                            // route has no parameter
                            return route.path;
                        }
                        throw new urldispatch.MissingArgumentError(this.declaredClass + '.reverse(): Missing arguments for route "' + route.name + '"');
                    }
                    // substitute keyword arguments to context parameters
                    return route.path.replace(/:(\w+)/g, function(str, p1) {
                        if (typeof context[p1] !== 'undefined') {
                            return context[p1];
                        }
                        throw new urldispatch.MissingArgumentError(this.declaredClass + '.reverse(): Missing argument "' + p1 + '" for route "' + route.name + '"');
                    });
                }
            }
            throw new urldispatch.RouteNotFoundError(this.declaredClass+'.reverse(): No route matched the name "' + name + '"');
        },

        dispatch: function(/*String*/ hash) {
            // summary:
            //            Calls view according to URL hash.
            // description:
            //            Finds routing rule that matches against the URL hash
            //            specified and calls appropiate view function with
            //            request arguments.  Exactly one view should belong to
            //            each routes.
            var i, j, route, params, arg,
                request = {dispatcher: this};
            for (i = 0; i < this._routes.length; i++) {
                route = this._routes[i];
                if (!route.pattern.test(hash)) {
                    continue;
                }
                params = hash.split(route.pattern);
                params.shift(); // strip first and last empty chunk
                params.pop();
                for (j = 0; j < params.length; j++) {
                    arg = route.kwArgs[j].substring(1); // strip first char ':'
                    request[arg] = params[j];
                }
                (route.view)(request);
                break;
            }
        }
    }
);


dojo.declare('urldispatch.MissingArgumentError', Error, {});
dojo.declare('urldispatch.RouteNotFoundError', Error, {});
