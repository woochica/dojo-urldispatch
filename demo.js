dojo.provide('demo');

dojo.require("urldispatch");

// Set up routes
dojo.ready(function() {
    var routes = [
        ['!/', home_view, 'home'],
        ['!/Hello', hello_view],
        ['!/Hello/:name', hello_view, 'hello']
    ];
    var dispatcher = new urldispatch.Dispatcher(routes);
});

// Some views
function home_view(request) {
    alert('Welcome!');
}

function hello_view(request) {
    if (!request.name) {
        alert('Hey, anonymous!');
        return;
    }
    var status = window.confirm('Hey, are you ' + request.name + '?');
    if (status) {
        alert('Tere ' + request.name + '!');
    } else {
        var url = request.dispatcher.reverse('home');
        request.dispatcher.redirect(url);
    }
}
