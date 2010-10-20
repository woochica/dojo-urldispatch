dojo.provide('urldispatch');

dojo.require("dojo.hash");

dojo.declare('urldispatch.Dispatcher',
    null,
    {
        _routes: [],

        constructor: function(routes) {
            this._parseRoutes(routes);
            dojo.subscribe("/dojo/hashchange", this, 'dispatch');
            this.dispatch(dojo.hash());
        },

        _parseRoutes: function(routes) {
            var that = this;
            dojo.forEach(routes, function(route, idx) {
                var args = route[0].match(/:\w+/g),
                    re = new RegExp('^' + route[0].replace(/(:\w+)/, '(\\w+)') + '$', 'g');
                that._routes.push([re, route[1], args]);
            });
        },

        redirect: function(url) {
            dojo.hash(url);
        },

        dispatch: function(hash) {
            var i, j, route, params, context, arg, view;
            for (i = 0; i < this._routes.length; i++) {
                route = this._routes[i];
                if (!route[0].test(hash)) {
                    continue;
                }
                params = hash.split(route[0]);
                context = {};
                params.shift();
                params.pop();
                for (j = 0; j < params.length; j++) {
                    arg = route[2][j].substring(1);
                    context[arg] = params[j];
                }
                view = route[1];
                view(this, context);
                break;
            }
        }
    }
);
