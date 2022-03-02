let str = window.location.href;
let url = new URL(str);
let idProduct = url.searchParams.get("id");

let article = "";

const colorPicked = document.querySelector("#colors");
const quantityPicked = document.querySelector("#quantity");

getArticle();

// Récupération des articles de l'API
function getArticle() {
  fetch("http://localhost:3000/api/products/" + idProduct)
    .then((res) => {
      return res.json();
    })

    .then(async function (resultatAPI) {
      article = await resultatAPI;
      if (article) {
        getPost(article);
      }
    })

    .catch((error) => {
      console.log("Erreur de la requête");
    });
}

function getPost(article) {
  // Insertion de l'image
  let productImg = document.createElement("img");
  document.querySelector(".item__img").appendChild(productImg);
  productImg.src = article.imageUrl;
  productImg.alt = article.altTxt;

  // Modification du titre "h1"
  let productName = document.getElementById("title");
  productName.innerHTML = article.name;

  // Modification du prix
  let productPrice = document.getElementById("price");
  productPrice.innerHTML = article.price;

  // Modification de la description
  let productDescription = document.getElementById("description");
  productDescription = article.description;

  // Insertion des options de couleurs
  for (let colors of article.colors) {
    console.table(colors);
    let productColors = document.createElement("option");
    document.querySelector("#colors").appendChild(productColors);
    productColors.value = colors;
    productColors.innerHTML = colors;
  }
  addToCart(article);
}

// Ajouter au panier
function addToCart(article) {
  const btn_envoyerPanier = document.querySelector("#addToCart");

  // Valider les conditions d'ajout au panier
  btn_envoyerPanier.addEventListener("click", (event) => {
    if (quantityPicked.value > 0 && quantityPicked.value <= 100) {
      // Choix de couleur
      let choixCouleur = colorPicked.value;

      // Choix de la quantité
      let choixQuantite = quantityPicked.value;

      let optionsProduit = {
        idProduit: idProduct,
        couleurProduit: choixCouleur,
        quantiteProduit: Number(choixQuantite),
        nomProduit: article.name,
        prixProduit: article.price,
        descriptionProduit: article.description,
        imgProduit: article.imageUrl,
        altImgProduit: article.altTxt,
      };
      // Initialisation du local storage
      let produitLocalStorage = JSON.parse(localStorage.getItem("produit"));

      // Fenêtre pop-up
      const popupConfirmation = () => {
        if (
          window.confirm(`Votre commande de ${choixQuantite} ${article.name} ${choixCouleur} est ajoutée au panier
        Pour consulter votre panier, cliquez sur OK`)
        ) {
          window.location.href = "cart.html";
        }
      };

      // Importer dans le local storage
      // Si le panier comporte déjà au moins 1 article
      if (produitLocalStorage) {
        const resultFind = produitLocalStorage.find(
          (el) =>
            el.idProduit === idProduct && el.couleurProduit === choixCouleur
        );
        // Si le produit commandé est déjà dans le panier
        if (resultFind) {
          // Si le produit n'est pas dans le panier
          let newQuantite =
            parseInt(optionsProduit.quantiteProduit) +
            parseInt(resultFind.quantiteProduit);
          resultFind.quantiteProduit = newQuantite;
          localStorage.setItem("produit", JSON.stringify(produitLocalStorage));
          popupConfirmation();
        } else {
          produitLocalStorage.push(optionsProduit);
          localStorage.setItem("produit", JSON.stringify(produitLocalStorage));
          popupConfirmation();
        }
        // Si le panier est vide
      } else {
        produitLocalStorage = [];
        produitLocalStorage.push(optionsProduit);
        localStorage.setItem("produit", JSON.stringify(produitLocalStorage));
        console.table(produitLocalStorage);
        popupConfirmation();
      }
    }
  });
}
