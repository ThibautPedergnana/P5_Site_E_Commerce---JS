// Récupération orderID
const params = new URL(document.location).searchParams;
const orderId = params.get("orderId");

// Insertion du numéro de commande
document.getElementById("orderId").textContent = orderId;
