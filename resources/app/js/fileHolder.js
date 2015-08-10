"use strict";

function fileHolder(headerText, id, fileMap){
	// set some variables
	this.id = id;
	this.headerText = headerText;
	this.fileMap = fileMap;

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
	this.divEl.addEventListener("dragenter", this.dragenter.bind(this), false);
	this.divEl.addEventListener("dragover", this.dragenter.bind(this), false);
	this.divEl.addEventListener("drop", this.drop.bind(this), false);

	// create element
	document.body.appendChild(this.htmlEl);
}

fileHolder.prototype.dragenter = function(e){
	e.stopPropagation();
	e.preventDefault();
}

fileHolder.prototype.dragover = function(e){
	e.stopPropagation();
	e.preventDefault();
}

fileHolder.prototype.drop = function(e){
	e.stopPropagation();
	e.preventDefault();
	var dt = e.dataTransfer;
	var files = dt.files;

	var el = document.getElementById(this.id + 'div');
	var text = "";
	for (var i = 0; i < files.length; i++){
		text += "<li>" + files[i].name + "</li>";
		this.fileMap.set(files[i].name, files[i].path);
	}
	el.innerHTML = el.innerHTML + text;
}

fileHolder.prototype.getFilesToSave = function(){
	var fileDivs = document.getElementById(this.id + 'div').children;
	var saveFiles = [];
	for (var i = 0; i < fileDivs.length; i++){
		var name = fileDivs[i].innerHTML;
		var pageFile = this.fileMap.get(name);
		if (pageFile != ""){
			saveFiles.push({'path': pageFile, 'name': name});
		}
	}
	return saveFiles;
}

fileHolder.prototype.load = function(saveFiles){
	var text = "";
	var el = document.getElementById(this.id + 'div');
	for (var i = 0; i < saveFiles.length; i++){
		if (saveFiles[i].name &&
			saveFiles[i].path){
			text += "<li>" + saveFiles[i].name + "</li>";
			this.fileMap.set(saveFiles[i].name, saveFiles[i].path);
		}
	}
	el.innerHTML = el.innerHTML + text;
}


