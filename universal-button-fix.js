// Universal Button Fix

document.querySelectorAll("button").forEach((btn) => {
    btn.addEventListener("click", () => {
        console.log(`${btn.innerText} clicked`);
    });
});
