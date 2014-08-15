var express = require('express'),
    viewHelpers = require('view-helpers'),
    nodemailer = require('nodemailer'),
    bodyParser = require('body-parser'),
    config = require('./config'),
    app = express(),
    port = 3003;

// Should be placed before exp
app.use(express.compress({
    filter: function(req, res) {
        return (/json|text|javascript|css/).test(res.getHeader('Content-Type'));
    },
    level: 9
}));

app.use(express.static('client'));
app.set('views', 'server/views');
app.set('view engine', 'jade');

app.use(bodyParser.json());

// View helpers
app.use(viewHelpers('windsor-brass'));

// Routes
app.get('/test', function(req, res) {
    res.render('test', {});
});
app.post('/api/message', function(req, res) {
    var subjectSuffix = req.body.email || req.body.name || (new Date()).toISOString();

    var transporter = nodemailer.createTransport({
        service: config.emailTransportDetails.service,
        auth: {
            user: config.emailTransportDetails.user,
            pass: config.emailTransportDetails.password
        }
    });
    var mailOptions = {
        from: config.contactFormRecipient.from,
        to: config.contactFormRecipient.to,
        subject: config.contactFormRecipient.subjectPrefix+' '+subjectSuffix,
        html: '<table><tr><td>Name:</td><td>'+req.body.name+'</td></tr><tr><td>Email:</td><td>'+req.body.email+'</td></tr><tr><td>Message:</td><td>'+req.body.message+'</td></tr></table>'
    };

    transporter.sendMail(mailOptions, function(error, info) {
        if (error) {
            console.log(error);
            res.send(500, 'Email was not sent');
        } else {
            res.send(200, 'Success, email was sent');
        }
    });
});
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
