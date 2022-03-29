// Initialisation du local storage
let produitLocalStorage = JSON.parse(localStorage.getItem("produit"));
const positionEmptyCart = document.querySelector("#cart__items");

// Si le panier est vide
function getCart() {
  if (produitLocalStorage === null || produitLocalStorage == 0) {
    const emptyCart = `<p>Votre panier est vide</p>`;
    positionEmptyCart.innerHTML = emptyCart;
  } else {
    for (let produit in produitLocalStorage) {
      console.log(produitLocalStorage[produit]);
      // Insertion de l'élément "article"
      let productArticle = document.createElement("article");
      document.querySelector("#cart__items").appendChild(productArticle);
      productArticle.className = "cart__item";
      productArticle.setAttribute(
        "data-id",
        produitLocalStorage[produit].idProduit
      );
      productArticle.setAttribute(
        "data-color",
        produitLocalStorage[produit].couleurProduit
      );

      // Insertion de l'élément "div"
      let productDivImg = document.createElement("div");
      productArticle.appendChild(productDivImg);
      productDivImg.className = "cart__item__img";

      // Insertion de l'image
      let productImg = document.createElement("img");
      productDivImg.appendChild(productImg);
      productImg.src = produitLocalStorage[produit].imgProduit;
      productImg.alt = produitLocalStorage[produit].altImgProduit;

      // Insertion de l'élément "div"
      let productItemContent = document.createElement("div");
      productArticle.appendChild(productItemContent);
      productItemContent.className = "cart__item__content";

      // Insertion de l'élément "div"
      let productItemContentTitlePrice = document.createElement("div");
      productItemContent.appendChild(productItemContentTitlePrice);
      productItemContentTitlePrice.className =
        "cart__item__content__titlePrice";

      // Insertion du titre h2
      let productTitle = document.createElement("h2");
      productItemContentTitlePrice.appendChild(productTitle);
      productTitle.innerHTML = produitLocalStorage[produit].nomProduit;

      // Insertion de la couleur
      let productColor = document.createElement("p");
      productTitle.appendChild(productColor);
      productColor.innerHTML = produitLocalStorage[produit].couleurProduit;

      // Insertion du prix
      let productPrice = document.createElement("p");
      productItemContentTitlePrice.appendChild(productPrice);
      productPrice.innerHTML = produitLocalStorage[produit].prixProduit;

      // Insertion de l'élément "div"
      let productItemContentSettings = document.createElement("div");
      productItemContent.appendChild(productItemContentSettings);
      productItemContentSettings.className = "cart__item__content__settings";

      // Insertion de l'élément "div"
      let productItemContentSettingsQuantity = document.createElement("div");
      productItemContent.appendChild(productItemContentSettingsQuantity);
      productItemContentSettings.className =
        "cart__item__content__settings__quantity";

      // Insertion de Qte
      let productQte = document.createElement("p");
      productItemContentSettingsQuantity.appendChild(productQte);
      productQte.innerHTML = "Qté :";

      // Insertion de l'élément "input"
      let productQuantity = document.createElement("input");
      productItemContentSettingsQuantity.appendChild(productQuantity);
      productQuantity.value = produitLocalStorage[produit].quantiteProduit;
      productQuantity.className = "itemQuantity";
      productQuantity.setAttribute("type", "number");
      productQuantity.setAttribute("min", "1");
      productQuantity.setAttribute("max", "100");
      productQuantity.setAttribute("name", "itemQuantity");

      // Insertion de l'élément "div"
      let productItemContentSettingsDelete = document.createElement("div");
      productItemContentSettings.appendChild(productItemContentSettingsDelete);
      productItemContentSettingsDelete.className =
        "cart__item__content__settings__delete";

      // Instertion de l'élément "p"
      let productSupprimer = document.createElement("p");
      productItemContentSettingsDelete.appendChild(productSupprimer);
      productSupprimer.className = "deleteItem";
      productSupprimer.innerHTML = "Supprimer";
    }
  }
}

function getDataProduct(element) {
  const articleElement = element.closest("article");
  const idProduct = articleElement.getAttribute("data-id");
  const idColor = articleElement.getAttribute("data-color");

  return {
    idProduct: idProduct,
    idColor: idColor,
  };
}

function getTotals() {
  // Récupération de la quantité totale
  let elementsQtt = document.getElementsByClassName("itemQuantity");

  totalPrice = 0;

  for (let element of elementsQtt) {
    const datas = getDataProduct(element);
    let quantity = element.value;

    let ourProduct = produitLocalStorage.find(
      (product) =>
        product.idProduit === datas.idProduct &&
        product.couleurProduit === datas.idColor
    );

    totalPrice += ourProduct.prixProduit * quantity;
  }

  let productTotalPrice = document.getElementById("totalPrice");
  productTotalPrice.innerHTML = totalPrice;
}

getCart();
getTotals();

// Ecouter le changement dans l'input
document.querySelectorAll(".itemQuantity").forEach((item) => {
  item.addEventListener("change", (event) => {
    const datas = getDataProduct(event.target);

    const quantity = event.target.value;

    // Récupérer l'objet que l'on veut modifier
    produitLocalStorage.forEach((product) => {
      if (
        product.idProduit === datas.idProduct &&
        product.couleurProduit === datas.idColor
      ) {
        product.quantiteProduit = +quantity;
        return;
      }
    });
    // Modifier dans le localStorage la quantité de l'objet
    localStorage.setItem("produit", JSON.stringify(produitLocalStorage));

    getTotals();
  });
});

// Ecouter le click sur l'input
document.querySelectorAll(".deleteItem").forEach((item) => {
  item.addEventListener("click", (event) => {
    const articleElement = event.target.closest("article");
    const datas = getDataProduct(event.target);

    // Parcourir l'array récupérer
    const newProducts = produitLocalStorage.filter(
      (product) =>
        product.idProduit != datas.idProduct &&
        product.couleurProduit != datas.idColor
    );

    localStorage.setItem("produit", JSON.stringify(newProducts));
    articleElement.remove();

    //Alerte produit supprimé et refresh
    alert("Ce produit a bien été supprimé du panier");
    location.reload();
  });
});

// Instruction du formulaire
function getForm() {
  let form = document.querySelector(".cart__order__form");

  //Création des expressions régulières
  let emailRegExp = new RegExp(
    "^[a-zA-Z0-9.-]+[@]{1}[a-zA-Z0-9.-]+[.]{1}[a-z]{2,10}$"
  );
  let charRegExp = new RegExp("^[a-zA-Z ,.'-]+$");
  let addressRegExp = new RegExp(
    "^[0-9]{1,3}(?:(?:[,. ]){1}[-a-zA-Zàâäéèêëïîôöùûüç]+)+"
  );

  // Validation du prénom
  form.firstName.addEventListener("change", function () {
    validFirstName(this);
  });

  const validFirstName = function (inputFirstName) {
    let firstNameErrorMsg = inputFirstName.nextElementSibling;

    if (charRegExp.test(inputFirstName.value)) {
      firstNameErrorMsg.innerHTML = "";
    } else {
      firstNameErrorMsg.innerHTML = "Veuillez renseigner votre prénom.";
    }
  };

  // Validation du nom de famille
  form.lastName.addEventListener("change", function () {
    validLastName(this);
  });

  const validLastName = function (inputLastName) {
    let lastNameErrorMsg = inputLastName.nextElementSibling;

    if (charRegExp.test(inputLastName.value)) {
      lastNameErrorMsg.innerHTML = "";
    } else {
      lastNameErrorMsg.innerHTML = "Veuillez renseigner votre nom de famille.";
    }
  };

  // Validation de l'addresse
  form.address.addEventListener("change", function () {
    validAddress(this);
  });

  const validAddress = function (inputAddress) {
    let addressErrorMsg = inputAddress.nextElementSibling;

    if (addressRegExp.test(inputAddress.value)) {
      addressErrorMsg.innerHTML = "";
    } else {
      addressErrorMsg.innerHTML = "Veuillez renseigner votre addresse.";
    }
  };

  // Validation de la ville
  form.city.addEventListener("change", function () {
    validCity(this);
  });

  const validCity = function (inputCity) {
    let cityErrorMsg = inputCity.nextElementSibling;

    if (charRegExp.test(inputCity.value)) {
      cityErrorMsg.innerHTML = "";
    } else {
      cityErrorMsg.innerHTML = "Veuillez renseigner votre ville.";
    }
  };

  // Validation de l'adresse mail
  form.email.addEventListener("change", function () {
    validEmail(this);
  });

  const validEmail = function (inputEmail) {
    let emailErrorMsg = inputEmail.nextElementSibling;

    if (emailRegExp.test(inputEmail.value)) {
      emailErrorMsg.innerHTML = "";
    } else {
      emailErrorMsg.innerHTML = "Veuillez renseigner votre email.";
    }
  };
}
getForm();

function postForm() {
  const btn_commander = document.getElementById("order");

  // Ecouter le panier
  btn_commander.addEventListener("click", () => {
    // Récupération des coordonnées du client
    let inputFirstName = document.getElementById("firstName");
    let inputLastName = document.getElementById("lastName");
    let inputAddress = document.getElementById("address");
    let inputCity = document.getElementById("city");
    let inputEmail = document.getElementById("email");

    let idProducts = [];
    for (let i = 0; i < produitLocalStorage.length; i++) {
      idProducts.push(produitLocalStorage[i].idProduit);
    }

    const order = {
      contact: {
        firstName: inputFirstName.value,
        lastName: inputLastName.value,
        address: inputAddress.value,
        city: inputCity.value,
        email: inputEmail.value,
      },
      products: idProducts,
    };

    fetch("http://localhost:3000/api/products/order", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(order),
    })
      .then((res) => {
        return res.json();
      })
      .then((confirm) => {
        window.location.href = "./confirmation.html?orderId=" + confirm.orderID;
        localStorage.clear();
      })
      .catch((err) => {
        alert("Problème avec fetch : " + err.message);
      });
  });
}
postForm();
