const createElement = (arr) => {
    const createHtmlElement = arr.map((arrPss) => `<button class="btn btn-soft btn-primary">${arrPss}</button>`)
    return(createHtmlElement.toString());
}
const synonyms = ["hi", "hello", "buy"];
createElement(synonyms)