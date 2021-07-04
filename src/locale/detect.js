module.exports = req => {
    const fullUrl = `https://rfm.velu.ga${req.originalUrl}`;
    const url = new URL(fullUrl);

    if (url.searchParams.get('hl')) {
        return url.searchParams.get('hl');
    }

    const acceptLanguages = ((req.headers?.['accept-language'] || '') ?? 'en')
        .split(',')
        .map(item => item.split(';')[0]);

    return acceptLanguages[0] ?? 'en';
};
