const express = require('express');
const path = require('path');
const passport = require("passport");
const app = express();
const ejs = require('ejs');
const bodyParser = require('body-parser');
const cookieSession = require("cookie-session");

app.use(express.static(path.join(__dirname, 'views')));
app.use("views", express.static('views'));
app.use( bodyParser.json());
app.use( bodyParser.urlencoded({extended:false}) );
app.use(passport.initialize());
app.use(passport.session());
app.set("view engine","ejs");
app.use(cookieSession({
        name: "session",
        keys: ["ford","time"]
    }))
const rutaIndex = require("./ruta")(app,passport);

app.listen(3000, () => {
    console.log('Server on port 3000')
})