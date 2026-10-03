const express = require("express");
const session = require("express-session");
const cookieParser = require("cookie-parser");

const app = express();
const PORT = 3000;

// Middleware
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));

// Session configuration
app.use(
    session({
        secret: "mysecretkey",
        resave: false,
        saveUninitialized: true,

        cookie: {
            maxAge: 60000,
            httpOnly: true
        }
    })
);


// -----------------------------
// Home Route
// -----------------------------

app.get("/", (req, res) => {

    if (req.session.username) {

        res.send(`
            <h1>Session & Cookie Demo</h1>

            <h2>Welcome back, ${req.session.username}!</h2>

            <p>You are currently logged in using a session.</p>

            <p>
                <a href="/session-info">Session Info</a>
            </p>

            <p>
                <a href="/get-cookie">View Cookie</a>
            </p>

            <p>
                <a href="/logout">Logout</a>
            </p>
        `);

    } else {

        res.send(`
            <h1>Session & Cookie Demo</h1>

            <h2>Login</h2>

            <form action="/login" method="POST">

                <input
                    type="text"
                    name="username"
                    placeholder="Enter username"
                    required
                >

                <button type="submit">
                    Login
                </button>

            </form>
        `);
    }
});


// -----------------------------
// Login
// -----------------------------

app.post("/login", (req, res) => {

    const { username } = req.body;

    if (!username) {
        return res.send("Username is required.");
    }

    // Store username in server-side session
    req.session.username = username;

    // Create a normal application cookie
    res.cookie(
        "theme",
        "dark",
        {
            maxAge: 900000,
            httpOnly: true
        }
    );

    res.redirect("/");
});


// -----------------------------
// Session Information
// -----------------------------

app.get("/session-info", (req, res) => {

    if (!req.session.username) {

        return res.send(`
            <p>No active user session.</p>
            <a href="/">Go Home</a>
        `);
    }

    res.send(`
        <h1>Session Information</h1>

        <p>
            Username stored in session:
            <strong>${req.session.username}</strong>
        </p>

        <p>
            Session ID:
            ${req.sessionID}
        </p>

        <a href="/">Back</a>
    `);
});


// -----------------------------
// Get Cookie
// -----------------------------

app.get("/get-cookie", (req, res) => {

    const theme = req.cookies.theme;

    res.send(`
        <h1>Cookie Information</h1>

        <p>
            Theme cookie:
            <strong>${theme || "Cookie not found"}</strong>
        </p>

        <a href="/">Back</a>
    `);
});


// -----------------------------
// Delete Application Cookie
// -----------------------------

app.get("/delete-cookie", (req, res) => {

    res.clearCookie("theme");

    res.send(`
        <p>Theme cookie deleted successfully.</p>

        <a href="/">Back</a>
    `);
});


// -----------------------------
// Logout / Destroy Session
// -----------------------------

app.get("/logout", (req, res) => {

    req.session.destroy((err) => {

        if (err) {
            return res.send("Error destroying session.");
        }

        res.clearCookie("connect.sid");

        res.redirect("/");
    });
});


// -----------------------------
// Start Server
// -----------------------------

app.listen(PORT, () => {

    console.log(
        `Server running at http://localhost:${PORT}`
    );

});