export function waiter(selector, timeout = 7000) {
  return new Promise((resolve, reject) => {
      const startTime = Date.now();

      const checkExist = setInterval(() => {
          const element = document.querySelector(selector);

          if (element) {
              clearInterval(checkExist);
              resolve(element);
          } else if (Date.now() - startTime > timeout) {
              clearInterval(checkExist);
              reject(new Error(`Element with selector "${selector}" not found within ${timeout}ms`));
          }
      }, 100);
  });
}

export function isElementInView(element) {
    const rect = element.getBoundingClientRect();
    return (
        rect.top < window.innerHeight &&
        rect.bottom > 0 &&
        rect.left < window.innerWidth &&
        rect.right > 0
    );
}

export function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
        clearTimeout(timeout);
        func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

export function addToCartRequest(nameId, productId, sectionId) {
    return fetch("URL/cart/add", { /* URL is a url of the shop the test was originally created for, now hidden due to confidentiality reasons */
        "headers": {
          "accept": "application/javascript",
          "accept-language": "en-GB,en-US;q=0.9,en;q=0.8",
          "content-type": "multipart/form-data; boundary=----WebKitFormBoundaryuvBsp7cvSvpWPUsL",
          "priority": "u=1, i",
          "sec-ch-ua": "\"Chromium\";v=\"128\", \"Not;A=Brand\";v=\"24\", \"Google Chrome\";v=\"128\"",
          "sec-ch-ua-mobile": "?0",
          "sec-ch-ua-platform": "\"macOS\"",
          "sec-fetch-dest": "empty",
          "sec-fetch-mode": "cors",
          "sec-fetch-site": "same-origin",
          "x-requested-with": "XMLHttpRequest"
        },
        "referrer": "",
        "referrerPolicy": "strict-origin-when-cross-origin",
        "body": `------WebKitFormBoundaryuvBsp7cvSvpWPUsL\r\nContent-Disposition: form-data; name=\"form_type\"\r\n\r\nproduct\r\n------WebKitFormBoundaryuvBsp7cvSvpWPUsL\r\nContent-Disposition: form-data; name=\"utf8\"\r\n\r\n✓\r\n------WebKitFormBoundaryuvBsp7cvSvpWPUsL\r\nContent-Disposition: form-data; name=\"id\"\r\n\r\n${nameId}\r\n------WebKitFormBoundaryuvBsp7cvSvpWPUsL\r\nContent-Disposition: form-data; name=\"properties[status]\"\r\n\r\nPre-Order\r\n------WebKitFormBoundaryuvBsp7cvSvpWPUsL\r\nContent-Disposition: form-data; name=\"product-id\"\r\n\r\n${productId}\r\n------WebKitFormBoundaryuvBsp7cvSvpWPUsL\r\nContent-Disposition: form-data; name=\"section-id\"\r\n\r\n${sectionId}\r\n------WebKitFormBoundaryuvBsp7cvSvpWPUsL\r\nContent-Disposition: form-data; name=\"sections\"\r\n\r\ncart-drawer,cart-icon-bubble\r\n------WebKitFormBoundaryuvBsp7cvSvpWPUsL\r\nContent-Disposition: form-data; name=\"sections_url\"\r\n\r\n/collections/fixed-blades\r\n------WebKitFormBoundaryuvBsp7cvSvpWPUsL--\r\n`,
        "method": "POST",
        "mode": "cors",
        "credentials": "include"
      })
      .then(response => response.json())
      .then(data => data)
      .catch(e => console.log('error adding item to cart: ', e));
}
