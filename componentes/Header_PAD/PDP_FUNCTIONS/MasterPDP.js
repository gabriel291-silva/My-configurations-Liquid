// colocar no final da pdp 
{/* <script>
  {%  if product.has_only_default_variant%}
    const variantID = {{product.variants.first.id}};
    const url = new URL(window.location);
    url.searchParams.set("variant", variantID);
    window.history.replaceState({}, "", url);
  {%else %}
    const variantID = {{product.first_available_variant.id}};
    const url = new URL(window.location);
    url.searchParams.set("variant", variantID);
    window.history.replaceState({}, "", url);
  {%endif %}
</script>
<script src="{{ 'MasterPDP.js' | asset_url }}" defer="defer"></script> */}

// botão de adicionar ao carrinho a variant selecioanda 

// <button class="add-to-cart-pdp" variant-id=""></button>


function updateCartAndFetchItemsPDP(lineItemId, newQuantity) {
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
  function addEventListenersNewsComponentsPDP() {
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
  
    //         updateCartAndFetchItemsPDP(lineItemId, 0);
    //     })
    // })
    decrementBtns.forEach((btn) => {
      btn.addEventListener("click", function () {
        const lineItemId = this.dataset.id;
        const input = this.nextElementSibling;
        let currentValue = parseInt(input.value);
        if (currentValue > 1) {
          updateCartAndFetchItemsPDP(lineItemId, currentValue - 1);
        } else {
          updateCartAndFetchItemsPDP(lineItemId, 0);
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
  function getCartPDP() {
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
          console.log({item})
          const productHTML = `
              <div class="minicart-product-card-container">
                  <div class="minicart-product-card-img-content">
                  <img src="${item.image}" width="100%" height="100%">
                  </div> 
                  <div class="minicart-product-card-texts-content">
                  <div>
                      <p>${item.title}</p>
                      <span>Tamanho: ${item?.options_with_values[1] ? item?.options_with_values[1].value : "uni"} </span>
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
        addEventListenersNewsComponentsPDP();

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
  function openMiniCartPDP() {
    const containerMinicart = document.getElementById("minicart");
    containerMinicart.classList = "minicart-swrapper";
  }
  function addToCartPDP() {
    const urlParams = new URLSearchParams(window.location.search);
    const id = urlParams.get('variant')
    const formData = {
      items: [
        {
          id: id, // Certifique-se de que este seja um ID de variante válido
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
        getCartPDP();
        openMiniCartPDP();
      })
      .catch((error) => {
        console.error("Erro ao adicionar o produto ao carrinho:", error.message);
      });
  }
  function formatPrice(priceInCents) {
    return (priceInCents / 100).toLocaleString('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    });
  }
  // Função para buscar dados da variante usando fetch
  async function fetchVariantData(variantId) {
    try {
      const response = await fetch(`/products/${window.location.pathname.split('/').pop()}.js`);
      if (!response.ok) throw new Error('Erro ao buscar dados do produto');

      const productData = await response.json();
      const variant = productData.variants.find(v => v.id == variantId);

      if (variant) {
        console.log('Dados da variante:', variant);
        return variant;
      } else {
        console.log('Nenhuma variante encontrada com o ID:', variantId);
        return null;
      }
    } catch (error) {
      console.error(error);
    }
  }
  // Função para atualizar o botão, verificar a disponibilidade da variante e exibir o preço
  function updateVariantInButton() {
    const urlParams = new URLSearchParams(window.location.search);
    const variantId = urlParams.get('variant');
    const addToCartButton = document.querySelector('.add-to-cart-pdp');

    if (variantId && addToCartButton) {
      fetchVariantData(variantId).then(variant => {
        if (variant) {
          addToCartButton.setAttribute('variant-id', variantId);
          
          // Verifica a disponibilidade da variante
          if (variant.available) {
            console.log('A variante está disponível:', variant);
            addToCartButton.removeAttribute('disabled');
            addToCartButton.classList.remove('disabled');
          } else {
            console.log('A variante não está disponível:', variant);
            addToCartButton.setAttribute('disabled', true);
            addToCartButton.classList.add('disabled');
          }

          // Exibe o preço formatado dentro do botão
          addToCartButton.textContent = `COMPRAR - ${formatPrice(variant.price)}`;
          addToCartButton.addEventListener("click",()=>{
            addToCartPDP(variantId)})
        }
      });
    } else {
      console.log('Nenhum variant ID encontrado na URL');
    }
  }
  // Observadores de mudanças na URL
  function handleUrlChange() {
    updateVariantInButton();
  }
  window.addEventListener('popstate', handleUrlChange);
  (function() {
    const pushState = history.pushState;
    const replaceState = history.replaceState;

    history.pushState = function(...args) {
      pushState.apply(history, args);
      handleUrlChange();
    };

    history.replaceState = function(...args) {
      replaceState.apply(history, args);
      handleUrlChange();
    };
  })();
  window.addEventListener('hashchange', handleUrlChange);
  // Chamada inicial para buscar o valor de `variant` na carga da página
  updateVariantInButton();