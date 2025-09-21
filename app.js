// General App Functions
console.log("Swap N Pay App Loaded");

// Example of showing a message
function showMessage(message) {
    const box = document.getElementById("messageBox");
    const text = document.getElementById("messageText");
    text.innerText = message;
    box.classList.remove("hidden");

    // Auto-hide after 5 seconds
    setTimeout(() => {
        box.classList.add("hidden");
    }, 5000);
}
