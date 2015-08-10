


class fileHolder{
    // html elements
    htmlEl: HTMLElement;
    divEl: HTMLElement;
    headerEl: HTMLElement;

    id: string;
    headerText: string;

    constructor(headerText: string, id: string){
        this.id = id;
        this.headerText = headerText;

        // create header
        this.headerEl = document.createElement('h3');
        this.headerEl.innerHTML = this.headerText;

        // create div
        this.divEl = document.createElement('ol');
        this.divEl.setAttribute('id', id + 'div');
        this.divEl.setAttribute('class', 'dropbox');

        // attach elements to container
        this.htmlEl = document.createElement('div');
        this.htmlEl.appendChild(this.headerEl);
        this.htmlEl.appendChild(this.divEl);

        // add listeners
        this.divEl.addEventListener("dragenter", this.dragenter, false);
        this.divEl.addEventListener("dragover", this.dragenter, false);
        this.divEl.addEventListener("drop", this.drop, false);

        // create element
        document.body.appendChild(this.htmlEl);
    }

    // event functions
    dragenter(e: any) {
        e.stopPropagation();
        e.preventDefault();
    }
    dragover(e: any) {
        e.stopPropagation();
        e.preventDefault();
    }
    drop(e: DragEvent) {
        e.stopPropagation();
        e.preventDefault();
        var dt = e.dataTransfer;
        var files = dt.files;

        var el: HTMLElement = document.getElementById(this.id);
        var text = "";
        for (var i = 0; i < files.length; i++){
            text += "<li>" + files[i].name + "</li>";
        }
        el.innerHTML = el.innerHTML + text;
    }
}
