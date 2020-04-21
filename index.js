addEventListener('fetch', event => {
  event.respondWith(handleRequest(event.request))
})


/**
 * Event handler for HTMLRerwiter
 */
class HTMLHandler {
  constructor(content, attribute='') {
    this.content = content;
    this.attribute = attribute;
  }

  element(element) {
    if (this.attribute) {
      element.setAttribute(this.attribute, this.content);  
    }
    else {
      element.setInnerContent(this.content);
    }
  }
}


/**
 * Respond with one of the two site variants
 * @param {Request}
 * @returns {Response}
 */
async function handleRequest(request) {
  const id = 'user-0';
  const url = 'https://cfw-takehome.developers.workers.dev/api/variants';
  
  // Wait for fetch to finish then parse to JSON
  const api = await fetch(url)
    .then((response) => {
      return response.json();
    });

  //Load and customize each page  
  const page0 = await fetch(api.variants[0]);
  const page1 = await fetch(api.variants[1]);
  const var_1 = new HTMLRewriter()
    .on('title', new HTMLHandler('Congratulations!!!'))
    .on('h1#title', new HTMLHandler('Congratulations!!!'))
    .on('p#description', new HTMLHandler('You are the lucky 1,000,000th winner!'))
    .on('a#url', new HTMLHandler('Click to claim your prize!'))
    .on('a#url', new HTMLHandler('https://github.com/seank97', 'href'))
    .on('a#url', new HTMLHandler('_blank', 'target'))
    .transform(page0);
  const var_2 = new HTMLRewriter()
    .on('title', new HTMLHandler('URGENT: ATTENTION REQUIRED'))
    .on('h1#title', new HTMLHandler('ATTENTION REQUIRED'))
    .on('p#description', new HTMLHandler('Serious security risk detected!'))
    .on('a#url', new HTMLHandler('Click to update your device'))
    .on('a#url', new HTMLHandler('https://www.linkedin.com/in/seanskim97/', 'href'))
    .on('a#url', new HTMLHandler('_blank', 'target'))
    .transform(page1);

  let cookie = request.headers.get('cookie'); 
  
  // Check cookie to see if user has visited the site before
  if (cookie && cookie.includes(`${ id }=0`)) {
    return var_1;
  } 
  else if (cookie && cookie.includes(`${ id }=1`)) {
    return var_2;
  } 
  // First time visiting the site, randomly choose URL and initialize cookie
  else {
    let variant = Math.round(Math.random());
    let response = variant === 0 ? var_1 : var_2;
    response.headers.append('Set-Cookie', `${ id }=${ variant }; path=/`);
    return response;
  }
}
