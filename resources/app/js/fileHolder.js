"use strict";
function extend(base, sub) {
	// Avoid instantiating the base class just to setup inheritance
  	// See https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/create
  	// for a polyfill
  	// Also, do a recursive merge of two prototypes, so we don't overwrite 
  	// the existing prototype, but still maintain the inheritance chain
  	// Thanks to @ccnokes
  	var origProto = sub.prototype;
  	sub.prototype = Object.create(base.prototype);
  	for (var key in origProto)  {
		sub.prototype[key] = origProto[key];
  	}
  	// Remember the constructor property was set wrong, let's fix it
  	sub.prototype.constructor = sub;
  	// In ECMAScript5+ (all modern browsers), you can make the constructor property
  	// non-enumerable if you define it like this instead
  	Object.defineProperty(sub.prototype, 'constructor', { 
		enumerable: false, 
		value: sub 
  	});
}

////////////////////////////////////////////////////////////////////////////////
//	File Holder                                                               //
////////////////////////////////////////////////////////////////////////////////
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
		if (dt.items[i].webkitGetAsEntry().isFile){
			text += "<li>" + files[i].name + "</li>";
			this.fileMap.set(files[i].name, files[i].path);
		}
	}
	el.innerHTML = el.innerHTML + text;
}

// get the current session's files
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

// load the files from the previous session
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


////////////////////////////////////////////////////////////////////////////////
//	Directory Holder                                                          //
////////////////////////////////////////////////////////////////////////////////
function directoryHolder(headerText, id, fileMap){
	fileHolder.call(this, headerText, id, fileMap);
	this.divEl.setAttribute('class', 'folderbox');
}
directoryHolder.prototype.drop = function(e){
	e.stopPropagation();
	e.preventDefault();
	var dt = e.dataTransfer;
	var files = dt.files;

	var el = document.getElementById(this.id + 'div');
	var text = "";
	if (el.innerHTML != "") el.innerHTML = '';
	for (var i = 0; i < files.length; i++){
		if (i === 1) break;
		if (dt.items[i].webkitGetAsEntry().isDirectory){
			text += "<li>" + files[i].name + "</li>";
			this.fileMap.set(files[i].name, files[i].path);
		}
	}
	el.innerHTML = el.innerHTML + text;
}
// Let's make this permenant
extend(fileHolder, directoryHolder);
