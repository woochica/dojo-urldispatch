dojo.provide('urldispatch');

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
                var kwArgs = route[0].match(/:\w+/g),
                    re = new RegExp('^' + route[0].replace(/(:\w+)/, '(\\w+)') + '$', 'g');
                this._routes.push([re, route[1], kwArgs]);
            }));
        },

        redirect: function(/*String*/ hash) {
            // summary:
            //            Redirects visitor to argument URL hash.
            dojo.hash(url);
        },

        dispatch: function(/*String*/ hash) {
            // summary:
            //            Calls view according to URL hash.
            // description:
            //            Finds routing rule that matches against the URL hash
            //            specified and calls appropiate view function with
            //            context arguments.  Exactly one view should belong to
            //            each routes.
            var i, j, route, params, context = {}, arg, view;
            for (i = 0; i < this._routes.length; i++) {
                route = this._routes[i];
                if (!route[0].test(hash)) {
                    continue;
                }
                params = hash.split(route[0]);
                params.shift(); // strip first and last empty chunk
                params.pop();
                for (j = 0; j < params.length; j++) {
                    arg = route[2][j].substring(1); // strip first char ':'
                    context[arg] = params[j];
                }
                view = route[1];
                view(this, context);
                break;
            }
        }
    }
);
