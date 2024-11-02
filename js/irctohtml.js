// Original mircToHtml() by PennyBreed @ irc.nuphrax.com
// http://hawkee.com/snippet/10164/
//------------------------------------------------------

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
        var text = this.responseText;
        var ngBotTheme = false;
        let ngBotColArr = [];
        let ngBotUnitMatch;
        let colRe;
        let codeArr = [];

        let ngBotRe = /(%c\d{1,2}|%[builr]){[^\}]+\}/
        let ircRe = /(\003(\d{1,2})[,]?(\d{1,2})?|\0{2})[^\0{2}]+(\0{2})?/

        // replace irc control codes: bold, italics, underline and color
        if (ircRe.test(text)) {
            codeArr = new Array(
                [/\002([^\002]+)(\002)?/, ["<span class=\"bold\">", "</span>"]],
                [/\037([^\037]+)(\037)?/, ["<span class=\"uline\">", "</span>"]],
                [/\035([^\035]+)(\035)?/, ["<span class=\"italic\">", "</span>"]],
            );
            colRe = /\003(\d{1,2})[,]?(\d{1,2})?([^\003]+)(\003)/
        // replace ngbot control codes: bold, italics, underline, pad, case and color
        } else if (ngBotRe.test(text)) {
            ngBotTheme = true
            codeArr = new Array(
                [/%b\{([^\}]+)(\})/, ["<span class=\"bold\">", "</span>"]],
                [/%i\{([^\}]+)(\})/, ["<span class=\"italic\">", "</span>"]],
                [/%u\{([^\}]+)(\})/, ["<span class=\"uline\">", "</span>"]],
                [/%l(\d+)\{([^\}]+)(\})/, [`<span class=\"aleft;\" style=\"padding-right:`, "px\">", "</span>"]],
                [/%r(\d+)\{([^\}]+)(\})/, [`<span class=\"aright;\" style=\"padding-left:`, "px\">", "</span>"]],
                [/%m\d\{([^\}]+)(\})/,    ["<span class=\"acenter;\">", "</span>"]],
                [/%T\{([^\}]+)(\})/,  ["<span class=\"tcase;\">", "</span>"]],
                [/%U\{([^\}]+)(\})/,  ["<span class=\"ucase;\">", "</span>"]],
                [/%L\{([^\}]+)(\})/,  ["<span class=\"lcase;\">", "</span>"]],
            );
            colRe = /%c(\d{1,2})[,]?(\d{1,2})?\{([^\}]+)(\})/;
            // get default ngbot theme colors
            let ngBotColorRe = /COLOR(\d)\s*=\s*"(\d{1,2})"/g;
            while (ngBotUnitMatch = ngBotColorRe.exec(text)) {
                let i = (ngBotUnitMatch[0]) ? ngBotUnitMatch[1] : '00';
                ngBotColArr[i] = ngBotUnitMatch[2];
            }
        } else {
            return false;
        }
        // replace colors
        let colMatch
        let c = 0
        while (colMatch = colRe.exec(text)) {
            if (c > 999) {
                console.debug(`DEBUG: break c=${c}`);
                break;
            }
            let colFg = (ngBotColArr[colMatch[1]]) ? ngBotColArr[colMatch[1]] : colMatch[1]
            let colBg = (colMatch[2]) ? ` bg${colMatch[2]}` : ""
            text = text.replace(
                colMatch[0], `<span class="fg${colFg.replace(/^0+/,'')}${colBg}">${colMatch[3]}</span>`
            );
        }
        // control codes
        for (let i=0; i < codeArr.length; i++) {  //NOSONAR
            let codeRe = codeArr[i][0];
            let html = codeArr[i][1];
            if (codeRe.test(text)) {
                let j = 0;
                let matchText;
                while ((matchText = codeRe.exec(text)) && j < 999) {  //NOSONAR
                    if (j > 999) {
                        console.debug(`DEBUG: break j=${j}`)
                        break
                    }
                    if (html.length === 3) {
                        text = text.replace(matchText[0], html[0] + matchText[1] + html[1] + matchText[2] + html[2]);
                    } else {
                        text = text.replace(matchText[0], html[0] + matchText[1] + html[1]);
                    }
                    j++;
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
    const allSections = ["APPS", "UTILS", "DIVX", "GAMES", "TVRIPS"];
    let section;
    if (text.match(/mp3/i)) {
      section = "MP3";
    } else {
      section = allSections[Math.floor(Math.random() * allSections.length)];
    }
    text = text.replace(/^(#.*\r?\n)*# BEGIN --->\r?\n/gm, '');
    text = text.replace(/^announce\..*%splitter.*\r?\n/gm, '');
    text = text.replace(/%sitename/g, 'MYSITE');
    text = text.replace(/%section/g, section);
    text = text.replace(/%u_ircnick/g, 'somenick');
    text = text.replace(/%u_siteop/g, 'SomeOp');
    text = text.replace(/%u_racer_monthup/g, '3');
    text = text.replace(/%u_racer_allup/g, '10');
    text = text.replace(/%u_tagline/g, 'Some Tagline');
    text = text.replace(/%sampling/g, '44100');
    text = text.replace(/%bitrate/g, '320');
    text = text.replace(/%mode/g, 'CBR');
    text = text.replace(/%genre/g, 'Pop');
    text = text.replace(/%year/g, '1999')
    text = text.replace(/%reason/g, 'Just because');
    text = text.replace(/%cmdprehelp/g, '!nghelp');
    text = text.replace(/%desc/g, 'EURO');
    text = text.replace(/%pid/g, '1');
    text = text.replace(/%msg/g, 'Yes, this is a message');
    text = text.replace(/%(releasename|reldir|relname|release)/g, 'Some_Release-GROUP');
    text = text.replace(/%path/g, 'some-path');
    text = text.replace(/%(f_name|filename)/g, 'somefilename.rar')
    text = text.replace(/%(u_name|u_racer_name)/g, 'someuser');
    text = text.replace(/%(g_name|g_racer_name)/g, 'iND');
    text = text.replace(/%(u_ip|ip)/g, '11.22.33.44');
    text = text.replace(/%(u_leader_name|u_racer_name)/g, 'tradeguy');
    text = text.replace(/%(u_leader_gname|g_racer_name|g_leader_name)/g, 'LameGroup');;
    text = text.replace(/%(pregroup)/g, 'CoolGroup');
    text = text.replace(/%(u_racer_position|g_racer_position|u_racer_wkup|num)/g, '1')
    text = text.replace(/%(u_hostmask|u_host)/g, 'shell.example.com');
    text = text.replace(/%(nuker|unnuker)/g, 'rudeguy');
    text = text.replace(
        /%(t_percent|u_racer_percent|g_racer_percent|u_leader_percent|g_leader_percent|uploaded_percent|perc_free|perc_used|uppercent|dnpercent|totalpercent|percent|fper|per)/g,
        Math.floor(Math.random() * 100 + 0)
    );
    text = text.replace(
        /%(t_avgspeed|u_speed|u_racer_avgspeed|g_racer_avgspeed|u_leader_avgspeed|r_avgspeed|upspeed|dnspeed|totalspeed|speed)/g,
        Math.floor(Math.random() * 999 + 100) + 'MB/s'
    );
    text = text.replace(
        /%(t_mbytes|u_racer_mbytes|g_racer_mbytes|u_leader_mbytes|g_leader_mbytes|uploaded_mbytes|mbytes|mbytesps|mibytes|mbps)/g,
        Math.floor(Math.random() * 100 + 1000)
    );
    text = text.replace(
        /%(free|total|used|size)/g,
        Math.floor(Math.random() * 100 + 1000) + 'MB'
    );
    text = text.replace(
        /%(t_timeleft|t_duration|idletime)/g,
        Math.floor(Math.random() * 999 + 100) + 's'
    )
    text = text.replace(
        /%port/g,
        Math.floor(Math.random() * 1024 + 65535)
    )
    text = text.replace(
        /%(count|ping|response|totallogins|maxusers)/g,
        Math.floor(Math.random() * 5 + 60)
    );
    text = text.replace(
        /%(t_files|t_filecount|u_racer_files|g_racer_files|u_leader_files|g_leader_files|files)/g,
        Math.floor(Math.random() * 250 + 50)
    );
    text = text.replace(
        /%(u_count|g_count|u_idletime|multiplier|cds|nukees|uploads|downloads|transfers|active)/g,
        Math.floor(Math.random() * 10 + 1)
    );
    // text = text.replace(/%/g,'');
    return text;
}

function ircToHtml(textFile, callback) {
    if (textFile === null) {
        return false;
    }
    ircToHtml(`${url}${basename}.zst`, function(text) {
        document.getElementById('previewtxt').innerHTML = `<pre>${text}</pre>`;
        document.getElementById('title').style.display = 'block';
        document.getElementById('title').innerHTML = `<p>Download: <a href="${url}${basename}.zst">${basename}.zst</a> (${custom ? '* custom' : "bundled"})`;
    });
}

window.onload = ircToHtml(null);
