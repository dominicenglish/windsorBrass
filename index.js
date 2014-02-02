var express = require('express'),
    viewHelpers = require('view-helpers'),
    app = express(),
    port = 3003;

// Should be placed before exp
app.use(express.compress({
    filter: function(req, res) {
        return (/json|text|javascript|css/).test(res.getHeader('Content-Type'));
    },
    level: 9
}));

app.use(express.static('public'));
app.set('views', 'app/views');
app.set('view engine', 'jade');

// View helpers
app.use(viewHelpers('windsor-brass'));

// Routes
app.all('*', function(req, res) {
    res.render('index', {});
});

//Assume 404 since no middleware responded
app.use(function(req, res, next) {
    res.status(404).render('404', {
        url: req.originalUrl,
        error: 'Not found'
    });
});

app.listen(port);
console.log('Express app started on port '+port);
