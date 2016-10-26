var vars = {};
var x = window.location.search.substring(1).split('&');
for (var i in x) {
    var z = x[i].split('=', 2);
    vars[z[0]] = unescape(z[1]);
}
document.getElementById('page').innerHTML = vars.page;
document.getElementById('topage').innerHTML = vars.topage;