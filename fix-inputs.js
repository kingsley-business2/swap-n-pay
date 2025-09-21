// Helper function to show messages in the toast
function showMessage(text, type = "info") {
  const messageBox = document.getElementById("messageBox");
  const messageText = document.getElementById("messageText");
  const closeBtn = document.getElementById("messageClose");

  if (messageBox && messageText) {
    messageText.textContent = text;
    messageText.className = "alert alert-" + type + " flex justify-between items-center";

    messageBox.classList.remove("hidden");

    // Auto-hide after 3 seconds
    const hideTimeout = setTimeout(() => {
      messageBox.classList.add("hidden");
    }, 3000);

    // Manual close
    if (closeBtn) {
      closeBtn.onclick = () => {
        clearTimeout(hideTimeout);
        messageBox.classList.add("hidden");
      };
    }
  } else {
    alert(text); // fallback if toast not found
  }
}

// Ensure login form works properly
const loginForm = document.getElementById("login-form");
if (loginForm) {
  loginForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    const email = document.getElementById("login-email").value.trim();
    const password = document.getElementById("login-password").value.trim();

    try {
      await firebase.auth().signInWithEmailAndPassword(email, password);
      document.getElementById("login-modal").classList.add("hidden");
      showMessage("Login successful ✅", "success");
    } catch (error) {
      showMessage("Login failed: " + error.message, "error");
    }
  });
}

// Ensure signup form works properly
const signupForm = document.getElementById("signup-form");
if (signupForm) {
  signupForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    const name = document.getElementById("signup-name").value.trim();
    const email = document.getElementById("signup-email").value.trim();
    const phone = document.getElementById("signup-phone").value.trim();
    const password = document.getElementById("signup-password").value.trim();
    const confirmPassword = document.getElementById("signup-confirm-password").value.trim();

    if (password !== confirmPassword) {
      showMessage("Passwords do not match ❌", "error");
      return;
    }

    try {
      const userCredential = await firebase.auth().createUserWithEmailAndPassword(email, password);
      await firebase.firestore().collection("users").doc(userCredential.user.uid).set({
        name,
        email,
        phone
      });
      document.getElementById("signup-modal").classList.add("hidden");
      showMessage("Signup successful 🎉", "success");
    } catch (error) {
      showMessage("Signup failed: " + error.message, "error");
    }
  });
}
