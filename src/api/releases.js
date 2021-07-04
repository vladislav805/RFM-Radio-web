const fetch = require('node-fetch');

let cache = null;
let updated = 0;

module.exports = async(req, res) => {
    const now = Date.now();

    if (now - updated < 3600 * 1000) {
        res.send(cache);
        return;
    }

    const request = await fetch('https://api.github.com/repos/vladislav805/RFM-Radio/releases');
    const releases = await request.json();

    const result = {
        release: null,
        dev: null,
    };

    for (const release of releases) {
        if (release.prerelease && result.dev || !release.prerelease && result.release || release.draft) {
            continue;
        }

        const key = release.prerelease ? 'dev' : 'release';

        const version = release.tag_name.replace('v', '');
        const versionChunks = version.split('.');

        if (versionChunks.length < 3) {
            versionChunks.push(0);
        }

        const [major, minor, patch] = versionChunks.map(Number);

        result[key] = {
            version,
            build: major * 10000 + minor * 100 + patch,
            changelog: release.body,
            url: release.html_url,
            date: Math.floor(new Date(release.published_at).getTime() / 1000),
            download_url: release.assets?.[0]?.browser_download_url,
        };
    }

    cache = result;
    updated = now;

    res.send(result);
};
