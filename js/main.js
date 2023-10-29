
async function getApi() {
  try {
    const data = await fetch("https://ecommercebackend.fundamentos-29.repl.co/");
    const res = await data.json();
    window.localStorage.setItem("products", JSON.stringify(res));
    return res;
  } catch(error) {
    console.log(error);
  };
}

function events() {

  const animation = document.querySelector(".animation");
  const header__button_cart = document.querySelector(".header__button_cart");
  const cart__modal = document.querySelector(".cart__modal");
  const cart = document.querySelector(".cart");
  const cart_header_close = document.querySelector(".cart_header_close");

  setTimeout(() => {
    animation.style.display = "none"
  }, 5000);

  header__button_cart.addEventListener("click", () => {
    cart__modal.style.display = "flex";
    setTimeout(() => {
    cart__modal.style.backgroundColor = "rgba(0, 0, 0, 0.5)";
    cart.style.right = 0;
    }, 1);
  });

  cart_header_close.addEventListener("click", () => {
    cart__modal.style.backgroundColor = "rgba(0, 0, 0, 0)";
    cart.style.right = "-390px";
    setTimeout(() => {
      cart__modal.style.display = "none";
      }, 200);
  });

}

function printProducts(db) {
  const productsHTML = document.querySelector(".section_2__products_container");
  let html = "";
  for (const product of db.products) {
    html += `
      <article class="section_2__product">
        <div class="section_2__product_container_img">
        <img id="${product.id}" class="section_2__product_show" src="./img/icon_show.svg" alt="Product image">
          <img class="section_2__product_img" src="${product["image"]}" alt="Product image">
          <button id="${product.id}" class="section_2_product_button_1 add_button">Add to cart</button>
        </div>
        <div class="section_2__product_description">
          <div class="section_2__product_details">
            <p class="section_2__product_price">Price: $${product["price"]}</p>
            <p class="section_2__product_quantity">Stock: ${product["quantity"]}</p>
          </div>
          <h3 class="section_2__product_name">${product["name"]}</h3>
          <button id="${product.id}" class="section_2_product_button_2 add_button">Add to cart</button>
        </div>
      </article>
    `;
  }
  productsHTML.innerHTML = html;
}

function addToCart(db) {
  const productsHTML = document.querySelector('.section_2__products_container');
  productsHTML.addEventListener("click", function (event){
    if (event.target.classList.contains("add_button")) {
      const id = Number(event.target["id"]);
      const productFind = db.products.find (function(product) {
        return product["id"] === id;
      });
      if (db.cart[productFind["id"]]) {
        db.cart[productFind["id"]].amount++;
      } else {
        productFind.amount = 1;
        db.cart[productFind["id"]] = productFind;
      }
      window.localStorage.setItem("cart", JSON.stringify(db.cart));
      printToCart(db);
      totalCart(db);
    }

  });
}

function printToCart(db) {
  const cart_products = document.querySelector(".cart__main");
  let html = "";
  for (const product in db.cart) {
    const { quantity, price, name, image, id, amount } = db.cart[product];
    html += `
    <div class="cart__product_container">
      <article class="cart__product">
        <img class="cart__product_image" src="${image}" alt="product">
        <div class="cart__product_name">
            <h3 class="h3">${name}</h3>
            <div class="cart__product_details">
              <div class="cart__product_price">
                <small class="cart__product_small">Precio</small>
                <p class="cart__p">$${price}</p>
              </div>
              <div class="cart__product_subtotal">
                <small class="cart__product_small">Subtotal</small>
                <p class="cart__p">$${price * amount}</p>
              </div>
            </div>
        </div>
      </article>
      <div class="cart__product_amount">
        <p id=${id} class="cart__p cart__p_amount"><b class="b less">-</b><span class="span">${amount}</span><b class="b plus">+</b></p>
        <button id=${id} class="cart__delete_button"><img class="icon_button delete" src="./img/icon_trash.svg" alt="icon"></button>
      </div>
    </div>
    `;
  }
  cart_products.innerHTML = html;
}

function handleCart(db) {
  const cart_products = document.querySelector(".cart__main");
  cart_products.addEventListener("click", function(event) {
    if (event.target.classList.contains("plus")) {
      const id = Number(event.target.parentElement.id);
      const productFind = db.products.find(function(product) {
        return product.id === id;
      });
      if (db.cart[productFind.id]) {
        if (productFind.quantity === db.cart[productFind.id].amount) {
          return alert("Se ha superado la cantidad actual de productos disponibles en stock");
        }
      }
      db.cart[id].amount++;
    }
    if (event.target.classList.contains("less")) {
      const id = Number(event.target.parentElement.id);
      if (db.cart[id].amount === 1) {
        const response = confirm("¿Estás seguro de querer eliminar este producto?");
        if (!response) {
          return;
        }
        delete db.cart[id];
      } else {
        db.cart[id].amount--;
      }
    }
    if (event.target.classList.contains("delete")) {
      const id = Number(event.target.parentElement.id);
      const response = confirm("¿Estás seguro de querer eliminar este producto?");
      if (!response) {
        return;
      }
      delete db.cart[id];
    }
    window.localStorage.setItem("cart", JSON.stringify(db.cart));
    printToCart(db);
    totalCart(db);
  });
}

function totalCart(db) {
  const number = document.querySelector(".number");
  const info_total = document.querySelector(".cart__footer_info_total");
  const info_amount = document.querySelector(".cart__footer_info_amount");
  
  let totalProducts = 0;
  let amountProducts = 0;

  for ( const product in db.cart) {
    totalProducts += (db.cart[product].amount * db.cart[product].price);
    amountProducts += db.cart[product].amount;
  }

  number.textContent = amountProducts;
  info_total.textContent = "Total $ "+ totalProducts;
  info_amount.textContent = "Cantidad: "+ amountProducts;
}

function buyCart(db) {
  const btnBuy = document.querySelector(".cart__footer_button_buy");
  btnBuy.addEventListener("click", function() {
    if (!Object.keys(db.cart).length) {
      return alert("Aún no tienes productos en tu carrito");
    }
    const response = confirm("¿Seguro que quieres realizar esta acción?");
      if (!response) {
        return;
      }
      for (const product of db.products) {
        const cartProduct = db.cart[product.id];
          if (product.id === cartProduct?.id) {
            product.quantity -= cartProduct.amount;
          }
      }
      db.cart = {};
      window.localStorage.setItem("products", JSON.stringify(db.products));
      window.localStorage.setItem("cart", JSON.stringify(db.cart));
      printProducts(db);
      printToCart(db);
      totalCart(db);
  });
}

function deleteCart(db) {
  const btnBuy = document.querySelector(".cart__footer_button_delete");
  btnBuy.addEventListener("click", function() {
    if (!Object.keys(db.cart).length) {
      return alert("Aún no tienes productos en tu carrito");
    }
    const response = confirm("¿Seguro que quieres realizar esta acción?");
      if (!response) {
        return;
      }
      db.cart = {};
      window.localStorage.setItem("products", JSON.stringify(db.products));
      window.localStorage.setItem("cart", JSON.stringify(db.cart));
      printProducts(db);
      printToCart(db);
      totalCart(db);
  });
}

function handleList(db) {

  const category = document.querySelectorAll(".category");
  
  function allProducts() {
    category[4].style.borderBottom = "2px solid #eb4a5a"
    category[5].style.borderBottom = "2px solid #00000000"
    category[6].style.borderBottom = "2px solid #00000000"
    category[7].style.borderBottom = "2px solid #00000000"
    printProducts(db);
  }

  function shirt() {
    category[4].style.borderBottom = "2px solid #00000000"
    category[5].style.borderBottom = "2px solid #eb4a5a"
    category[6].style.borderBottom = "2px solid #00000000"
    category[7].style.borderBottom = "2px solid #00000000"
    const productsHTML = document.querySelector(".section_2__products_container");
    let html ="";
    for (const product of db.products) {
      if (product.category === "shirt") {
        html += `
          <article class="section_2__product">
            <div class="section_2__product_container_img">
            <img id="${product.id}" class="section_2__product_show" src="./img/icon_show.svg" alt="Product image">
              <img class="section_2__product_img" src="${product["image"]}" alt="Product image">
              <button id="${product.id}" class="section_2_product_button_1 add_button">Add to cart</button>
            </div>
            <div class="section_2__product_description">
              <div class="section_2__product_details">
                <p class="section_2__product_price">Price: $${product["price"]}</p>
                <p class="section_2__product_quantity">Stock: ${product["quantity"]}</p>
              </div>
              <h3 class="section_2__product_name">${product["name"]}</h3>
              <button id="${product.id}" class="section_2_product_button_2 add_button">Add to cart</button>
            </div>
          </article>
        `;
      }
    }
    productsHTML.innerHTML = html;
  }

  function hoddie() {
    category[4].style.borderBottom = "2px solid #00000000"
    category[5].style.borderBottom = "2px solid #00000000"
    category[6].style.borderBottom = "2px solid #eb4a5a"
    category[7].style.borderBottom = "2px solid #00000000"
    const productsHTML = document.querySelector(".section_2__products_container");
    let html ="";
    for (const product of db.products) {
      if (product.category === "hoddie") {
        html += `
          <article class="section_2__product">
            <div class="section_2__product_container_img">
            <img id="${product.id}" class="section_2__product_show" src="./img/icon_show.svg" alt="Product image">
              <img class="section_2__product_img" src="${product["image"]}" alt="Product image">
              <button id="${product.id}" class="section_2_product_button_1 add_button">Add to cart</button>
            </div>
            <div class="section_2__product_description">
              <div class="section_2__product_details">
                <p class="section_2__product_price">Price: $${product["price"]}</p>
                <p class="section_2__product_quantity">Stock: ${product["quantity"]}</p>
              </div>
              <h3 class="section_2__product_name">${product["name"]}</h3>
              <button id="${product.id}" class="section_2_product_button_2 add_button">Add to cart</button>
            </div>
          </article>
        `;
      }
    }
    productsHTML.innerHTML = html;
  }

  function sweater() {
    category[4].style.borderBottom = "2px solid #00000000"
    category[5].style.borderBottom = "2px solid #00000000"
    category[6].style.borderBottom = "2px solid #00000000"
    category[7].style.borderBottom = "2px solid #eb4a5a"
    const productsHTML = document.querySelector(".section_2__products_container");
    let html ="";
    for (const product of db.products) {
      if (product.category === "sweater") {
        html += `
          <article class="section_2__product">
            <div class="section_2__product_container_img">
            <img id="${product.id}" class="section_2__product_show" src="./img/icon_show.svg" alt="Product image">
              <img class="section_2__product_img" src="${product["image"]}" alt="Product image">
              <button id="${product.id}" class="section_2_product_button_1 add_button">Add to cart</button>
            </div>
            <div class="section_2__product_description">
              <div class="section_2__product_details">
                <p class="section_2__product_price">Price: $${product["price"]}</p>
                <p class="section_2__product_quantity">Stock: ${product["quantity"]}</p>
              </div>
              <h3 class="section_2__product_name">${product["name"]}</h3>
              <button id="${product.id}" class="section_2_product_button_2 add_button">Add to cart</button>
            </div>
          </article>
        `;
      }
    }
    productsHTML.innerHTML = html;
  }
  
  category[0].addEventListener("click", allProducts);

  category[1].addEventListener("click", shirt);

  category[2].addEventListener("click", hoddie);

  category[3].addEventListener("click", sweater);

  category[4].addEventListener("click", allProducts);

  category[5].addEventListener("click", shirt);

  category[6].addEventListener("click", hoddie);

  category[7].addEventListener("click", sweater);

  category[4].style.borderBottom = "2px solid #eb4a5a"

}

function modalProduct(db) {
  const productsHTML = document.querySelector(".section_2__products_container");
  const modal = document.querySelector(".modal");
  const modal__product = document.querySelector(".modal__product");
  
  productsHTML.addEventListener("click", function (event){
    if (event.target.classList.contains("section_2__product_show")) {
      const id = Number(event.target["id"]);
      const productFind = db.products.find (function(product) {
        return product["id"] === id;
      });
      modal__product.innerHTML = `
        <img class="modal__product_close" src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACgAAAAoCAYAAACM/rhtAAABv0lEQVRYR+2WrU5EMRCFu2CRkCARCCQgYC0OBD+WpwHeBFgBAsEbrOEhgBBYgSDBIvk7B9pQmsJ07tzsXdGbzKa505l+e6Zz256b8Kc34XyuAlorVBWsCloVsMbXPdiFggtY9BH2qlx83s9/0sRpS7yE5EPYFWxfAUm44dex8OE28FsMqQEMcEGJi0LIbzjnGM/nGlYMqQHsI/EBbDMq0THGR7DRH2Vb9jF7kf/cxxBUfDSATKaBNMNxQS1gKWQrcE0BGZfuK74Le3IW43jP0cem2oK9iDVNJjRRMKTIQV7CyWYIDWGCsygYIHN7MtZA1RA5dS0KSpBmuDYUZI512CEs/vzwPQH5/ka77+L5VgXXPAQbIPecef9tU0gLYK5J2K3s4s6bJAs3h0/Js3MzAOz0M7Pqy7YdlS1tiFx3D3zcvabc2hKv+EV2fhaZAtw7z+P0bM1Bnvr4h1JIDSCPL3bl7j/Kpev2p3HBePvd4Sc+z6gEUgOYXrdKj6+xXbf4hwPkHcaaszVAMkfxXZCTNQqGiixiwBux9uAfy5W/ZNu0OqeJgq0CSMkqoKSQ5K8KSgpJ/qqgpJDkrwpKCkn+T0bkYileIkhuAAAAAElFTkSuQmCC"/>
        <img class="modal__product_img" src="${productFind["image"]}" alt="">
        <div class="modal__product_details">
            <p class="modal__product_price">$${productFind["price"]}</p><p class="modal__product_stock">Stock: ${productFind["quantity"]}</p>
            <p class="modal__product_name">${productFind["name"]}</p>
            <p class="modal__product_description">${productFind["description"]}</p>
        </div>
      `;

      modal.style.display = "flex";
      setTimeout(() => {
        modal.style.opacity = 1;
      }, 1);
      
      const modal__product_close = document.querySelector(".modal__product_close");
      modal__product_close.addEventListener("click", () => {
        modal.style.opacity = 0;
        setTimeout(() => {
          modal.style.display = "none";
        }, 200);
      });

    }

  });

}

async function main() {

  const db = {
    products: JSON.parse(window.localStorage.getItem("products")) || await getApi(),
    cart: JSON.parse(window.localStorage.getItem("cart")) || {}
  }

  // Se ejecutan los eventos
  events();
  // Imprimimos en la página los productos
  printProducts(db);
  // Se adicionan los productos al carrito
  addToCart(db);
  // Se imprimen los productos del carrito
  printToCart(db);
  // Manejamos los eventos del usuario en el carrito de compras
  handleCart(db);
  // Se imprime la cantidad total de productos en el carrito y la suma total a pagar
  totalCart(db);
  // Manejamos el evento de la compra
  buyCart(db);
  // Elimina todos los artículos del carrito de compras
  deleteCart(db);
  // Manejamos la visualización de los productos por categorías
  handleList(db);
  // Manejamos la visualización del modal del producto al hacer click en el mismo
  modalProduct(db);
  
}

main();