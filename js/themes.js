function createLinks(themesObj) {
    let addButtons = (url, creator, names, sample) => {
        Object.values(names).forEach(name => {
            document.write(
                `<input class=\"lnkButton\" type=\"submit\" value=\"${name}\"` +
                `onclick=\"return showTheme('${url}', '${creator}', '${name}', ${sample});\"/>`
            );
        });
    }
    Object.keys(themesObj).forEach(key => {
        document.write(`<p>&nbsp;&nbsp; o ${key} `);
        addButtons(themesObj[key].url, key, themesObj[key].names, themesObj[key].sample);
        document.write('</p>');
    })
}

function toggleMode() {
    document.getElementById('sampleTxt').classList.toggle('toggleMode')
    document.getElementById('previewTxt').classList.toggle('toggleMode')
}

function showTheme(url, creator, basename, sample) {
    document.getElementById('toggle').style.display = 'block';
    // try getting sample theme.log for theme.zst
    if (sample) {
        try {
            ircToHtml(`${url}${basename}.log`, function(text) {
                document.getElementById('sample').style.display = 'block';
                document.getElementById('sampleTxt').innerHTML = `<pre>${text}</pre>`;
            });
        } catch (e) { }
    } else {
        document.getElementById('sample').style.display = 'none';
    }
    ircToHtml(`${url}${basename}.zst`, function(text) {
        document.getElementById('previewTxt').innerHTML = `<pre>${text}</pre>`;
        document.getElementById('title').style.display = 'block';
        document.getElementById('title').innerHTML =
            `<p>Download: <a href="${url}${basename}.zst">${basename}.zst</a>` +
            `${(creator !== "pzs-ng") ? ' by <strong>' + creator + '</strong>' : " (bundled)"}`
    });
}
