function showQuote() {
  try {
    var quote = "";
    var quoteDef = "&nbsp; &lt;pzs-ng&gt; Here's your quote sir: \" :)";
    var quotesFile = new XMLHttpRequest();
    quotesFile.onreadystatechange = function() {
      if (quotesFile.readyState === 4 && quotesFile.status === 200) {
        var allQuotes = quotesFile.responseText.split(/(\r\n|\n)/g);
        for ( i = Math.floor(Math.random() * (allQuotes.length-25)); i < allQuotes.length; i++ ) { 
          if ( typeof allQuotes[i] === undefined || allQuotes[i] == null || allQuotes === "" ) { allQuotes[i] = quoteDef; }
          if ( allQuotes[i].match(/^Quote #.*[0-9]/) ) {
            i++;
            while ( ! allQuotes[i].match(/^(Quote #.*[0-9]|Meet us at)/) ) {
              if ( allQuotes[i].match(/^($|<br\s*\/?>$|-+)/) ) {
                i=i + allQuotes[i].match.length;
              } else { 
                quote += allQuotes[i]; i++;
              }
            }
          break;
          }
        }
      if ( typeof quote === undefined || quote == null || quote === "" ) { quote = quoteDef; }
      document.getElementById('randomQuote').innerHTML=( quote );
      }
    };
    quotesFile.open("GET", "quotes.html", true);
    quotesFile.send();
  }
  catch(e) { }
}
window.onload = showQuote();
