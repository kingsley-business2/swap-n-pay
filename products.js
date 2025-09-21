// Products Logic

async function loadProducts() {
    const productsRef = firebase.firestore().collection("products");
    const snapshot = await productsRef.get();
    let output = "<h2>Available Products</h2><ul>";
    snapshot.forEach(doc => {
        output += `<li>${doc.data().name} - ${doc.data().price}</li>`;
    });
    output += "</ul>";
    document.getElementById("products-view").innerHTML = output;
}

// Load products on page load
window.addEventListener("DOMContentLoaded", loadProducts);
