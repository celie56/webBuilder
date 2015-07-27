// Created by Chris Elie
// todo: add more documentation and comments

window.$ = window.jQuery = require('./js/jquery.js');
var fs = require('fs');

rmDir = function(dirPath) {
    try { var files = fs.readdirSync(dirPath); }
    catch(e) { return; }
    if (files.length > 0)
        for (var i = 0; i < files.length; i++) {
            var filePath = dirPath + '/' + files[i];
            if (fs.statSync(filePath).isFile())
                fs.unlinkSync(filePath);
            else
                rmDir(filePath);
        }
//    fs.rmdirSync(dirPath);
};

var init = function(){
    // variables
	var dropbox;
    var headerFile = {
        path: "",
        name: ""
    };
    var footerFile = {
        path: "",
        name: ""
    };
    var fileMap = new Map();
    
    // set settings from previous session
    function grabSettings(){
        var settings = JSON.parse(fs.readFileSync('settings.json'));
        headerFile = settings[0];
        footerFile = settings[1];
        
        document.getElementById('headerDrop').innerHTML = "<div>" + headerFile.name + "</div>";
        $('#headerDrop').addClass('good');
        document.getElementById('footerDrop').innerHTML = "<div>" + footerFile.name + "</div>";
        $('#footerDrop').addClass('good');
        
        // file map
        var tempMap = new Map();
        var text = "";
        for (var i = 0; i < settings[2].length; i++){
            tempMap.set(settings[2][i].name, settings[2][i].path);
            text += "<li>" + settings[2][i].name + "</li>";
        }
        fileMap = tempMap;
        document.getElementById('pagesDrop').innerHTML = text;
    }
    grabSettings();
    
    // start dragula for files
    dragula([document.getElementById('pagesDrop'),
            document.getElementById('headerDrop'),
            document.getElementById('footerDrop')], {removeOnSpill: true});

    // setting drag functionaliy
    function addListeners(dropbox){
        dropbox.addEventListener("dragenter", dragenter, false);
        dropbox.addEventListener("dragover", dragover, false);
        dropbox.addEventListener("drop", drop, false);
    }
    
	dropbox = document.getElementById("headerDrop");
    addListeners(dropbox);
	dropbox = document.getElementById("footerDrop");
    addListeners(dropbox);
	dropbox = document.getElementById("pagesDrop");
    addListeners(dropbox);
    
	function dragenter(e) {
		e.stopPropagation();
	  	e.preventDefault();
	}

	function dragover(e) {
		e.stopPropagation();
	  	e.preventDefault();
	}

	function drop(e) {
		e.stopPropagation();
	  	e.preventDefault();
	  	var dt = e.dataTransfer;
	  	var files = dt.files;
	  	handleFiles(files, this);
	}
    
    // enable or disable build depending
    function buildReady(){
        var ready = true;
        if (document.getElementById('headerDrop').innerHTML === "")
            ready = false;
        if (document.getElementById('footerDrop').innerHTML === "")
            ready = false;
        if (document.getElementById('pagesDrop').innerHTML === "")
            ready = false;
        $('#create').prop('disabled', !ready);
    }

    // todo: handle multiple header and footer files
	function handleFiles(files, el) {
        var text = "";
        
        // Handle Header
        if (el.id === "headerDrop"){
            var header = document.getElementById('headerText');
            if (files.length === 1){
                text = files[0].name;
                headerFile.name = text;
                headerFile.path = files[0].path;
                $('#' + el.id).addClass('good');
            }
            else{
                text = "Too many files selected";
                $('#' + el.id).removeClass('good');
            }
            el.innerHTML = "<div>" + text + "</div>";
        }
        
        // Handle Footer
        else if (el.id === "footerDrop"){
            var header = document.getElementById('footerText');
            var text = "Too many files selected";
            if (files.length === 1){
                text = files[0].name;
                footerFile.name = text;
                footerFile.path = files[0].path;
                $('#' + el.id).addClass('good');
            }
            else{
                $('#' + el.id).removeClass('good');
            }
            el.innerHTML = "<div>" + text + "</div>";
        }
        
        // Handle Pages
        else if (el.id === "pagesDrop"){
            var header = document.getElementById('pagesText');
            var text = "";
            // check default
            if (el.innerHTML === "Drop files here")
                el.innerHTML = "";
            for (var i = 0; i < files.length; i++){
                text += "<li>" + files[i].name + "</li>";
                fileMap.set(files[i].name, files[i].path);
            }
            el.innerHTML += text;
        }
	}
    
    // todo: allow for setting different output directory
    function createOutput(){
        var folderName = 'output';
        
        var outputText = "";
        var saveText = [];
        
        // check to make sure the folder exists
        fs.mkdir(folderName, function(err){});
        
        // grab data from files
        if (headerFile.path !== ""){
            outputText += fs.readFileSync(headerFile.path);
            saveText.push(headerFile);
        }

        var fileDivs = document.getElementById('pagesDrop').children;
        var saveFiles = [];
        for (var i = 0; i < fileDivs.length; i++){
            var name = fileDivs[i].innerHTML;
            var pageFile = fileMap.get(name);
            if (pageFile !== ""){
                outputText += fs.readFileSync(pageFile);
                saveFiles.push({'path': pageFile, 'name': name});
            }
        }
        
        if (footerFile.path !== ""){
            outputText += fs.readFileSync(footerFile.path);
            saveText.push(footerFile);
        }
        
        saveText.push(saveFiles);
        
        // write to output file
        fs.writeFileSync(folderName + '/index.html', outputText);
        
        // write to settings file
        fs.writeFileSync('settings.json', JSON.stringify(saveText));
    }
    
    var createButton = document.getElementById('create');
    createButton.addEventListener('click', createOutput, false);
    
    // On any change in the dom, check if buildReady
    $('.dropbox').bind("DOMSubtreeModified", buildReady);
    // check buildReady at beginning
    buildReady();
}

// Get the party started in here
$(document).ready(init);
