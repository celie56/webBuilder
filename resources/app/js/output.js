var fileHolder = (function () {
    function fileHolder(headerText, id) {
        this.id = id;
        this.headerText = headerText;
        this.headerEl = document.createElement('h3');
        this.headerEl.innerHTML = this.headerText;
        this.divEl = document.createElement('ol');
        this.divEl.setAttribute('id', id + 'div');
        this.divEl.setAttribute('class', 'dropbox');
        this.htmlEl = document.createElement('div');
        this.htmlEl.appendChild(this.headerEl);
        this.htmlEl.appendChild(this.divEl);
        this.divEl.addEventListener("dragenter", this.dragenter, false);
        this.divEl.addEventListener("dragover", this.dragenter, false);
        this.divEl.addEventListener("drop", this.drop, false);
        document.body.appendChild(this.htmlEl);
    }
    fileHolder.prototype.dragenter = function (e) {
        e.stopPropagation();
        e.preventDefault();
    };
    fileHolder.prototype.dragover = function (e) {
        e.stopPropagation();
        e.preventDefault();
    };
    fileHolder.prototype.drop = function (e) {
        e.stopPropagation();
        e.preventDefault();
        var dt = e.dataTransfer;
        var files = dt.files;
        var el = document.getElementById(this.id);
        var text = "";
        for (var i = 0; i < files.length; i++) {
            text += "<li>" + files[i].name + "</li>";
        }
        el.innerHTML = el.innerHTML + text;
    };
    return fileHolder;
})();
//# sourceMappingURL=output.js.map