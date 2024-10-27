// Função para obter o carrinho completo
function formatPriceBRL(priceInCents) {
  return (priceInCents / 100).toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
  });
}
function getCart() {
  return fetch("/cart.js", {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
  })
    .then((response) => response.json())
    .then((data) => {
      //   console.log("Carrinho completo:", data);
      //   console.log(data.items);

      const cartContainer = document.querySelector(".minicart-list-header");
      cartContainer.innerHTML = ""; // Limpa o container antes de adicionar os itens
      const containerSHippingBarText = document.querySelector(
        ".minicart-footer-shipping-bar-text"
      );
      const containerPriceTotal = document.querySelector(".finish-price-order");
      const valueFreeShipping =
        document.querySelector(".header-section-container") &&
        JSON.parse(
          document
            .querySelector(".header-section-container")
            .getAttribute("quantity_frete_free")
        ) * 100;
      const calculoShipping =
        valueFreeShipping && valueFreeShipping - data.total_price;
      const procentagemShipping =
        valueFreeShipping && (data.total_price / valueFreeShipping) * 100;
      containerPriceTotal.innerHTML = `${formatPriceBRL(data.total_price)}`;
      const containerSHippingBar = document.querySelector("#shipping-bar");

      data.items.forEach((item) => {
        const productHTML = `
            <div class="minicart-product-card-container">
                <div class="minicart-product-card-img-content">
                <img src="${item.image}" width="100%" height="100%">
                </div> 
                <div class="minicart-product-card-texts-content">
                <div>
                    <p>${item.title}</p>
                    <div>
                        <div class="input-selector-quantity-minicart">
                        <button type="button" class="decrement" data-id="${
                          item.key
                        }">-</button>
                        <input
                            class="quantity-input"
                            type="number"
                            name="quantity"
                            value="${item.quantity}"
                            min="1"
                            readonly
                        >
                        <button type="button" class="increment" data-id="${
                          item.key
                        }">+</button>
                        </div>
                    </div>
                </div>
                <div class="price-product">${formatPriceBRL(
                  item.line_price
                )}</div>
            </div>
            </div>
            `;

        cartContainer.insertAdjacentHTML("beforeend", productHTML);
      });

      addEventListenersNewsComponents();
      if (calculoShipping < 0) {
        containerSHippingBarText.innerHTML = ` frete grátis`;
        containerSHippingBar.style.width = `100%`;
      } else {
        containerSHippingBarText.innerHTML = `Faltam só  <b>${formatPriceBRL(
          calculoShipping
        )}</b> para o frete grátis`;
        containerSHippingBar.style.width = `${procentagemShipping}%`;
      }
      return data;
    })
    .catch((error) => {
      console.error("Erro ao obter o carrinho:", error);
    });
}
function updateCartAndFetchItems(lineItemId, newQuantity) {
  fetch("/cart/change.js", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify({
      id: lineItemId,
      quantity: newQuantity,
    }),
  })
    .then((response) => response.json())
    .then((data) => {
      // console.log(data)
      return getCart(); // Busca todos os produtos após a atualização
    })
    .then((cartData) => {
      // console.log(cartData)
    })
    .catch((error) => {
      console.error("Erro ao atualizar o carrinho:", error);
    });
}
function addEventListenersNewsComponents() {
  const decrementBtns = document.querySelectorAll(".decrement");
  const incrementBtns = document.querySelectorAll(".increment");
  // const removerProductCart = document.querySelectorAll('.removerProductButton')
  // const containerIconOpenMinicart = document.querySelector('.icon-open-minicart')
  // const containerCloseMinicart = document.querySelectorAll('.close-minicart')

  // containerIconOpenMinicart.addEventListener('click',()=>{openMiniCart()})
  // containerCloseMinicart.forEach(btn=>{
  //     btn.addEventListener('click',()=>{
  //         closeMiniCart()
  //     })
  // })
  // removerProductCart.forEach(btn =>{
  //     btn.addEventListener('click', function() {
  //         const lineItemId = this.dataset.id;

  //         updateCartAndFetchItems(lineItemId, 0);
  //     })
  // })
  decrementBtns.forEach((btn) => {
    btn.addEventListener("click", function () {
      const lineItemId = this.dataset.id;
      const input = this.nextElementSibling;
      let currentValue = parseInt(input.value);
      if (currentValue > 1) {
        updateCartAndFetchItems(lineItemId, currentValue - 1);
      } else {
        updateCartAndFetchItems(lineItemId, 0);
      }
    });
  });

  incrementBtns.forEach((btn) => {
    btn.addEventListener("click", function () {
      const lineItemId = this.dataset.id;
      const input = this.previousElementSibling;
      let currentValue = parseInt(input.value);
      updateCartAndFetchItems(lineItemId, currentValue + 1);
    });
  });
}
function openMiniCart() {
  const containerMinicart = document.getElementById("minicart");
  containerMinicart.classList = "minicart-swrapper";
}
function closeMiniCart() {
  const containerMinicart = document.getElementById("minicart");
  containerMinicart.classList = " minicart-swrapper minicart-swrapper-close";
}
function addToCartManyButtons(element) {
  // const quantityInput = document.querySelector( `.${element.attributes.section_identify.value}`);

  const variantId = element.attributes.variant_id.value;
  // if (!quantityInput) {
  //   console.error("Input de quantidade não encontrado.");
  //   return;
  // }

  const formData = {
    items: [
      {
        id: variantId, // Certifique-se de que este seja um ID de variante válido
        quantity: 1,
      },
    ],
  };

  fetch("/cart/add.js", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify(formData),
  })
    .then((response) => {
      if (!response.ok) {
        return response.json().then((errorData) => {
          throw new Error(errorData.message || "Failed to add to cart");
        });
      }
      return response.json();
    })
    .then((data) => {
      console.log("Produto adicionado ao carrinho:", data);
      getCart();
      openMiniCart();
    })
    .catch((error) => {
      console.error("Erro ao adicionar o produto ao carrinho:", error.message);
    });
}
function addToCartPDP(element) {
  const quantityInput = document.querySelector(
    `.${element.attributes.section_identify.value}`
  );
  const variantId = element.attributes.variant_id.value;
  if (!quantityInput) {
    console.error("Input de quantidade não encontrado.");
    return;
  }

  const formData = {
    items: [
      {
        id: variantId, // Certifique-se de que este seja um ID de variante válido
        quantity: quantityInput.value,
      },
    ],
  };

  fetch("/cart/add.js", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify(formData),
  })
    .then((response) => {
      if (!response.ok) {
        return response.json().then((errorData) => {
          throw new Error(errorData.message || "Failed to add to cart");
        });
      }
      return response.json();
    })
    .then((data) => {
      console.log("Produto adicionado ao carrinho:", data);
      getCart();
      openMiniCart();
    })
    .catch((error) => {
      console.error("Erro ao adicionar o produto ao carrinho:", error.message);
    });
}
function openMenuMobile() {
  const containerLinksMobile = document.getElementById("menu-mobile-swrapper");
  containerLinksMobile.classList.toggle("menu-mobile-swrapper-close");

  document
    .querySelector(".header-section-container")
    .classList.toggle("fixed-mobile");
  document.querySelector(".utility-bar").classList.toggle("fixed-mobile");

  if (containerLinksMobile.classList == "menu-mobile-swrapper") {
    document.querySelectorAll(".sublinks-container").forEach((element) => {
      element.classList.add("close-sublink-swrapper");
    });
  }
}
function toggleSublinksButtons(element) {
  const sublinksContainer = element.nextElementSibling;
  element.classList.add("color-transparant");
  element.classList.toggle("color-transparant");
  sublinksContainer.classList.toggle("close-sublink-swrapper");
}
function CloseSublinksOver(element) {
  element.classList.toggle("close-sublink-swrapper");
  const buttonLinks = element.previousElementSibling;
  buttonLinks.classList.remove("color-transparant");
}

document.addEventListener("DOMContentLoaded", function () {
  const openBtnHeaderMinicart = document.querySelector(
    ".icon-cart.icon-header-pad"
  );
  const containerSwrapperMiniCart = document.querySelector("#minicart");
  const buttonsAddToCartCustom = document.querySelectorAll(
    ".addTocart-input-card"
  );
  const containerCloseMinicart = document.querySelectorAll(".close-minicart");
  const buttonOpenMenuMobile = document.querySelector(".mobile-menu");
  const sublinks = document.querySelectorAll(".sublinks-button");
  const sublinkscontainer = document.querySelectorAll(".sublinks-container");
  openBtnHeaderMinicart.addEventListener("click", () => {
    openMiniCart();
  });

  containerSwrapperMiniCart &&
    containerSwrapperMiniCart.addEventListener("click", (event) => {
      if (event.target === event.currentTarget) {
        closeMiniCart();
      }
    });

  buttonsAddToCartCustom &&
    buttonsAddToCartCustom.forEach((element) => {
      element.addEventListener("click", () => {
        console.log("teste");
        addToCartManyButtons(element);
      });
    });

  containerCloseMinicart.forEach((btn) => {
    btn.addEventListener("click", () => {
      closeMiniCart();
    });
  });

  buttonOpenMenuMobile &&
    buttonOpenMenuMobile.addEventListener("click", () => {
      openMenuMobile();
    });
  sublinks &&
    sublinks.forEach((element) => {
      element.addEventListener("click", () => {
        toggleSublinksButtons(element);
      });
    });
  document.querySelectorAll(".close-sublinks-mobile") &&
    document.querySelectorAll(".close-sublinks-mobile").forEach((e) => {
      e.addEventListener("click", () => {
        document.querySelectorAll(".sublinks-container").forEach((element) => {
          element.classList.add("close-sublink-swrapper");
        });
      });
    });
  sublinkscontainer &&
    sublinkscontainer.forEach((element) => {
      element.addEventListener("mouseleave", () => {
        CloseSublinksOver(element);
      });
    });
  getCart();
});
