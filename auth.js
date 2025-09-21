// Firebase Authentication Logic

// Sign Up
document.getElementById("signup-form")?.addEventListener("submit", async (e) => {
    e.preventDefault();
    const email = document.getElementById("signup-email").value;
    const password = document.getElementById("signup-password").value;
    try {
        await firebase.auth().createUserWithEmailAndPassword(email, password);
        showMessage("Signup successful 🎉");
    } catch (error) {
        showMessage("Error: " + error.message);
    }
});

// Login
document.getElementById("login-form")?.addEventListener("submit", async (e) => {
    e.preventDefault();
    const email = document.getElementById("login-email").value;
    const password = document.getElementById("login-password").value;
    try {
        await firebase.auth().signInWithEmailAndPassword(email, password);
        showMessage("Login successful 🎉");
    } catch (error) {
        showMessage("Error: " + error.message);
    }
});

// Logout
document.getElementById("logout-btn")?.addEventListener("click", async () => {
    try {
        await firebase.auth().signOut();
        showMessage("Logged out ✅");
    } catch (error) {
        showMessage("Error: " + error.message);
    }
});
