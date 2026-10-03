const express = require("express");
const session = require("express-session");
const cookieParser = require("cookie-parser");

const app = express();

app.set("view engine", "ejs");

app.use(express.urlencoded({
    extended: true
}));

app.use(cookieParser());

app.use(
    session({

        secret: "backend-lab-secret",

        resave: false,

        saveUninitialized: false,

        cookie: {
            maxAge: 1000 * 60 * 30
        }

    })
);


// Home

app.get("/", (req, res) => {

    res.redirect("/login");

});


// Login page

app.get("/login", (req, res) => {

    res.render("login", {
        username: req.cookies.username || ""
    });

});


// Login

app.post("/login", (req, res) => {

    const username = req.body.username;

    if (!username) {

        return res.send(
            "Username is required."
        );

    }


    // Store data in session

    req.session.username = username;


    // Create cookie

    res.cookie(
        "username",
        username,
        {
            maxAge: 1000 * 60 * 60
        }
    );


    res.redirect("/dashboard");

});


// Dashboard

app.get("/dashboard", (req, res) => {

    if (!req.session.username) {

        return res.redirect("/login");

    }


    res.render(
        "dashboard",
        {
            username: req.session.username
        }
    );

});


// Logout

app.get("/logout", (req, res) => {

    req.session.destroy(() => {

        res.redirect("/login");

    });

});


app.listen(3000, () => {

    console.log(
        "Server running at http://localhost:3000"
    );

});