(function () {
    var current = window.location.href;
    var from = '/spotify-api';
    var to = '/Spotify-Overlay';
    var fIndex = current.toLowerCase().indexOf(from);
    var target = current.substr(0, fIndex) + to + current.substr(fIndex + from.length);
    window.location = target;
})();
