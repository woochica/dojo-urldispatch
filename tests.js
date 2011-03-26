dojo.provide('tests');

dojo.require('urldispatch');
dojo.require('urldispatch.MissingArgumentError');
dojo.require('urldispatch.RouteNotFoundError');

doh.register('tests.urldispatchTestGroup', [
    {
        name: 'reverseTest',
        setUp: function(){
            this.routes = [
                ['/', function() {}, 'home'],
                ['/Hello/:name', function() {}, 'hello']
            ];
            this.dispatcher = new urldispatch.Dispatcher(this.routes);
        },
        runTest: function(){
            doh.is('/', this.dispatcher.reverse('home'));
            doh.is('/Hello/Kerli', this.dispatcher.reverse('hello', {name: 'Kerli'}));
	    doh.e(urldispatch.MissingArgumentError, this.dispatcher, 'reverse', ['hello', {}]);
	    doh.e(urldispatch.MissingArgumentError, this.dispatcher, 'reverse', ['hello']);
	    doh.e(urldispatch.RouteNotFoundError, this.dispatcher, 'reverse', ['unknown_name']);
        }
    },
    {
        name: 'routeMatchTest',
        setUp: function(){
            this.test_views = {
                root: 0,
                hello: 0
            };
            this.routes = [
                ['!/',  dojo.hitch(this, function(){ this.test_views.root++; }), 'home'],
                ['!/hello',  dojo.hitch(this, function() { this.test_views.hello++; }), 'hello']
            ];
            this.dispatcher = new urldispatch.Dispatcher(this.routes);
        },
        runTest: function(){
            var test_views = this.test_views;
            doh.is(0, test_views.root);
            this.dispatcher.dispatch("!/");
            doh.is(1, test_views.root);
            this.dispatcher.dispatch("!/hello");
            doh.is(1, test_views.root);
            doh.is(1, test_views.hello);
            this.dispatcher.dispatch("!/");
            doh.is(2, test_views.root);
            doh.is(1, test_views.hello);
            this.dispatcher.dispatch("!/hello");
            doh.is(2, test_views.root);
            doh.is(2, test_views.hello);
            this.dispatcher.dispatch("!/");
            doh.is(3, test_views.root);
            doh.is(2, test_views.hello);
        }
    }
 ]);
