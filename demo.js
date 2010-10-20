dojo.provide('demo');

dojo.require("urldispatch");

// Set up routes
dojo.ready(function() {
    var routes = [
        ['/', home_view],
        ['/Hello', hello_view],
        ['/Hello/:name', hello_view]
    ];
    var dispatcher = new urldispatch.Dispatcher(routes);
});

// Some views
function home_view(dispatcher) {
    alert('Welcome!');
}

function hello_view(dispatcher, context) {
    if (!context.name) {
        alert('Hey, anonymous!');
        return;
    }
    var status = window.confirm('Hey, are you ' + context.name + '?');
    if (status) {
        alert('Tere ' + context.name + '!');
    } else {
        dispatcher.redirect('/');
    }
}
