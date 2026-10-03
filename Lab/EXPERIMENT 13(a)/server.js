const express = require("express");
const mongoose = require("mongoose");

const app = express();
const PORT = 3000;

// ============================================
// MIDDLEWARE
// ============================================

// Parse JSON request bodies
app.use(express.json());

// Parse HTML form data
app.use(express.urlencoded({ extended: true }));


// ============================================
// STEP 1: CONNECT TO MONGODB
// ============================================

const DB_URL = "mongodb://127.0.0.1:27017/userdb";

mongoose
    .connect(DB_URL)
    .then(() => {
        console.log("Connected to MongoDB successfully");
    })
    .catch((error) => {
        console.error("MongoDB connection error:", error);
    });


// ============================================
// STEP 2: DEFINE USER SCHEMA
// ============================================

const userSchema = new mongoose.Schema({

    username: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },

    email: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },

    password: {
        type: String,
        required: true
    },

    createdAt: {
        type: Date,
        default: Date.now
    }

});


// ============================================
// STEP 3: CREATE USER MODEL
// ============================================

const User = mongoose.model("User", userSchema);


// ============================================
// COMMON PAGE STYLING
// ============================================

const styles = `
    <style>

        * {
            box-sizing: border-box;
        }

        body {
            font-family: Arial, Helvetica, sans-serif;
            background-color: #f4f6f8;
            margin: 0;
            padding: 0;
            color: #222;
        }

        .page {
            width: 90%;
            max-width: 850px;
            margin: 40px auto;
        }

        .header {
            text-align: center;
            margin-bottom: 30px;
        }

        .header h1 {
            margin-bottom: 8px;
        }

        .header p {
            color: #666;
        }

        .container {
            background-color: white;
            padding: 25px;
            margin-bottom: 25px;
            border-radius: 10px;
            border: 1px solid #ddd;
        }

        h2 {
            margin-top: 0;
        }

        label {
            display: block;
            margin-top: 15px;
            margin-bottom: 6px;
            font-weight: bold;
        }

        input {
            width: 100%;
            padding: 11px;
            border: 1px solid #bbb;
            border-radius: 5px;
            font-size: 15px;
        }

        button {
            background-color: #222;
            color: white;
            padding: 11px 20px;
            border: none;
            border-radius: 5px;
            margin-top: 18px;
            cursor: pointer;
            font-size: 15px;
        }

        button:hover {
            background-color: #444;
        }

        a {
            color: #0056b3;
            text-decoration: none;
        }

        a:hover {
            text-decoration: underline;
        }

        .success {
            color: #087830;
        }

        .error {
            color: #b00020;
        }

        .user {
            background-color: #f8f9fa;
            padding: 15px;
            border-radius: 6px;
            margin-bottom: 12px;
        }

        .back {
            display: inline-block;
            margin-top: 20px;
        }

    </style>
`;


// ============================================
// HOME ROUTE
// ============================================

app.get("/", (req, res) => {

    res.send(`
        <!DOCTYPE html>

        <html lang="en">

        <head>

            <meta charset="UTF-8">

            <meta
                name="viewport"
                content="width=device-width, initial-scale=1.0"
            >

            <title>User Management System</title>

            ${styles}

        </head>

        <body>

            <div class="page">

                <div class="header">

                    <h1>User Management System</h1>

                    <p>
                        MongoDB + Mongoose + Express
                    </p>

                </div>


                <!-- Registration -->

                <div class="container">

                    <h2>Register New User</h2>

                    <form
                        action="/signup"
                        method="POST"
                    >

                        <label for="username">
                            Username
                        </label>

                        <input
                            type="text"
                            id="username"
                            name="username"
                            placeholder="Enter username"
                            required
                        >


                        <label for="email">
                            Email
                        </label>

                        <input
                            type="email"
                            id="email"
                            name="email"
                            placeholder="Enter email"
                            required
                        >


                        <label for="password">
                            Password
                        </label>

                        <input
                            type="password"
                            id="password"
                            name="password"
                            placeholder="Enter password"
                            required
                        >


                        <button type="submit">
                            Sign Up
                        </button>

                    </form>

                </div>


                <!-- Login -->

                <div class="container">

                    <h2>Login</h2>

                    <form
                        action="/login"
                        method="POST"
                    >

                        <label for="loginUsername">
                            Username
                        </label>

                        <input
                            type="text"
                            id="loginUsername"
                            name="username"
                            placeholder="Enter username"
                            required
                        >


                        <label for="loginPassword">
                            Password
                        </label>

                        <input
                            type="password"
                            id="loginPassword"
                            name="password"
                            placeholder="Enter password"
                            required
                        >


                        <button type="submit">
                            Login
                        </button>

                    </form>

                </div>


                <!-- Display Users -->

                <div class="container">

                    <h2>Registered Users</h2>

                    <p>
                        View all users currently stored in MongoDB.
                    </p>

                    <form
                        action="/users"
                        method="GET"
                    >

                        <button type="submit">
                            Show All Registered Users
                        </button>

                    </form>

                </div>

            </div>

        </body>

        </html>
    `);

});


// ============================================
// SIGNUP ROUTE
// ============================================

app.post("/signup", async (req, res) => {

    try {

        // Retrieve submitted form data
        const { username, email, password } = req.body;


        // Server-side validation
        if (
            !username ||
            !username.trim() ||
            !email ||
            !email.trim() ||
            !password
        ) {

            return res.status(400).send(`
                <!DOCTYPE html>

                <html>

                <head>

                    <title>Registration Error</title>

                    ${styles}

                </head>

                <body>

                    <div class="page">

                        <div class="container">

                            <h2 class="error">
                                All fields are required.
                            </h2>

                            <a
                                href="/"
                                class="back"
                            >
                                ← Go Back
                            </a>

                        </div>

                    </div>

                </body>

                </html>
            `);

        }


        // Create new Mongoose document
        const newUser = new User({

            username: username.trim(),

            email: email.trim(),

            password: password

        });


        // Save document to MongoDB
        await newUser.save();


        res.send(`
            <!DOCTYPE html>

            <html>

            <head>

                <title>Registration Successful</title>

                ${styles}

            </head>

            <body>

                <div class="page">

                    <div class="container">

                        <h2 class="success">
                            User Registered Successfully!
                        </h2>

                        <p>
                            <strong>Username:</strong>
                            ${newUser.username}
                        </p>

                        <p>
                            <strong>Email:</strong>
                            ${newUser.email}
                        </p>

                        <p>
                            <strong>Created:</strong>
                            ${newUser.createdAt.toLocaleString()}
                        </p>

                        <a
                            href="/"
                            class="back"
                        >
                            ← Go Back to Home
                        </a>

                    </div>

                </div>

            </body>

            </html>
        `);

    }

    catch (error) {

        // MongoDB duplicate key
        if (error.code === 11000) {

            return res.status(409).send(`
                <!DOCTYPE html>

                <html>

                <head>

                    <title>Duplicate User</title>

                    ${styles}

                </head>

                <body>

                    <div class="page">

                        <div class="container">

                            <h2 class="error">
                                Username or email already exists.
                            </h2>

                            <p>
                                Please use a different username
                                or email address.
                            </p>

                            <a
                                href="/"
                                class="back"
                            >
                                ← Go Back and Try Again
                            </a>

                        </div>

                    </div>

                </body>

                </html>
            `);

        }


        res.status(500).send(`
            <!DOCTYPE html>

            <html>

            <head>

                <title>Error</title>

                ${styles}

            </head>

            <body>

                <div class="page">

                    <div class="container">

                        <h2 class="error">
                            Registration Error
                        </h2>

                        <p>
                            ${error.message}
                        </p>

                        <a
                            href="/"
                            class="back"
                        >
                            ← Go Back
                        </a>

                    </div>

                </div>

            </body>

            </html>
        `);

    }

});


// ============================================
// LOGIN ROUTE
// ============================================

app.post("/login", async (req, res) => {

    try {

        const { username, password } = req.body;


        if (
            !username ||
            !username.trim() ||
            !password
        ) {

            return res.status(400).send(`
                <!DOCTYPE html>

                <html>

                <head>

                    <title>Login Error</title>

                    ${styles}

                </head>

                <body>

                    <div class="page">

                        <div class="container">

                            <h2 class="error">
                                Username and password are required.
                            </h2>

                            <a href="/">
                                ← Go Back
                            </a>

                        </div>

                    </div>

                </body>

                </html>
            `);

        }


        // Find user by username
        const user = await User.findOne({

            username: username.trim()

        });


        // User doesn't exist
        if (!user) {

            return res.status(404).send(`
                <!DOCTYPE html>

                <html>

                <head>

                    <title>User Not Found</title>

                    ${styles}

                </head>

                <body>

                    <div class="page">

                        <div class="container">

                            <h2 class="error">
                                User Not Found
                            </h2>

                            <p>
                                No account exists with that username.
                            </p>

                            <a
                                href="/"
                                class="back"
                            >
                                ← Go Back and Try Again
                            </a>

                        </div>

                    </div>

                </body>

                </html>
            `);

        }


        // Compare passwords
        if (user.password !== password) {

            return res.status(401).send(`
                <!DOCTYPE html>

                <html>

                <head>

                    <title>Incorrect Password</title>

                    ${styles}

                </head>

                <body>

                    <div class="page">

                        <div class="container">

                            <h2 class="error">
                                Incorrect Password
                            </h2>

                            <p>
                                The entered password does not match.
                            </p>

                            <a
                                href="/"
                                class="back"
                            >
                                ← Go Back and Try Again
                            </a>

                        </div>

                    </div>

                </body>

                </html>
            `);

        }


        // Successful login
        res.send(`
            <!DOCTYPE html>

            <html>

            <head>

                <title>Login Successful</title>

                ${styles}

            </head>

            <body>

                <div class="page">

                    <div class="container">

                        <h2 class="success">
                            Login Successful!
                        </h2>

                        <h3>
                            Welcome back, ${user.username}!
                        </h3>

                        <p>
                            <strong>Email:</strong>
                            ${user.email}
                        </p>

                        <p>
                            <strong>Account Created:</strong>
                            ${user.createdAt.toDateString()}
                        </p>

                        <a
                            href="/"
                            class="back"
                        >
                            ← Go Back to Home
                        </a>

                    </div>

                </div>

            </body>

            </html>
        `);

    }

    catch (error) {

        res.status(500).send(`
            <!DOCTYPE html>

            <html>

            <head>

                <title>Error</title>

                ${styles}

            </head>

            <body>

                <div class="page">

                    <div class="container">

                        <h2 class="error">
                            Login Error
                        </h2>

                        <p>
                            ${error.message}
                        </p>

                        <a href="/">
                            ← Go Back
                        </a>

                    </div>

                </div>

            </body>

            </html>
        `);

    }

});


// ============================================
// DISPLAY ALL REGISTERED USERS
// ============================================

app.get("/users", async (req, res) => {

    try {

        // Retrieve all users
        const allUsers = await User.find()
            .sort({ createdAt: -1 });


        // No users
        if (allUsers.length === 0) {

            return res.send(`
                <!DOCTYPE html>

                <html>

                <head>

                    <title>Registered Users</title>

                    ${styles}

                </head>

                <body>

                    <div class="page">

                        <div class="container">

                            <h2>
                                No Users Registered Yet
                            </h2>

                            <a href="/">
                                ← Go Back to Home
                            </a>

                        </div>

                    </div>

                </body>

                </html>
            `);

        }


        // Generate HTML for users
        let userList = "";


        allUsers.forEach((user) => {

            userList += `
                <div class="user">

                    <p>
                        <strong>Username:</strong>
                        ${user.username}
                    </p>

                    <p>
                        <strong>Email:</strong>
                        ${user.email}
                    </p>

                    <p>
                        <strong>Joined:</strong>
                        ${user.createdAt.toDateString()}
                    </p>

                </div>
            `;

        });


        res.send(`
            <!DOCTYPE html>

            <html>

            <head>

                <title>Registered Users</title>

                ${styles}

            </head>

            <body>

                <div class="page">

                    <div class="container">

                        <h1>Registered Users</h1>

                        <p>
                            Total users:
                            <strong>${allUsers.length}</strong>
                        </p>

                        ${userList}

                        <a
                            href="/"
                            class="back"
                        >
                            ← Go Back to Home
                        </a>

                    </div>

                </div>

            </body>

            </html>
        `);

    }

    catch (error) {

        res.status(500).send(`
            <!DOCTYPE html>

            <html>

            <head>

                <title>Error</title>

                ${styles}

            </head>

            <body>

                <div class="page">

                    <div class="container">

                        <h2 class="error">
                            Error Retrieving Users
                        </h2>

                        <p>
                            ${error.message}
                        </p>

                        <a href="/">
                            ← Go Back
                        </a>

                    </div>

                </div>

            </body>

            </html>
        `);

    }

});


// ============================================
// START SERVER
// ============================================

app.listen(PORT, () => {

    console.log(
        `Server running on http://localhost:${PORT}`
    );

});