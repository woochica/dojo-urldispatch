dojo.provide('urldispatch');

dojo.require("dojo.hash");

dojo.declare('urldispatch.Dispatcher',
    null,
    {
        _routes: [],

        constructor: function(routes) {
            this._routes = routes;
            dojo.subscribe("/dojo/hashchange", this, 'dispatch');
            this.dispatch(dojo.hash());
        },

        redirect: function(url) {
            dojo.hash(url);
        },

        dispatch: function(hash) {
            var dispatcher = this;
            dojo.forEach(this._routes, function(route) {
                if (hash == route[0]) {
                    route[1](dispatcher);
                }
            });
        }
    }
);
