// -*- Mode: ecmascript; indent-tabs-mode: nil; -*-

(function() {
    var disable_dnd_function = function() {
        var elem = document.getElementById("folderTree");
        if (elem) {
            elem.removeAttribute("ondragstart");
        }
    };
    window.addEventListener("load", disable_dnd_function, false);
})();
