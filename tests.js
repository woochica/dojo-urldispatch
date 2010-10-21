dojo.provide('tests');

dojo.require('urldispatch');
dojo.require('urldispatch.MissingArgumentError');
dojo.require('urldispatch.RouteNotFoundError');

doh.register('tests.urldispatchTestGroup', [
    {
        name: 'reverseTest',
        setUp: function() {
            this.routes = [
                ['/', function() {}, 'home'],
                ['/Hello/:name', function() {}, 'hello']
            ];
            this.dispatcher = new urldispatch.Dispatcher(this.routes);
        },
        runTest: function() {
            doh.is('/', this.dispatcher.reverse('home'));
            doh.is('/Hello/Kerli', this.dispatcher.reverse('hello', {name: 'Kerli'}));
	    doh.e(urldispatch.MissingArgumentError, this.dispatcher, 'reverse', ['hello', {}]);
	    doh.e(urldispatch.MissingArgumentError, this.dispatcher, 'reverse', ['hello']);
	    doh.e(urldispatch.RouteNotFoundError, this.dispatcher, 'reverse', ['unknown_name']);
        }
    }
]);
