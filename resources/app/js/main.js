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
    
	function buildReady(){
		var ready = true;
		if (document.getElementById('headerdiv').innerHTML === "")
			ready = false;
		if (document.getElementById('footerdiv').innerHTML === "")
			ready = false;
		if (document.getElementById('pagesdiv').innerHTML === "")
			ready = false;
		$('#createButton').prop('disabled', !ready);
	}

	// move this functionality to class
	function createButtonPressed(){
		// variables
		var folderName = 'output';
		var settings = [];
		var outputText = '';

		for (let holder of files){
			var filesToSave = holder.getFilesToSave();
			for (var i = 0; i < filesToSave.length; i++){
				outputText += fs.readFileSync(filesToSave[i].path);
			}
			settings.push(filesToSave);
		}
		 
        // write to output file
        fs.writeFileSync(folderName + '/index.html', outputText);
        // write to settings file
		fs.writeFileSync('settings.json', JSON.stringify(settings));
	}

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
        var settings = JSON.parse(fs.readFileSync('settings.json'));
		for (var i = 0; i < files.length; i ++){
			files[i].load(settings[i]);
		}
	}


	grabSettings();
    createButton();

    dragula([document.getElementById('pagesdiv'),
            document.getElementById('headerdiv'),
            document.getElementById('footerdiv')], {removeOnSpill: true});


    $('.dropbox').bind("DOMSubtreeModified", buildReady);
    buildReady();

});
