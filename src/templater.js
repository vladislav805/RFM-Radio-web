const getLocale = require('./locale');

const regExpTags = /<%([^%]+)%>/img;

module.exports = (html, lang) => {
    const locale = getLocale(lang);

    let res;

    while (res = regExpTags.exec(html)) {
        const [found, key] = res;
        const offset = res.index;
        const length = found.length;

        html = html.substring(0, offset) + locale(key) + html.substring(offset + length);

        regExpTags.lastIndex = 0;
    }

    return html;
};
