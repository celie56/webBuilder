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

$(document).ready(function(){
    "use strict";

	var fileMap = new Map();
    var files = [
        new fileHolder('Header files: '	, 'header'	,	fileMap),
        new fileHolder('Page files: '	, 'pages'	,	fileMap),
        new fileHolder('Footer files: '	, 'footer'	,	fileMap)
    ];

	var folderMap = new Map();
	var dir = new directoryHolder('Output directory: optional', 'outDir', folderMap);
    
	// Are we ready yet?
	function buildReady(){
		var ready = true;
		if (document.getElementById('headerdiv').innerHTML === "")	ready = false;
		if (document.getElementById('footerdiv').innerHTML === "")	ready = false;
		if (document.getElementById('pagesdiv').innerHTML === "")	ready = false;
		// make button disabled if not ready, such negativity
		$('#createButton').prop('disabled', !ready);
	}

	// Time to actually do something
	// Creates output
	function createButtonPressed(){
		// variables
		var folderName = 'output';
		var settings = {};
		var outputText = '';
		var outputfiles = [];

		// Handle files
		for (let holder of files){
			var filesToSave = holder.getFilesToSave();
			for (var i = 0; i < filesToSave.length; i++){
				outputText += fs.readFileSync(filesToSave[i].path);
			}
			outputfiles.push(filesToSave);
		}

		// Get the output directory, if specified
		if (dir.getFilesToSave().length > 0){
			folderName = dir.getFilesToSave()[0].path;
		}

		// Put things into settings container
		settings['files']	= outputfiles;
		settings['dir']		= dir.getFilesToSave();
		 
        // write to output file
        fs.writeFileSync(folderName + '/index.html', outputText);
        // write to settings file
		fs.writeFileSync('settings.json', JSON.stringify(settings));
	}

	// Create the create button :) 
	function createButton(){
		var button = document.createElement('button');
		button.setAttribute('id', 'createButton');
		button.innerHTML = 'Create';
		button.onclick = createButtonPressed;
		
		var p = document.createElement('p');
		p.appendChild(button);
		
		document.body.appendChild(p);
	}

    // set settings from previous session
    function grabSettings(){
		try{
			var settings = JSON.parse(fs.readFileSync('settings.json'));
			for (var i = 0; i < files.length; i ++){
				files[i].load(settings['files'][i]);
			}
			dir.load(settings['dir']);
		}
		catch(e){
			// no settings files -- that's fine
			console.log(e);
		}
	}

	// Let's call those functions
	grabSettings();
    createButton();

	// Handle dragging
    dragula([document.getElementById('pagesdiv'),
            document.getElementById('headerdiv'),
            document.getElementById('footerdiv')], {removeOnSpill: true});
	dragula([document.getElementById('outDirdiv')], {removeOnSpill: true});


	// everytime the dom of dropbox class changes, check if
	// we are ready to build
    $('.dropbox').bind("DOMSubtreeModified", buildReady);
    buildReady();

});
