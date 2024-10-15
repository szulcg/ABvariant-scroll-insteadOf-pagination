import { addStyles } from "../utils/styles";
import css from './variation.css';
import { waiter } from "../utils/utils";
import { debounce, isElementInView } from "../utils/utils";
import { addAddToCartButton, addToCart } from "./cart";

export function applyVariant(){
  addStyles(css, 'ccx-assignment-1-styles');
  addFirstPageClass();
  addButtonsToProducts()
  addScrollingListener();
}

function addButtonsToProducts() {
  const page = getCurrentPage();
  const products = Array.from(document.querySelectorAll(`.test-page${page} .kb-product`));

  products.forEach(product => {
    if (product.querySelector('.test-addToCart')) return;
    const nodeToInsertButton = product.querySelector('.kb-product__price');
    addAddToCartButton(nodeToInsertButton)

    const addedButton = product.querySelector('.test-addToCart');
    addedButton.addEventListener('click', () => addToCart(product));
  })
}

function addFirstPageClass() {
  let page = getCurrentPage();
  document.querySelector('#product-grid').classList.add(`test-page${page}`)
}

function addScrollingListener() {

  let paginationVisible = false;
  let urlUpdated = false;
  let lastScrollTop = 0;

  window.addEventListener('scroll', debounce(() => {
    const pagination = document.querySelector('.pagination-wrapper');
    const currentScroll = window.scrollY;

    if (scrollingDown(currentScroll, lastScrollTop)) {

      if (pageAlreadyLoaded()) {
        updatePageUrl(getCurrentPage() + 1);
      } else {
        if (isElementInView(pagination) && !paginationVisible) {
          paginationVisible = true;
          handleScrollingDown(pagination);
        } else if (!isElementInView(pagination)) {
          paginationVisible = false;
        }
      }
    } else {
      handleScrollingUp(urlUpdated);
    }

    lastScrollTop = currentScroll;
  }, 100));
}

function pageAlreadyLoaded() {
  let page = getCurrentPage();
  const targetElement = document.querySelector(`.test-page${page + 1}`);

  return targetElement && isElementInView(targetElement)
}

function scrollingDown(currentScroll, lastScrollTop) {
  return currentScroll > lastScrollTop
}

function handleScrollingUp(urlUpdated) {
  let page = getCurrentPage();
  const targetElement = document.querySelector(`.test-page${page - 1}`);

  if (targetElement && isElementInView(targetElement)) {
    updatePageUrl(page - 1);
    urlUpdated = true;
  }
}

function handleScrollingDown(pagination) {
  let page = getCurrentPage();
  const pages = pagination.querySelectorAll('li').length;

  if (page >= pages) return;

  if (!document.querySelector(`test-page${page}`)) {
    addNewProducts(page, pagination);
    updatePageUrl(page + 1);
console.log(`.test-page${page + 1}`)
    waiter(`.test-page${page + 1}`)
      .then(() => {
        console.log('new page')
        addButtonsToProducts()
      })
      .catch(e => console.log('new page not found', e))
  }
}

async function addNewProducts(page, pagination) {
  try {
    const fetched = await fetchNextPage(page)
    const newProducts = fetched.querySelector('ul#product-grid')
    newProducts.classList.add(`test-page${page + 1}`);
    pagination.insertAdjacentElement('beforebegin', newProducts);
  } catch(e) {
    console.log('cw assignment, error while fetching: ', e);
  }
}

async function fetchNextPage(page) {
  const productsFetch = await fetch(`https://karambit.com/collections/fixed-blades?page=${page+1}`);
  const html = await productsFetch.text();
  const parser = new DOMParser();
  const doc = parser.parseFromString(html, 'text/html');

  return doc;
}

function getCurrentPage() {
  const params = window.location.search.split('&');
  const page = params.find(param => param.replace('?', '').includes('page'));
  return parseInt(page?.split('=')[1]) || 1;
}

function updatePageUrl(page) {
  const url = new URL(window.location.href);
  url.searchParams.set('page', page);

  window.history.pushState({}, '', url);
}
