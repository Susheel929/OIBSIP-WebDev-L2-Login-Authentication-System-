/* ============================================================
   auth.js — shared client-side authentication logic
   Uses localStorage as a mock database.
   Passwords are hashed with SHA-256 (Web Crypto API) before
   ever being stored — plain text passwords are never saved.
   ============================================================ */

const USERS_KEY = "auth_users";       // localStorage key for registered users
const SESSION_KEY = "auth_session";   // localStorage key for the logged-in session

/* ---------- Utilities ---------- */

// Hash a string using SHA-256 and return a hex string
async function sha256(text) {
  const encoder = new TextEncoder();
  const data = encoder.encode(text);
  const hashBuffer = await crypto.subtle.digest("SHA-256", data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map((b) => b.toString(16).padStart(2, "0")).join("");
}

function getUsers() {
  const raw = localStorage.getItem(USERS_KEY);
  return raw ? JSON.parse(raw) : [];
}

function saveUsers(users) {
  localStorage.setItem(USERS_KEY, JSON.stringify(users));
}

function findUserByIdentifier(identifier) {
  const users = getUsers();
  const lower = identifier.trim().toLowerCase();
  return users.find(
    (u) => u.username.toLowerCase() === lower || u.email.toLowerCase() === lower
  );
}

function setSession(user) {
  const session = {
    username: user.username,
    email: user.email,
    loginAt: new Date().toISOString(),
  };
  localStorage.setItem(SESSION_KEY, JSON.stringify(session));
}

function getSession() {
  const raw = localStorage.getItem(SESSION_KEY);
  return raw ? JSON.parse(raw) : null;
}

function clearSession() {
  localStorage.removeItem(SESSION_KEY);
}

/* ---------- Validation helpers ---------- */

function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

// At least 8 characters, at least 1 number
function isValidPassword(password) {
  const hasMinLength = password.length >= 8;
  const hasNumber = /\d/.test(password);
  return hasMinLength && hasNumber;
}

function showAlert(el, message, type = "error") {
  el.textContent = message;
  el.className = "alert show " + (type === "error" ? "alert-error" : "alert-success");
}

function hideAlert(el) {
  el.classList.remove("show");
  el.textContent = "";
}

function setFieldError(el, message) {
  el.textContent = message || "";
}

/* ============================================================
   REGISTRATION PAGE LOGIC
   ============================================================ */

function initRegisterPage() {
  const form = document.getElementById("registerForm");
  if (!form) return;

  const usernameInput = document.getElementById("username");
  const emailInput = document.getElementById("email");
  const passwordInput = document.getElementById("password");
  const confirmInput = document.getElementById("confirmPassword");

  const usernameError = document.getElementById("usernameError");
  const emailError = document.getElementById("emailError");
  const passwordError = document.getElementById("passwordError");
  const confirmError = document.getElementById("confirmError");
  const alertBox = document.getElementById("alertBox");

  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    hideAlert(alertBox);

    const username = usernameInput.value.trim();
    const email = emailInput.value.trim();
    const password = passwordInput.value;
    const confirmPassword = confirmInput.value;

    let hasError = false;

    // Reset field errors
    setFieldError(usernameError, "");
    setFieldError(emailError, "");
    setFieldError(passwordError, "");
    setFieldError(confirmError, "");

    // No empty submissions
    if (!username) {
      setFieldError(usernameError, "Username is required.");
      hasError = true;
    }

    if (!email) {
      setFieldError(emailError, "Email is required.");
      hasError = true;
    } else if (!isValidEmail(email)) {
      setFieldError(emailError, "Please enter a valid email address.");
      hasError = true;
    }

    if (!password) {
      setFieldError(passwordError, "Password is required.");
      hasError = true;
    } else if (!isValidPassword(password)) {
      setFieldError(
        passwordError,
        "Password must be at least 8 characters and include at least 1 number."
      );
      hasError = true;
    }

    if (!confirmPassword) {
      setFieldError(confirmError, "Please confirm your password.");
      hasError = true;
    } else if (password && confirmPassword !== password) {
      setFieldError(confirmError, "Passwords do not match.");
      hasError = true;
    }

    if (hasError) return;

    // Duplicate check (username OR email)
    const users = getUsers();
    const usernameTaken = users.some(
      (u) => u.username.toLowerCase() === username.toLowerCase()
    );
    const emailTaken = users.some(
      (u) => u.email.toLowerCase() === email.toLowerCase()
    );

    if (usernameTaken || emailTaken) {
      showAlert(
        alertBox,
        "An account with that username or email already exists.",
        "error"
      );
      return;
    }

    // Hash password before storing — never store plain text
    const passwordHash = await sha256(password);

    users.push({
      username,
      email,
      passwordHash,
      createdAt: new Date().toISOString(),
    });
    saveUsers(users);

    showAlert(alertBox, "Account created successfully! Redirecting to login...", "success");
    form.reset();

    setTimeout(() => {
      window.location.href = "login.html";
    }, 1200);
  });
}

/* ============================================================
   LOGIN PAGE LOGIC
   ============================================================ */

function initLoginPage() {
  const form = document.getElementById("loginForm");
  if (!form) return;

  const identifierInput = document.getElementById("identifier");
  const passwordInput = document.getElementById("password");
  const identifierError = document.getElementById("identifierError");
  const passwordError = document.getElementById("passwordError");
  const alertBox = document.getElementById("alertBox");

  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    hideAlert(alertBox);

    const identifier = identifierInput.value.trim();
    const password = passwordInput.value;

    let hasError = false;
    setFieldError(identifierError, "");
    setFieldError(passwordError, "");

    if (!identifier) {
      setFieldError(identifierError, "Username or email is required.");
      hasError = true;
    }
    if (!password) {
      setFieldError(passwordError, "Password is required.");
      hasError = true;
    }
    if (hasError) return;

    const user = findUserByIdentifier(identifier);
    const passwordHash = await sha256(password);

    // Generic error message — never reveal which field was wrong
    if (!user || user.passwordHash !== passwordHash) {
      showAlert(alertBox, "Invalid username/email or password.", "error");
      return;
    }

    setSession(user);
    window.location.href = "dashboard.html";
  });
}

/* ============================================================
   DASHBOARD PAGE LOGIC
   ============================================================ */

function initDashboardPage() {
  const dashboardRoot = document.getElementById("dashboardRoot");
  if (!dashboardRoot) return;

  const session = getSession();

  // Redirect to login if no active session
  if (!session) {
    window.location.href = "login.html";
    return;
  }

  const usernameDisplay = document.getElementById("usernameDisplay");
  const emailDisplay = document.getElementById("emailDisplay");
  const loginTimeDisplay = document.getElementById("loginTimeDisplay");

  if (usernameDisplay) usernameDisplay.textContent = session.username;
  if (emailDisplay) emailDisplay.textContent = session.email;
  if (loginTimeDisplay) {
    loginTimeDisplay.textContent = new Date(session.loginAt).toLocaleString();
  }

  const logoutBtn = document.getElementById("logoutBtn");
  if (logoutBtn) {
    logoutBtn.addEventListener("click", () => {
      clearSession();
      window.location.href = "login.html";
    });
  }
}

/* ---------- Init on load ---------- */
document.addEventListener("DOMContentLoaded", () => {
  initRegisterPage();
  initLoginPage();
  initDashboardPage();
});
