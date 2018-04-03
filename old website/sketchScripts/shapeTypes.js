// The specific types are specified in this javasript file. 
// These functions are called from the script.js file when invoked


// Shape Constructors -------------------------------------------------------------------
function myCircle(colour, initialSpotInCanvas , finalSpotInCanvas) {
    this.type = "circle";
    this.colour = colour;
    this.initialSpotInCanvas  = initialSpotInCanvas ;
    this.finalSpotInCanvas = finalSpotInCanvas;
}

function mySquare(colour, initialSpotInCanvas , finalSpotInCanvas) {
    this.type = "square";
    this.colour=colour;
    this.initialSpotInCanvas  = initialSpotInCanvas ;
    this.finalSpotInCanvas = finalSpotInCanvas;
}

function myLine(colour, initialSpotInCanvas , finalSpotInCanvas) {
    this.type = "line";
    this.colour=colour;
    this.initialSpotInCanvas  = initialSpotInCanvas ;
    this.finalSpotInCanvas = finalSpotInCanvas;
}

function myEllipse(colour, initialSpotInCanvas , finalSpotInCanvas) {
    this.type = "ellipse";
    this.colour=colour;
    this.initialSpotInCanvas  = initialSpotInCanvas ;
    this.finalSpotInCanvas = finalSpotInCanvas;
}

function myRectangle(colour, initialSpotInCanvas , finalSpotInCanvas) {
    this.type = "rectangle";
    this.colour=colour;
    this.initialSpotInCanvas  = initialSpotInCanvas ;
    this.finalSpotInCanvas = finalSpotInCanvas;
}

function myFreeForm(colour, initialSpotInCanvas ) {
    this.type = "freeForm";
    this.colour = colour;
    this.posArray = [];
    this.posArray.push(initialSpotInCanvas );
}



//Prototype object declarations declarations
myCircle.prototype = Object.create(template.prototype);
mySquare.prototype = Object.create(template.prototype);
myLine.prototype = Object.create(template.prototype);
myEllipse.prototype = Object.create(template.prototype);
myRectangle.prototype = Object.create(template.prototype);
myFreeForm.prototype = Object.create(template.prototype);


// Object initializtion
myCircle.prototype.constructor = myCircle;
mySquare.prototype.constructor = mySquare;
myLine.prototype.constructor = myLine;
myEllipse.prototype.constructor = myEllipse;
myRectangle.prototype.constructor = myRectangle;
myFreeForm.prototype.constructor = myFreeForm;





// Draw functions for each object -------------------------------------------------
myCircle.prototype.draw = function(cursor) {
    cursor.beginPath();
	
    cursor.arc( (this.finalSpotInCanvas.x + this.initialSpotInCanvas .x) / 2, 
				(this.finalSpotInCanvas.y + this.initialSpotInCanvas .y) / 2, 
				((this.finalSpotInCanvas.x + this.initialSpotInCanvas .x) / 2) - this.initialSpotInCanvas .x, 
				0, 
				2 * Math.PI, false);			
				
    cursor.fillStyle=this.colour;
    cursor.fill();
};

mySquare.prototype.draw = function(cursor) {
    cursor.fillStyle=this.colour;
    cursor.fillRect(this.initialSpotInCanvas .x,
					this.initialSpotInCanvas .y,
					this.finalSpotInCanvas.x - this.initialSpotInCanvas .x,
					this.finalSpotInCanvas.x - this.initialSpotInCanvas .x);
};

myLine.prototype.draw = function(cursor) {
    cursor.beginPath();
    cursor.moveTo(this.initialSpotInCanvas .x,this.initialSpotInCanvas .y);
    cursor.lineTo(this.finalSpotInCanvas.x,this.finalSpotInCanvas.y);
    cursor.strokeStyle = this.colour;
    cursor.stroke();
};

myEllipse.prototype.draw = function(cursor) {
    cursor.beginPath();
    cursor.moveTo( (this.finalSpotInCanvas.x + this.initialSpotInCanvas .x) / 2,
					this.initialSpotInCanvas .y);
					
    cursor.bezierCurveTo(this.finalSpotInCanvas.x, 
						 this.initialSpotInCanvas .y,
						 this.finalSpotInCanvas.x, 
						 this.finalSpotInCanvas.y,
						(this.finalSpotInCanvas.x + this.initialSpotInCanvas .x) / 2, this.finalSpotInCanvas.y);
    
	cursor.bezierCurveTo(this.initialSpotInCanvas .x, this.finalSpotInCanvas.y,
						 this.initialSpotInCanvas .x, this.initialSpotInCanvas .y,
						(this.finalSpotInCanvas.x + this.initialSpotInCanvas .x) / 2,
						this.initialSpotInCanvas .y);
						
    cursor.fillStyle = this.colour;
    cursor.fill();
};

myRectangle.prototype.draw = function(cursor) {
    cursor.fillStyle=this.colour;
    cursor.fillRect(this.initialSpotInCanvas .x,
					this.initialSpotInCanvas .y,
					this.finalSpotInCanvas.x - this.initialSpotInCanvas .x,
					this.finalSpotInCanvas.y - this.initialSpotInCanvas .y);
};

myFreeForm.prototype.draw = function(cursor) {
    cursor.fillStyle=this.colour;
	
    for (var i = 0; i < this.posArray.length; i++){
        cursor.fillRect(this.posArray[i].x - 3,
						this.posArray[i].y - 3,
						7,
						7);
    }
};



// Scan functions for each object in canvas ---------------------------------------------
myCircle.prototype.scan = function(cursorPos) {
    // Check if Object is not in the x-axis
    if ( Math.abs(cursorPos.x - (this.finalSpotInCanvas.x + this.initialSpotInCanvas .x) / 2) > ((this.finalSpotInCanvas.x + this.initialSpotInCanvas .x) / 2) - this.initialSpotInCanvas .x ) {
        return false;
    // Check if object is not in the y-axis
    }else if ( Math.abs(cursorPos.y - (this.finalSpotInCanvas.y + this.initialSpotInCanvas .y) / 2) > ((this.finalSpotInCanvas.x + this.initialSpotInCanvas .x) / 2) - this.initialSpotInCanvas .x ) {
        return false;
		
    //If inside the object 
    }else {
        return true;
    }
}

mySquare.prototype.scan = function(cursorPos) {
    // If rectangel is facing downwards
    if ((this.initialSpotInCanvas .x < cursorPos.x) && (cursorPos.x < this.finalSpotInCanvas.x) && (this.initialSpotInCanvas .y < cursorPos.y) && (cursorPos.y < this.finalSpotInCanvas.y)){
        return true;
		
    // If facing upwards 
    }else if ((this.initialSpotInCanvas .x > cursorPos.x) && (cursorPos.x > this.finalSpotInCanvas.x) && (this.initialSpotInCanvas .y > cursorPos.y) && (cursorPos.y > this.finalSpotInCanvas.y)){
        return true;
		
    //If entirely not in rectange 
    }else {
        return false;
    }
}

myLine.prototype.scan = function(cursorPos) {
    // Get cross product of the two cursor positions and check if it meets the cursor
    var crossproduct = (cursorPos.y - this.initialSpotInCanvas .y) * (this.finalSpotInCanvas.x - this.initialSpotInCanvas .x) - (cursorPos.x - this.initialSpotInCanvas .x) * (this.finalSpotInCanvas.y - this.initialSpotInCanvas .y);
    if ((Math.abs(crossproduct) < 1800)){
        return true;
		
    //If not, return false 
    } else {
        return false;
    }
}

myEllipse.prototype.scan = function(cursorPos) {
    var deltaX = cursorPos.x - (this.finalSpotInCanvas.x + this.initialSpotInCanvas .x) / 2;
    var deltaY = cursorPos.y - (this.finalSpotInCanvas.y + this.initialSpotInCanvas .y) / 2;
	
    var xRad = (this.finalSpotInCanvas.x + this.initialSpotInCanvas .x) / 2 - this.initialSpotInCanvas .x;
    var yRad = (this.finalSpotInCanvas.y + this.initialSpotInCanvas .y) / 2 - this.initialSpotInCanvas .y;
	
    if (( deltaX * deltaY ) / ( xRad * xRad ) + ( deltaY * deltaY ) / ( yRad * yRad ) <= 1){
        return true;
    } else {
        return false;
    }
}

myRectangle.prototype.scan = function(cursorPos) {
    //If facing downwards, similiar to the square
    if ((this.initialSpotInCanvas .x < cursorPos.x) && (cursorPos.x < this.finalSpotInCanvas.x) && (this.initialSpotInCanvas .y < cursorPos.y) && (cursorPos.y < this.finalSpotInCanvas.y)){
        return true;
		
    //If facing upwards 
    }else if ((this.initialSpotInCanvas .x > cursorPos.x) && (cursorPos.x > this.finalSpotInCanvas.x) && (this.initialSpotInCanvas .y > cursorPos.y) && (cursorPos.y > this.finalSpotInCanvas.y)){
        return true;
		
    //IF not in rectangle 
    }else {
        return false;
    }
}

myFreeForm.prototype.scan = function(cursorPos) {
    for (var i = 0; i < this.posArray.length; i++){
        if ((this.posArray[i].x - 3 < cursorPos.x) && (cursorPos.x < this.posArray[i].x + 3) && (this.posArray[i].y - 3 < cursorPos.y) && (cursorPos.y < this.posArray[i].y + 3)){
            return true;
			
        //IF the freeform shape is drawn downwards
        }else if ((this.posArray[i].x - 3 > cursorPos.x) && (cursorPos.x > this.posArray[i].x + 3) && (this.posArray[i].y - 3 > cursorPos.y) && (cursorPos.y > this.posArray[i].y + 3)){
            return true;
        }
    }
    //Not in region
    return false;
}


// Move funtions for each object ---------------------------------------------------
myCircle.prototype.move = function(moveX,moveY) {
    this.initialSpotInCanvas.x += moveX;
    this.initialSpotInCanvas.y += moveY;
    this.finalSpotInCanvas.x += moveX;
    this.finalSpotInCanvas.y += moveY;
}

mySquare.prototype.move = function(moveX,moveY) {
    this.initialSpotInCanvas.x += moveX;
    this.initialSpotInCanvas.y += moveY;
    this.finalSpotInCanvas.x += moveX;
    this.finalSpotInCanvas.y += moveY;
}

myLine.prototype.move = function(moveX,moveY) {
    this.initialSpotInCanvas.x += moveX;
    this.initialSpotInCanvas.y += moveY;
    this.finalSpotInCanvas.x += moveX;
    this.finalSpotInCanvas.y += moveY;
}

myEllipse.prototype.move = function(moveX,moveY) {
    this.initialSpotInCanvas.x += moveX;
    this.initialSpotInCanvas.y += moveY;
    this.finalSpotInCanvas.x += moveX;
    this.finalSpotInCanvas.y += moveY;
}

myRectangle.prototype.move = function(moveX,moveY) {
    this.initialSpotInCanvas.x += moveX;
    this.initialSpotInCanvas.y += moveY;
    this.finalSpotInCanvas.x += moveX;
    this.finalSpotInCanvas.y += moveY;
}

myFreeForm.prototype.move = function(moveX,moveY) {
    for (var i = 0; i < this.posArray.length; i++){
        this.posArray[i].x += moveX;
        this.posArray[i].y += moveY;
    }
}


// Custom free form drawing functions:
myFreeForm.prototype.addPt = function(newPt) {
    this.posArray.push(newPt);
}

myFreeForm.prototype.addArray = function(newArray) {
    this.posArray = newArray;
}



