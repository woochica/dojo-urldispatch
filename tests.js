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
        },
        runTest: function(){
            var test_views = {
                    root : 0,
                    hello : 0
                },
                routes = [
                    ['!/', function() {
                         test_views.root++;
                    }, 'home'],
                    ['!/hello', function() {
                         test_views.hello++
                    }, 'hello']
                ],
                dispatcher = new urldispatch.Dispatcher(routes);
                doh.is(0, test_views.root);
                dispatcher.dispatch("!/");
                doh.is(1, test_views.root);
                dispatcher.dispatch("!/hello");
                doh.is(1, test_views.root);
                doh.is(1, test_views.hello);
                dispatcher.dispatch("!/");
                doh.is(2, test_views.root);
                doh.is(1, test_views.hello);
                dispatcher.dispatch("!/hello");
                doh.is(2, test_views.root);
                doh.is(2, test_views.hello);
                dispatcher.dispatch("!/");
                doh.is(3, test_views.root);
                doh.is(2, test_views.hello);
        }
    }
 ]);
