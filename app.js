const express = require('express');
const bodyParser = require('body-parser');
const serverless = require('serverless-http')
const exphbs = require('express-handlebars');
const path = require('path');
const nodemailer = require('nodemailer');

const app = express();


app.engine('html', exphbs());
app.set('view engine', 'html');

app.use('/public', express.static(path.join(__dirname, 'public')));

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.get('/', (req,res) => {
    res.render('index');
})

app.post('/send', (req,res) => {
    const output = `
    <h2>Vous avez un nouveau message</h3>
    <ul>
     <li>Nom: ${req.body.nom}</li>
     <li>Prénom: ${req.body.prenom}</li>
     <li>Email: ${req.body.email}</li>
    </ul>
    <h3>Message</h3>
    ${req.body.message}
    `

    const transporter = nodemailer.createTransport({
        host: "smtp.gmail.com",
        port: 587,
        secure: false,
        auth: {
            user: 'kubatarsen@gmail.com',
            pass: 'arsenkubat'
        }
    })


    let info =  transporter.sendMail({
        from: `${req.body.email}`, // sender address
        to: "kubatarsen@gmail.com", // list of receivers
        subject: "...", // Subject line
        text: `${req.body.message}`, // plain text body
        html: output // html body
    });

    console.log("Message sent: %s", info.messageId);
    console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
    res.render('index', {msg: 'Le message a bien été envoyé'})
}

    )

app.listen(3000, () => console.log('server started'));
