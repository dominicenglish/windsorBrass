'use strict';

var express = require('express'),
    viewHelpers = require('view-helpers'),
    nodemailer = require('nodemailer'),
    bodyParser = require('body-parser'),
    request = require('request'),
    config = require('./config'),
    app = express(),
    port = 3003;

require('mailchimp-api');

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

    transporter.sendMail(mailOptions, function(error) {
        if (error) {
            console.log(error);
            res.send(500, 'Email was not sent');
        } else {
            res.send(200, 'Success, email was sent');
        }
    });
});
app.post('/api/newsletter/subscribe', function(req, res, next) {

    var ALREADY_SUBSCRIBED = 214;
    var responseMessage = 'There was an error subscribing that user';
    var emailToSubscribe = req.body.email;
    if (!emailToSubscribe) {
        return next(new Error('No email to subscribe was provided.'));
    }

    var mailChimpRequest = {
        apikey: config.mailChimpDetails.key,
        id: config.mailChimpDetails.listId,
        batch: [
            {
                email: {
                    email: emailToSubscribe
                },
                email_type: 'html',
                merge_vars: {}
            }
        ],
        double_optin: false,
        update_existing: false,
        replace_interests: false
    };

    request.post(
        {
            uri: 'https://us2.api.mailchimp.com/2.0/lists/batch-subscribe.json',
            json: mailChimpRequest
        },
        function(error, response, body) {
            if (error) {
                return next(new Error(responseMessage));
            }
            if (body && body.errors && body.errors.length ) {
                if (body.errors[0].code === ALREADY_SUBSCRIBED) {
                    return next(body.errors[0]);
                }
                return next(new Error(responseMessage));
            }
            res.send(200, 'Success, user was subscribed to mailing list');
        }
    );
});
app.all('*', function(req, res) {
    res.render('index', {});
});

// Error handling
app.use(function(err, req, res, next) {
    if (err) {
        return res.send(500, err);
    }
    next(err);
});

//Assume 404 since no middleware responded
app.use(function(req, res) {
    res.status(404).render('404', {
        url: req.originalUrl,
        error: 'Not found'
    });
});

app.listen(port);
console.log('Express app started on port '+port);
