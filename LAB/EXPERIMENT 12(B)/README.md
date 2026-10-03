# Experiment 12(B) - State Management Using Sessions and Cookies

## Objective

To understand state management in web applications and implement sessions
and cookies using Node.js and Express.

## Technologies Used

- Node.js
- Express.js
- express-session
- cookie-parser
- HTML

## Description

HTTP is a stateless protocol, meaning that individual requests do not
automatically retain information about previous requests.

This experiment demonstrates how sessions and cookies can be used to
maintain state across multiple HTTP requests.

The application allows a user to enter a username, stores the username
in an Express session, creates a sample theme cookie, retrieves session
and cookie information, and destroys the session during logout.

## Installation

Install the dependencies:

```bash
npm install