// Original mircToHtml() by PennyBreed @ irc.nuphrax.com
// http://hawkee.com/snippet/10164/
//------------------------------------------------------

var themesObj = {
    "default": {
        "url": "https://raw.githubusercontent.com/glftpd/pzs-ng/master/sitebot/themes/",
        "names": [ "default", "classic", "d3x0c", "dakrer", "liquid", "nfs", "psxc", "vampire", "wshadow" ],
    },
    "custom": {
        "slv": {
            "url": "https://raw.githubusercontent.com/silv3rr/sscripts.ga/master/",
            "names": [ "abuse", "fear", "og", "pussy" ],
        }
    }
}
  
function xhrSuccess() {
    this.callback.apply(this, this.arguments);
}

function xhrError() {
    console.error(this.statusText);
}

function loadFile(url, callback) {
    let xhr = new XMLHttpRequest();
    xhr.callback = callback;
    xhr.arguments = Array.prototype.slice.call(arguments, 2);
    xhr.onload = xhrSuccess;
    xhr.onerror = xhrError;
    xhr.overrideMimeType("text/plain; charset=ISO-8859-1"); //charset=utf-8
    xhr.open("GET", url, true);
    // xhr.setRequestHeader('Content-type', 'application/x-www-form-urlencoded; charset=ISO-8859-1')
    xhr.send(null);
}
    
function ircToHtml(textFile, callback) {
    if (textFile === null) {
        return false;
    }
    const form = document.getElementById('form');
    form.addEventListener('submit', (event) => {
        event.preventDefault();
    });
    loadFile(textFile, function() {
        var text = this.responseText
        var ngBotTheme = false
        let ngBotColArr = []
        let ngBotUnitMatch
        let colRe
        let codeArr = []
        let ngBotRe = /(%c\d{1,2}|%[builr]){[^\}]+\}/
        let ircRe = /(\003(\d{1,2})[,]?(\d{1,2})?|\0{2})[^\0{2}]+(\0{2})?/

        // replace control codes: bold, italics, underline
        if (ircRe.test(text)) {
            codeArr = [
                [/\002([^\002]+)(\002)?/, ["<span class=\"bold\">", "</span>"]],
                [/\037([^\037]+)(\037)?/, ["<span class=\"uline\">", "</span>"]],
                [/\035([^\035]+)(\035)?/, ["<span class=\"italic\">", "</span>"]],
            ];
            colRe = /\003(\d{1,2})[,]?(\d{1,2})?([^\003]+)(\003)/
        } else if (ngBotRe.test(text)) {
            ngBotTheme = true
            codeArr = [ 
                [/%b\{([^\}]+)(\})/, ["<span class=\"bold\">", "</span>"]],
                [/%u\{([^\}]+)(\})/, ["<span class=\"uline\">", "</span>"]],
                [/%i\{([^\}]+)(\})/, ["<span class=\"italic\">", "</span>"]],
                [/%l\d\{([^\}]+)(\})/, ["<span class=\"aleft;\">", "</span>"]],
                [/%m\d\{([^\}]+)(\})/, ["<span class=\"acenter;\">", "</span>"]],
                [/%r\d\{([^\}]+)(\})/, ["<span class=\"aright;\">", "</span>"]],
                [/%T\{([^\}]+)(\})/,  ["<span class=\"tcase;\">", "</span>"]],
                [/%U\{([^\}]+)(\})/,  ["<span class=\"ucase;\">", "</span>"]],
                [/%L\{([^\}]+)(\})/,  ["<span class=\"lcase;\">", "</span>"]],
            ]
            colRe = /%c(\d{1,2})[,]?(\d{1,2})?\{([^\}]+)(\})/;
            // ngbot: get default colors
            let ngBotColRe = /COLOR(\d)\s*=\s*"(\d{2})"/g;
            while (ngBotUnitMatch = ngBotColRe.exec(text)) {
                let i = (ngBotUnitMatch[0]) ? ngBotUnitMatch[1] : '00';
                ngBotColArr[i] = ngBotUnitMatch[2]
            }
        } else {
            return false
        }
        // replace colors
        let colMatch
        let c = 0
        while (colMatch = colRe.exec(text)) {
            if (c > 999) {
                console.debug(`DEBUG: break c=${c}`)
                break
            }
            let colFg = (ngBotColArr[colMatch[1]]) ? ngBotColArr[colMatch[1]] : colMatch[1]
            let colBg = (colMatch[2]) ? ` bg${colMatch[2]}` : ""
            text = text.replace(
                colMatch[0], `<span class="fg${colFg.replace(/^0+/,'')}${colBg}">${colMatch[3]}</span>`
            );
        }
        for (let i=0; i < codeArr.length; i++) {  //NOSONAR
            let codeRe = codeArr[i][0];
            let style = codeArr[i][1];
            if (codeRe.test(text)) {
                let j = 0
                let innerTxt
                while ((innerTxt = codeRe.exec(text)) && j < 999) {  //NOSONAR
                    if (j > 999) {
                        console.debug(`DEBUG: break j=${j}`)
                        break
                    }                        
                    text = text.replace(innerTxt[0], style[0] + innerTxt[1] + style[1]);
                    j++
                }
            }
        }
        // replace vars in ngBot input text with example values
        if (ngBotTheme) {
            text = ngBotReplace(text)
        }
        return callback(text);
    });
}

function ngBotReplace(text) {
    text = text.replace(/^(#.*\r?\n)*# BEGIN --->\r?\n/gm, '')
    text = text.replace(/^announce\..*%splitter.*\r?\n/gm, '')
    text = text.replace(/%sitename/g, 'MYSITE')
    text = text.replace(/%section/g, 'GAMES')
    text = text.replace(/%u_ircnick/g, 'somenick')
    text = text.replace(/%u_hostmask/g, 'some.hostmask')
    text = text.replace(/%u_siteop/g, 'SomeOp')
    text = text.replace(/%nuker/g, 'meanman')
    text = text.replace(/%u_racer_monthup/g, '3')
    text = text.replace(/%u_racer_allup/g, '10')
    text = text.replace(/%u_tagline/g, 'Some Tagline')
    text = text.replace(/%sampling/g, '44100')
    text = text.replace(/%bitrate/g, '320')
    text = text.replace(/%mode/g, 'CBR')
    text = text.replace(/%genre/g, 'Pop')
    text = text.replace(/%year/g, '1999')
    text = text.replace(/%reason/g, 'Just because')
    text = text.replace(/%msg/g, 'This is a message')
    text = text.replace(/%(releasename|reldir|relname|release)/g, 'Some_Release-Group')
    text = text.replace(/%(f_name|filename)/g, 'somefilename.rar')
    text = text.replace(/%(u_name|u_racer_name)/g, 'someuser')
    text = text.replace(/%(g_name|g_racer_name)/g, 'iND')
    text = text.replace(/%(u_ip|ip)/g, '11.22.33.44')
    text = text.replace(/%(u_leader_name|u_racer_name)/g, 'tradeguy')
    text = text.replace(/%(u_leader_gname|g_racer_name|g_leader_name)/g, 'LameGroup')
    text = text.replace(/%(pregroup)/g, 'CoolGroup')
    text = text.replace(/%(u_racer_position|g_racer_position|u_racer_wkup|num)/g, '1')
    text = text.replace(
        /%(t_avgspeed|u_speed|u_racer_avgspeed|g_racer_avgspeed|u_leader_avgspeed|r_avgspeed|upspeed|dnspeed|speed)/g,
        Math.floor(Math.random() * 999 + 100) + 'MB/s'
    )
    text = text.replace(
        /%(t_mbytes|u_racer_mbytes|g_racer_mbytes|u_leader_mbytes|uploaded_mbytes|mbytes|mbytesps|mibytes|mbps|free|total|used|size)/g,
        Math.floor(Math.random() * 100 + 1000)
    )
    text = text.replace(
        /%(t_timeleft|t_duration|idletime)/g,
        Math.floor(Math.random() * 999 + 100) + 's'
    )
    text = text.replace(
        /%(uploads|downloads|count|ping|response|port)/g,
        Math.floor(Math.random() * 999 + 100)
    )
    text = text.replace(
        /%(t_files|t_filecount|u_racer_files|g_racer_files|u_leader_files|g_leader_files|files)/g,
        Math.floor(Math.random() * 250 + 50)
    )
    text = text.replace(
        /%(t_percent|u_racer_percent|g_racer_percent|u_leader_percent|g_leader_percent|uploaded_percent|perc_free|perc_used|uppercent|dnpercent|percent|fper)/g,
        Math.floor(Math.random() * 100 + 0)
    )
    text = text.replace(
        /%(u_count|g_count|u_idletimes|multiplier|cds|nukees)/g,
        Math.floor(Math.random() * 10 + 1)
    )
    // text = text.replace(/%/g,'')
    return text
}

// TODO: - refactor if custom showSample

function createLinks() {
    let addButtons = (url, names, creator, custom) => {
        Object.values(names).forEach(name => {
            document.write(`<input class=\"lnkbutton\" type=\"submit\" value=\"${name}${custom ? ' *' : ''}\"
                            onclick=\"return showTheme('${url}', '${name}', '${creator}', ${custom});\"/>`)
        })
    }
    Object.keys(themesObj.custom).forEach(key => {
        addButtons(themesObj.custom[key].url, themesObj.custom[key].names, key, true)
    })
    addButtons(themesObj.default.url, themesObj.default.names, null, false)
}

function toggleMode() {
    document.getElementById('sample').classList.toggle('toggleMode')
    document.getElementById('preview').classList.toggle('toggleMode')
}

function showTheme(url, basename, creator, custom) {
    document.getElementById('toggle').style.display = 'block';
    if (custom && creator) {
        ircToHtml(`${url}${basename}.log`, function(text) {
            document.getElementById('sampleHdr').style.display = 'block';
            document.getElementById('sample').style.display = 'block';
            document.getElementById('sample').innerHTML = `<pre>${text}</pre>`;
        });
    } else {
        document.getElementById('sampleHdr').style.display = 'none';
        document.getElementById('sample').style.display = 'none';
    }
    ircToHtml(`${url}${basename}.zst`, function(text) {
        document.getElementById('preview').innerHTML = `<pre>${text}</pre>`;
        document.getElementById('title').style.display = 'block';
        document.getElementById('title').innerHTML = `<p>Download: <a href="${url}${basename}.zst">${basename}.zst</a> (${custom ? '* custom' : "bundled"})`;
    });
}

window.onload = ircToHtml(null);