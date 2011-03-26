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
            this.testViews = {
                root: 0,
                hello: 0
            };
            this.routes = [
                ['!/',  dojo.hitch(this, function(){ this.testViews.root++; }), 'home'],
                ['!/hello',  dojo.hitch(this, function() { this.testViews.hello++; }), 'hello']
            ];
            this.dispatcher = new urldispatch.Dispatcher(this.routes);
        },
        runTest: function(){
            var testViews = this.testViews;
            doh.is(0, testViews.root);
            this.dispatcher.dispatch("!/");
            doh.is(1, testViews.root);
            this.dispatcher.dispatch("!/hello");
            doh.is(1, testViews.root);
            doh.is(1, testViews.hello);
            this.dispatcher.dispatch("!/");
            doh.is(2, testViews.root);
            doh.is(1, testViews.hello);
            this.dispatcher.dispatch("!/hello");
            doh.is(2, testViews.root);
            doh.is(2, testViews.hello);
            this.dispatcher.dispatch("!/");
            doh.is(3, testViews.root);
            doh.is(2, testViews.hello);
        }
    }
 ]);
