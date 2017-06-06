import Express from 'express';
import bodyParser from 'body-parser';
import nodemailer from 'nodemailer';
import multer from 'multer';

const upload = multer({ dest: 'uploads/' });
const app = Express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true, type: 'application/x-www-form-urlencoded' }));

const transporter = nodemailer.createTransport({
    sendMail: true,
    host: 'cdgemail.cdg.co.th',
    auth: {
        user: '005367@cdg.co.th',
        pass: 'armsozk38'
    },
    pool: true
});

transporter.verify((error, success) => {
    if (error) {
        console.log(error);
    } else {
        console.log('Server is ready to take our messages');
    }
})


app.get("/", (req, res) => {
    res.send('Email Server Experiment.');
});

app.post("/sendMail", upload.single('file'), (req, res) => {


    let { fromMail, toMail, cc, bcc, content, subject, file } = req.body;
    
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
    let mailOptions = {
        from: fromMail,
        to: toMail.split(','),
        cc: cc ? cc.split(',') : [],
        bcc: bcc ? bcc.split(',') : [],
        subject: subject,
        text: content,
        encoding: 'utf-8'
    };
    transporter.sendMail(mailOptions, (error, info) => {
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

app.listen(3000, () => {
    console.log('app listening on port 3000');
});
