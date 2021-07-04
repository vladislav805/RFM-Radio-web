const en = require('./en');
const ru = require('./ru');

const getter = localeObject => key => {
    const [section, name] = key.split('.');

    return localeObject?.[section]?.[name] ?? `%${key}%`;
};

module.exports = code => getter(code === 'ru' ? ru : en);
