var vars = {};
var x = window.location.search.substring(1).split('&');
for (var i in x) {
    var z = x[i].split('=', 2);
    vars[z[0]] = unescape(z[1]);
}
function setContent(name, value) {
    var el = document.getElementById(name);
    if(!el) return;
    el.innerHTML = value;
}
setContent('page', vars.page);
setContent('topage', vars.topage);