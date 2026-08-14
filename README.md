# Login Authentication System

A simple client-side authentication system built with **HTML5, CSS3, Vanilla JavaScript, and localStorage**. The application provides user registration, login validation, protected dashboard access, and logout functionality.

Passwords are processed using **SHA-256 hashing** before being stored, so plain-text passwords are not saved in `localStorage`.

## Features

* User registration with username and email
* Password validation
* Minimum 8-character password requirement
* At least 1 number required in the password
* Duplicate username and email detection
* Login using username or email
* Credential validation
* Generic login error message for invalid credentials
* Protected dashboard page
* Automatic redirect to login when no active session exists
* Logout functionality
* Session management using `localStorage`
* SHA-256 password hashing
* Basic form validation
* Empty-field validation
* Responsive user interface

## Technologies Used

* HTML5
* CSS3
* JavaScript (Vanilla)
* Web Crypto API
* `localStorage`

## Project Structure

```text
Login-Authentication-System/
│
├── index.html
├── login.html
├── register.html
├── dashboard.html
├── style.css
├── auth.js
├── README.md
├── .gitignore
└── LICENSE
```

## Authentication Flow

The application follows a simple client-side authentication flow:

```text
Register
   ↓
Validate User Input
   ↓
Check Duplicate Username/Email
   ↓
Hash Password with SHA-256
   ↓
Store User Information in localStorage
   ↓
Login
   ↓
Verify Username/Email + Password
   ↓
Create Session
   ↓
Dashboard
   ↓
Logout
   ↓
Clear Session
   ↓
Login Page
```

## Registration

Users provide:

* Username
* Email address
* Password
* Password confirmation

The registration form validates that required fields are not empty. The password must contain at least **8 characters and 1 number**.

Duplicate username and email addresses are also checked before a new account is created.

## Password Security

Passwords are **not stored as plain text**.

Before storing a registered password, the application uses the browser's Web Crypto API to generate a SHA-256 hash. Only the resulting password hash is stored in `localStorage`.

Example flow:

```text
User Password
      ↓
SHA-256 Hash
      ↓
Password Hash
      ↓
localStorage
```

> **Note:** This is an educational front-end authentication project. Client-side authentication using `localStorage` and SHA-256 is not suitable for production applications. A real authentication system should use a secure backend, proper password hashing such as Argon2 or bcrypt, HTTPS, secure cookies, and server-side session management.

## Login

Users can log in using either:

* Username
* Email

The entered password is hashed and compared with the stored password hash.

For incorrect credentials, the application displays a generic message rather than indicating whether the username/email or password was incorrect.

Example:

```text
Invalid username/email or password.
```

This avoids revealing which specific credential was incorrect.

## Protected Dashboard

The dashboard is protected by checking whether an active login session exists.

If the user attempts to open the dashboard without a valid session, they are redirected to the login page.

After successful authentication, the session stores basic user information such as:

* Username
* Email
* Login time

## Logout

The logout button clears the active session from `localStorage` and redirects the user back to the login page.

## Validation

The application performs basic validation for:

* Empty username
* Empty email
* Invalid email format
* Empty password
* Password length
* Password number requirement
* Password confirmation
* Duplicate username
* Duplicate email
* Empty login fields
* Invalid login credentials

## How to Run

No additional installation or dependencies are required.

### 1. Clone the Repository

```bash
git clone https://github.com/Susheel929/OIBSIP-WebDev-L2-Login-Authentication-System-
```

### 2. Open the Project

```bash
cd login-authentication-system
```

### 3. Run the Application

Open `register.html` in a modern web browser and create an account.

You can also use the **Live Server** extension in Visual Studio Code.

## Browser Compatibility

The project is designed for modern browsers that support:

* JavaScript ES6+
* Web Crypto API
* localStorage

Recommended browsers include:

* Google Chrome
* Microsoft Edge
* Mozilla Firefox
* Safari

## Future Improvements

* Backend authentication
* Database integration
* Secure server-side sessions
* Password reset functionality
* Email verification
* Multi-factor authentication
* Account profile management
* Secure HTTP-only cookies
* Production-grade password hashing

## Author

**Gaddam Susheel Kumar**

B.Tech Information Technology Student

## License

This project is licensed under the **MIT License**.

See the `LICENSE` file for details.
