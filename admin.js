// Admin Panel Functions

// View Users
document.getElementById("view-users").addEventListener("click", async () => {
    const usersRef = firebase.firestore().collection("users");
    const snapshot = await usersRef.get();
    let output = "<h2>Users</h2><ul>";
    snapshot.forEach(doc => {
        output += `<li>${doc.data().name} - ${doc.data().email}</li>`;
    });
    output += "</ul>";
    document.getElementById("admin-data").innerHTML = output;
});

// View Products
document.getElementById("view-products").addEventListener("click", async () => {
    const productsRef = firebase.firestore().collection("products");
    const snapshot = await productsRef.get();
    let output = "<h2>Products</h2><ul>";
    snapshot.forEach(doc => {
        output += `<li>${doc.data().name} - ${doc.data().price}</li>`;
    });
    output += "</ul>";
    document.getElementById("admin-data").innerHTML = output;
});
