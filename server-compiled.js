'use strict';

var _express = require('express');

var _express2 = _interopRequireDefault(_express);

var _bodyParser = require('body-parser');

var _bodyParser2 = _interopRequireDefault(_bodyParser);

var _nodemailer = require('nodemailer');

var _nodemailer2 = _interopRequireDefault(_nodemailer);

var _multer = require('multer');

var _multer2 = _interopRequireDefault(_multer);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var upload = (0, _multer2.default)({ dest: 'uploads/' });
var app = (0, _express2.default)();
app.use(_bodyParser2.default.json());
app.use(_bodyParser2.default.urlencoded({ extended: true, type: 'application/x-www-form-urlencoded' }));

var transporter = _nodemailer2.default.createTransport({
    sendMail: true,
    host: 'cdgemail.cdg.co.th',
    auth: {
        user: '005367@cdg.co.th',
        pass: 'armsozk38'
    },
    pool: true
});

transporter.verify(function (error, success) {
    if (error) {
        console.log(error);
    } else {
        console.log('Server is ready to take our messages');
    }
});

app.get("/", function (req, res) {
    res.send('Email Server Experiment.');
});

app.post("/sendMail", upload.single('file'), function (req, res) {
    var _req$body = req.body,
        fromMail = _req$body.fromMail,
        toMail = _req$body.toMail,
        cc = _req$body.cc,
        bcc = _req$body.bcc,
        content = _req$body.content,
        subject = _req$body.subject,
        file = _req$body.file;


    console.log(req.file);

    if (!fromMail) {
        res.status(500).jsonp({ message: 'no sender' });
        return;
    }
    if (!toMail) {
        res.status(500).jsonp({ message: 'no reviever' });
        return;
    }
    if (!subject) {
        res.status(500).jsonp({ message: 'no subject' });
        return;
    }
    var mailOptions = {
        from: fromMail,
        to: toMail.split(','),
        cc: cc ? cc.split(',') : [],
        bcc: bcc ? bcc.split(',') : [],
        subject: subject,
        text: content,
        encoding: 'utf-8'
    };
    transporter.sendMail(mailOptions, function (error, info) {
        if (error) {
            res.status(500).jsonp({ message: 'Error to send email' });
            return;
        }
        console.log('Message %s sent: %s', info.messageId, info.response);
        res.status(200).jsonp({
            message: 'Sent Successful',
            files: file
        });
        return;
    });
});

app.listen(3000, function () {
    console.log('app listening on port 3000');
});
