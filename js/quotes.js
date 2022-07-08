var quote = "";
var quoteDef = "&nbsp; &lt;pzs-ng&gt; Here's your quote sir: \" :)";

function showQuote() {
    try {
        var quotesFile = new XMLHttpRequest();
        quotesFile.overrideMimeType("text/plain; charset=utf-8");
        quotesFile.onreadystatechange = function () {
            if (quotesFile.readyState === 4 && quotesFile.status === 200) {
                var allQuotes = quotesFile.responseText.split(/\r?\n/);
                var i = Math.floor(Math.random() * (allQuotes.length - 2));
                if (typeof allQuotes[i] === undefined || allQuotes[i] == null || allQuotes[i] === "") {
                    allQuotes[i] = quoteDef;
                }
                quote = allQuotes[i].replace(/\</g, "&lt;").replace(/\>/g, "&gt;").replace(/(?:\\r\\n|\\r|\\n)/g, "<br> \n&nbsp ");
                document.getElementById('randomQuote').innerHTML = (' &nbsp ' + quote);
            }
        };
        quotesFile.open("GET", "quotes", true);
        quotesFile.send();
    }
    catch (e) { }
}

function showQuoteHTML() {
    try {
        var quotesFile = new XMLHttpRequest();
        quotesFile.overrideMimeType("text/plain; charset=utf-8");
        quotesFile.onreadystatechange = function () {
            if (quotesFile.readyState === 4 && quotesFile.status === 200) {
                var allQuotes = quotesFile.responseText.split(/(\r\n|\n)/g);
                for (var i = Math.floor(Math.random() * (allQuotes.length - 25)); i < (allQuotes.length - 25); i++) {
                    if (typeof allQuotes[i] === undefined || allQuotes[i] == null || allQuotes[i] === "") {
                        allQuotes[i] = quoteDef;
                    }
                    if (allQuotes[i].match(/^Quote #.*\d/)) {
                        i++;
                        while (!allQuotes[i].match(/^(Quote #.*\d|Meet us at)/)) {
                            if (allQuotes[i].match(/^($|<br\s*\/?>$|-+)/)) {
                                i = i + allQuotes[i].match.length;
                            } else {
                                quote += allQuotes[i];
                                i++;
                            }
                        }
                        break;
                    }
                }
                if (typeof quote === undefined || quote == null || quote === "") {
                    quote = quoteDef;
                }
                document.getElementById('randomQuoteHTML').innerHTML = (quote);
            }
        };
        quotesFile.open("GET", "quotes.html", true);
        quotesFile.send();
    }
    catch (e) { }
}

window.onload = showQuote();