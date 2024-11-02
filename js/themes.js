function createLinks(themesObj) {
    let addButtons = (url, names, creator, custom, sample) => {
        Object.values(names).forEach(name => {
            document.write(`<input class=\"lnkButton\" type=\"submit\" value=\"${name}\"
                            onclick=\"return showTheme('${url}', '${name}', '${creator}', ${custom}, ${sample});\"/>`);
        });
    }
    document.write(`<p>&nbsp;&nbsp o standard `);
    addButtons(themesObj.default.url, themesObj.default.names, null, false, false);
    document.write('</p>');
    Object.keys(themesObj.custom).forEach(key => {
        document.write(`<p>&nbsp;&nbsp; o ${key} `);
        addButtons(themesObj.custom[key].url, themesObj.custom[key].names, key, true, themesObj.custom[key].sample);
        document.write('</p>');
    })
}

function toggleMode() {
    document.getElementById('sampleTxt').classList.toggle('toggleMode')
    document.getElementById('previewTxt').classList.toggle('toggleMode')
}

function showTheme(url, basename, creator, custom, sample) {
    document.getElementById('toggle').style.display = 'block';
    // try getting sample theme.log for theme.zst
    if (custom && creator && sample) {
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
        document.getElementById('title').innerHTML = `<p>Download: <a href="${url}${basename}.zst">${basename}.zst</a>` +
        `${(creator !== "null") ? ' by <strong>' + creator + '</strong>' : ""} ` +
        `(${custom ? 'custom' : "bundled"})`;
    });
}
