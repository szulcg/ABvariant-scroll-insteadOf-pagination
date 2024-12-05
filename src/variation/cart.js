import { addToCartRequest } from "../utils/utils";

export function addAddToCartButton(node) {
  const button = '<button type="button" class="test-addToCart">Add to cart</button>';
  node.insertAdjacentHTML('afterend', button);
  console.log('main')
}

export async function addToCart(product) {
  const nameId = product.querySelector('input[name="id"]')?.value;
  const productId = product.querySelector('input[name="product-id"]')?.value;
  const sectionId = product.querySelector('input[name="section-id"]')?.value;

  const data  = await addToCartRequest(nameId, productId, sectionId);

  updateCartUI(data);
}


function updateCartUI(data) {
  console.log(data)
  const cartDrawer = document.querySelector('cart-drawer');

  if (data.sections && data.sections['cart-icon-bubble']) {
    const cartIconBubbles = Array.from(document.querySelectorAll('.cart-count-bubble'));
    if (cartIconBubbles[0]) {
      cartIconBubbles.forEach(bubble => {
        const count = bubble.querySelector('span').textContent;
        bubble.querySelector('span').textContent = parseInt(count) + 1
      });
    } else {
      const bubbles = Array.from(document.querySelectorAll('#cart-icon-bubble'));
      const html = `<div class="cart-count-bubble">
        <span aria-hidden="true">1</span>
        <span class="visually-hidden">1 item</span>
      </div>`;
      bubbles.forEach(bubble => {
        bubble.insertAdjacentHTML('afterbegin', html);
      });
    }
  }

  if (data.sections && data.sections['cart-drawer']) {
    const newContent = data.sections['cart-drawer']
      .replace(/&quot;/g, '"')
      .replace(/&amp;/g, '&')
      .replace(/&lt;/g, '<')
      .replace(/&gt;/g, '>');

    if (cartDrawer.classList.contains('is-empty')) {
      cartDrawer.outerHTML = newContent;
    } else {
      const cartDrawerTable = document.querySelector('cart-drawer table')
      document.querySelector('.drawer__footer')?.remove();

      cartDrawerTable.innerHTML = newContent

    const newFooter = document.querySelector('.drawer__footer');
    document.querySelector('cart-drawer table').insertAdjacentElement('afterend', newFooter);
    }
  }

  const cartDrawerElement = document.querySelector('cart-drawer');
  if (cartDrawerElement && typeof cartDrawerElement.open === 'function') {
    cartDrawerElement.open();
  }

  if (cartDrawer.classList.contains('is-empty')) {
    cartDrawer.classList.remove('is-empty');
    document.querySelector('cart-drawer-items').classList.remove('is-empty');
    document.querySelector('.drawer__inner-empty').remove();
  }

  document.dispatchEvent(new CustomEvent('cart:updated', { detail: data }));
}
