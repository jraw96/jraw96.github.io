// Drawing Type Buttons
var circle;
var line;
var square;
var freeForm;
var rectangle;
var ellipse;

// Colour Variables
var blue;
var red;
var yellow;
var green;
var orange;
var purple;

// Option variables 
var del;
var move;
var copy;
var undo;
var redo;
var group;
var ungroup;
var paste;
var canPaste;
var rePaste;

// Canvas Variables 
var canvas;
var mouse;
var mouseClick;
var mouseRelease;

// Script variables. These variables will be arrays that will save values. 
var shapeList = [];
var undoList = [];
var redoList = [];
var initialSpotInCanvas;
var shapePosition;



// Ready state 
$(document).ready(function(){
    
	//Get Canvas object
    canvas = document.getElementById("canvas");
	console.log("Canvas enabled.");
	//Enable default values. Freeform is selected first. 
    freeForm = true; 
	console.log("FreeFrom set as default mode.");
	
	circle = false;
	line = false;
	square = false;
	rectangle = false;
	ellipse = false;
	mouseClick = false;
	move = false;
	group = false;
	copy = false;
	ungroup = false;
	
	document.getElementById("descriptionHeading").innerHTML = '<h1> Description: Click anywhere in the canvas to start drawing crazy shapes </h1>'
	document.getElementById("description").innerHTML = '<p> Select an option in one of the columns, then draw on the canvas on the right!</p>'
	document.getElementById("currentColour").innerHTML = '<p> Current colour: dark blue. </p>'
	
	
	// Deep blue colour as default
    colour = "#000066";
    mouse = canvas.getContext("2d");
    
	
    var mouseObj;
  
	//Canvas Operations --------------------------
	// Find the current location and operation of the current mouse position/event. 
    $('#canvas').mousedown(function(e){
        
        // 
        mouseClick = true;
        
        //get starting coordinates
        if (freeForm || line || rectangle || square || circle || ellipse || move || copy || group || ungroup) {
            initialSpotInCanvas = getPosition(canvas);
        }
        
        //Freeform object declaration. Set colour and position 
        if (freeForm) {
            mouseObj = new myFreeForm(colour,initialSpotInCanvas);
			
        //gets object selected to move
        } else if (move || copy || group || ungroup) {
            shapePosition = scanCanvas(initialSpotInCanvas);  /// Check this 
        }
        
    });
    
	//Get the position of the mouse in real time on the canvas 
    $('#canvas').mousemove(function(e){

        if(freeForm  && mouseClick) {
            mouseObj.addPt(getPosition(canvas));
        }
    });
    
	
	//Define behaviour upon mouse release 
    $('#canvas').mouseup(function(e){
        
        //register that mouse is up
        mouseClick = false;
        
        //Get the position of the end of the mouse 
        var finalSpotInCanvas = getPosition(canvas);
        
		
		
        //Depending on the Drawing type selected, create a the corresponding shape ----------------------------------
		
		
        //Create and push a Line Object 
        if (line) {
            pushUndoQ();
            var newLine = new myLine(colour,initialSpotInCanvas,finalSpotInCanvas);
            shapeList.push(newLine);			
			draw(canvas,mouse);
        //Create and push a Rectangle Object 
        } else if (rectangle) {
            pushUndoQ();
            var newRectangle = new myRectangle(colour,initialSpotInCanvas,finalSpotInCanvas);
            shapeList.push(newRectangle);
			
			draw(canvas,mouse);
        //Create and push a Square Object 
        } else if (square) {
            pushUndoQ();
            var newSquare = new mySquare(colour,initialSpotInCanvas,finalSpotInCanvas);
            shapeList.push(newSquare);
			draw(canvas,mouse);
			
        //Create and push a Circle Object 
        } else if (circle && finalSpotInCanvas.x > initialSpotInCanvas.x && finalSpotInCanvas.y > initialSpotInCanvas.y) {
            pushUndoQ();
            var newCircle = new myCircle(colour,initialSpotInCanvas,finalSpotInCanvas);
            shapeList.push(newCircle);
			draw(canvas,mouse);
			//if shape is freehand
        } else if (freeForm) {
            pushUndoQ();
            shapeList.push(mouseObj);
			draw(canvas,mouse);
			
        //Create and push an Ellipse Object 
        } else if (ellipse && finalSpotInCanvas.x > initialSpotInCanvas.x && finalSpotInCanvas.y > initialSpotInCanvas.y) {
            pushUndoQ();
            var newEllip = new myEllipse(colour,initialSpotInCanvas,finalSpotInCanvas);
            shapeList.push(newEllip);

       
	   // Depending if an option button was pushed, apply the option function in the canvas --------------------------
	   
	   draw(canvas,mouse);
	   //Delete mode 
        } else if (del) {
            var objIndex = scanCanvas(getPosition(canvas));
			
            if (objIndex != -1){
                pushUndoQ();
                shapeList.splice(objIndex,1);
            }
			draw(canvas,mouse);
        //Move mode
        } else if (move) {
            if (shapePosition != -1) {
                pushUndoQ();
                var newPos = getPosition(canvas);
                shapeList[shapePosition].move(newPos.x - initialSpotInCanvas.x, newPos.y - initialSpotInCanvas.y);
				draw(canvas,mouse);
            }
			
			
        //Copy mode if no shape was selected. 
        } else if (copy) {
            if (shapePosition != -1) {
                pushUndoQ();
				console.log("Size of shapeList before copy: " + shapeList.length);
                var newPos = getPosition(canvas);
                var temp = jQuery.extend(true, {}, shapeList[shapePosition]);				
                temp.move(newPos.x - initialSpotInCanvas.x, newPos.y - initialSpotInCanvas.y);
                shapeList.push(temp);
				canPaste = true;
				rePaste = false;
				
				console.log("Item copied.");
				console.log("Size of shapeList after copy: " + shapeList.length);
            }
			
			
		} else if (paste && canPaste){
		
				pushUndoQ();
			
			console.log("Size of shapeList before paste: " + shapeList.length);
			
			if(!rePaste){
			console.log("In regular paste");
			var newPos = getPosition(canvas);
			
			var recent = shapeList.length - 1;
			
            shapeList[recent].move(newPos.x - initialSpotInCanvas.x, newPos.y - initialSpotInCanvas.y);
			
			draw(canvas,mouse); // Paste new object to current location of mouse.
			}
			
			// If the paste option is clicked repeatably on the same object, re-copy and paste the most recent object. 
			if(rePaste){
				console.log("In repaste.");
			var newPos = getPosition(canvas);
            var temp = jQuery.extend(true, {}, shapeList[shapePosition]);				
            temp.move(newPos.x - finalSpotInCanvas.x, newPos.y - finalSpotInCanvas.y);
            shapeList.push(temp);
			
			var recent = shapeList.length - 1;
			
            shapeList[recent].move(newPos.x - initialSpotInCanvas.x, newPos.y - initialSpotInCanvas.y);
			
			draw(canvas,mouse); // Paste new object to current location of mouse.
					
			}
			
			
			rePaste = true; 
			
			console.log("Size of shapeList after paste: " + shapeList.length);
			
        }  
    
        
    });
	
	
	//COLOUR BUTTONS------------------------------
    
    $('#black').on("click",function() {
        colour = "#000000";
		document.getElementById("currentColour").innerHTML = '<p> Current colour: black </p>'
    });
	
	$('#yellow').on("click",function() {
        colour = "#ffff00";
		document.getElementById("currentColour").innerHTML = '<p> Current colour: yellow </p>'
    });
    
    $('#red').on("click",function() {
        colour = "#ff3300";
		document.getElementById("currentColour").innerHTML = '<p> Current colour: red </p>'
    });
    
    $('#blue').on("click",function() {
        colour = "#0066ff";
		document.getElementById("currentColour").innerHTML = '<p> Current colour: blue. </p>'
    });
	
	$('#green').on("click",function() {
        colour = "#33cc33";
		document.getElementById("currentColour").innerHTML = '<p> Current colour: green </p>'
    });
	
	$('#purple').on("click",function() {
        colour = "#9933ff";
		document.getElementById("currentColour").innerHTML = '<p> Current colour: purple </p>'
    });
	
	$('#orange').on("click",function() {
        colour = "#ff6600";
		document.getElementById("currentColour").innerHTML = '<p> Current colour: orange </p>'
    });
	
	//MODE BUTTONS------------------------------
    
    $('#freeForm').on("click",function() {
		document.getElementById("descriptionHeading").innerHTML = '<h1> Description: Free Hand </h1>'
		document.getElementById("description").innerHTML = '<p> Hold left click, draw, then your free hand image will appear when you release. </p>'

		console.log("Switched to freeForm mode");
		var temp = "freeForm";
        setMode(temp);
    });
    
    $('#line').on("click",function() {
		document.getElementById("descriptionHeading").innerHTML = '<h1> Description: Line </h1>'
		document.getElementById("description").innerHTML = '<p> Hold left click, draw, then your line will appear pointing where you release </p>'
		console.log("Switched to line mode");
        var temp = "line";
        setMode(temp);
    });
    
    $('#rectangle').on("click",function() {
		document.getElementById("descriptionHeading").innerHTML = '<h1> Description: Rectangle </h1>'
		document.getElementById("description").innerHTML = '<p> Hold left click, anchoring the rectangle. <br> Then draw in the direction to create a rectangle by making its inner diagonal </p>'
		console.log("Switched to rectangle mode");
        var temp = "rectangle";
        setMode(temp);;
    });
    
    $('#square').on("click",function()  {
		document.getElementById("descriptionHeading").innerHTML = '<h1> Description: Square </h1>'
		document.getElementById("description").innerHTML = '<p> Just click to anchor the square, then drag to a corner on the screen. Easy.  </p>'
		console.log("Switched to square mode");
       var temp = "square";
       setMode(temp);
    });
    
    $('#circle').on("click",function()  {
		document.getElementById("descriptionHeading").innerHTML = '<h1> Description: Circle  </h1>'
		document.getElementById("description").innerHTML = '<p> Click to anchor the circle as if it were in a frame, then drag LEFT TO RIGHT. <br> YOU MUST DRAG LEFT TO RIGHT along the diagonal frame. <br> The circle will be in the middle. </p>'
		console.log("Switched to circle mode");
        var temp = "circle";
        setMode(temp);
    });
    
    $('#ellipse').on("click",function()  {
		document.getElementById("descriptionHeading").innerHTML = '<h1> Description: Ellipse </h1>'
		document.getElementById("description").innerHTML = '<p> A fancy circle that can be wider or more elongated. DRAG LEFT TO RIGHT.<br> Click circle to view more instructions. </p>'
		console.log("Switched to ellipse mode");
        var temp = "ellipse";
        setMode(temp);
    });
    
    $('#del').on("click",function() {
		document.getElementById("descriptionHeading").innerHTML = '<h1> Description: Delete </h1>'
		document.getElementById("description").innerHTML = '<p> Click on an object to delete it from the canvas </p>'
        var temp = "del";
        setMode(temp);
    });
    
    $('#move').on("click",function()  {
		document.getElementById("descriptionHeading").innerHTML = '<h1> Description: </h1>'
		document.getElementById("description").innerHTML = '<p> Hold left click on an object, then drag it to a screen and release it at its new position </p>'
        var temp = "move";
        setMode(temp);
    });
    
    $('#copy').on("click",function() {
		document.getElementById("descriptionHeading").innerHTML = '<h1> Description: Copy </h1>'
		document.getElementById("description").innerHTML = '<p> Click an object to copy it. You can now use paste. </p>'
        var temp = "copy";
        setMode(temp);
    });
    
    
    $('#paste').on("click",function()  {
		document.getElementById("descriptionHeading").innerHTML = '<h1> Description: Paste </h1>'
		document.getElementById("description").innerHTML = '<p> Left click somewhere on the canvas to paste your copied shape </p>'
        var temp = "paste";
        setMode(temp);
    });
	
    
	// The following states do not require further inputs from the user
    $('#save').on("click",function()  {
		document.getElementById("descriptionHeading").innerHTML = '<h1> Description: Save </h1>'
		document.getElementById("description").innerHTML = '<p> Everything in this moment that is currently on the canvas is now saved. <br> If you make changes, clicking the load button will bring you back to this state.</p>'
        localStorage.setItem("save", JSON.stringify(shapeList));
    });
    
    $('#load').on("click",function()  {
		
		document.getElementById("descriptionHeading").innerHTML = '<h1> Description: Load </h1>'
		document.getElementById("description").innerHTML = '<p> Delete everything on the canvas, then paste in what was most recently saved </p>'
        //get data from local storage and parse it
        var savedData = localStorage.getItem("save");
        var jsonFile = JSON.parse(savedData);
        
        //load the data and draw it
        shapeList = load(jsonFile);
        draw(canvas,mouse);
    });
    
	
    $('#undo').on("click",function()  {
		document.getElementById("descriptionHeading").innerHTML = '<h1> Description: Undo  </h1>'
		document.getElementById("description").innerHTML = '<p> Undo your most recent change. <br> In the current build of this app, using undo will not recover the previous positons of shapes (ie. moved). <br> My apologies.  </p>'
		
        var oldState = undoList.pop().slice();
        var currState = shapeList.slice();
        redoList.push(currState);
        shapeList = oldState;
        draw(canvas,mouse);
    });
    
    $('#redo').on("click",function()  {
		document.getElementById("descriptionHeading").innerHTML = '<h1> Description: redo </h1>'
		document.getElementById("description").innerHTML = '<p> Used undo prematurely? Get it back by clicking this button </p>'
        var oldState = redoList.pop().slice();
        var currState = shapeList.slice();
        undoList.push(currState);
        shapeList = oldState;
        draw(canvas,mouse);
    });

});


    
	
	// End of Mode Buttons ----------------------------------
    

//Functions --------------------------------

//Set boolean variables depending on the Button clicked in the UI
function setMode(sel){
		
		if(sel == "circle"){ // Set circle 
			circle = true;
		}
		else {
			circle = false;
		}
		
		if(sel == "line"){ // Set line 
			line = true;
		}
		else {
			line = false;
		}
		
		if(sel == "square"){ // Set square 
			square = true;
		}
		else {
			square = false;
		}
		
		if(sel == "rectangle"){ // Set rectangle 
			rectangle = true;
		}
		else {
			rectangle = false;
		}
		
		if(sel == "freeForm"){ // Set freeForm 
			freeForm = true;
		}
		else {
			freeForm = false;
		}
		
		if(sel == "ellipse"){ // Set ellipse 
			ellipse = true;
		}
		else {
			ellipse = false;
		}
		
		if(sel == "del"){ // Set delete 
			del = true;
		}
		else {
			del = false;
		}
		
		if(sel == "move"){ // Set move 
			move = true;
		}
		else {
			move = false;
		}
		
		if(sel == "copy"){ // Set copy 
			copy = true;
		}
		else {
			copy = false;
		}
		
		if(sel == "paste"){ // Paste object 
			paste = true;
		}
		else {
			paste = false;
		}		
}

//Scan and check if there is an object beneath the mouse position 
function scanCanvas(spot) {
    //Return the spot on the screen of the object, if there is one
    for (var i = shapeList.length - 1; i > -1; i--){
        if (shapeList[i].scan(spot)){
			
            return i;
        }
    }
    
    return -1;
}

//Update the redo queue
function pushUndoQ() {
	
    var temp = shapeList.slice(); // Copy the shallow contents of the array into a temporary value. 
    undoList.push(temp); // Store in the undo array. 
    redoList = []; // Clear the redo array
}


//Return the mouse position in the canvas
function getPosition(canvas) {
    var temp = canvas.getBoundingClientRect();
    return {
        x: event.clientX - temp.left,
        y: event.clientY - temp.top
    };
}

//clears canvas and redraws everything
function draw(canvas, mouse) {
	
	// Clear every object in the current canvas 
    mouse.clearRect(0, 0, canvas.width, canvas.height);
	
	// Draw everything from scratch again with updated info
    for (var i = 0; i < shapeList.length; i++){
		
		//Re draw every shap saved in the shape list. 
        shapeList[i].draw(mouse);
    }
}


//Load shapes from the localStorage. This function will uses the classes in the separate javascript files
function load(jsonFile) {
    
    var temp;
    var loadThese = [];
	
	
    for (var i = 0; i < jsonFile.length; i++){
		
        //Create line
        if (jsonFile[i].type == "line") {
			
			
            temp = new myLine(jsonFile[i].colour,jsonFile[i].initialSpotInCanvas,jsonFile[i].finalSpotInCanvas);
            loadThese.push(temp);
			
		//Create circle 
        } else if (jsonFile[i].type == "circle") {
            temp = new myCircle(jsonFile[i].colour,jsonFile[i].initialSpotInCanvas,jsonFile[i].finalSpotInCanvas);
            loadThese.push(temp);
			
		//Create freeForm 
        } else if (jsonFile[i].type == "freeForm") {
            temp = new myFreeForm(jsonFile[i].colour,jsonFile[i].initialSpotInCanvas);
            temp.addArray(jsonFile[i].posArray);
            loadThese.push(temp);
			
        //Create rectangle
        } else if (jsonFile[i].type == "rectangle") {
			
            temp = new myRectangle(jsonFile[i].colour,jsonFile[i].initialSpotInCanvas,jsonFile[i].finalSpotInCanvas);
            loadThese.push(temp);
			
        //Create square 
        } else if (jsonFile[i].type == "square") {
            temp = new mySquare(jsonFile[i].colour,jsonFile[i].initialSpotInCanvas,jsonFile[i].finalSpotInCanvas);
            loadThese.push(temp);
			
			
        //Create ellipse
        } else if (jsonFile[i].type == "ellipse") {
            temp = new myEllipse(jsonFile[i].colour,jsonFile[i].initialSpotInCanvas,jsonFile[i].finalSpotInCanvas);
            loadThese.push(temp);
			
      		
        //Create a grouped shape. This take every previous shape as one shape, and combines with a new shape to make one total shape.
        } else if (jsonFile[i].type == "group") {
            var temp2 = [];
            temp2 = load(jsonFile[i].shapeList);
			
			//COmbine both images, into one, then pass to the same draw function. 
            temp = new myGroup(temp2[0],temp2[1]);
            loadThese.push(temp);
        }
    }
    
    return loadThese;
    
}
