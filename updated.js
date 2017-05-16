function lastUpdated() {
  u = "01-01-1970 ;P"
  var u = Date(document.lastModified)
  document.getElementById('lastUpdated').innerHTML = u;
}
window.onload = lastUpdated;
