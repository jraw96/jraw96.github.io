var source;
var total;
//Get text file that user uploads
window.onload = function() {
		var fileInput = document.getElementById('fileInput');
		var fileDisplayArea = document.getElementById('fileDisplayArea');
		
		displayTextFile(fileInput,fileDisplayArea);
}

// Get preloaded Shopify order
function useProvided(){
	
	var fileDisplayArea = document.getElementById('fileDisplayArea');
	
	var fs = require("fs");
	var text = fs.readFileSync("./order.txt");
	var textByLine = text.split("\n")
	
	
	displayTextFile(textByLine, fileDisplayArea);
	
}

function displayTextFile(fileInput, fileDisplayArea){
	
		fileInput.addEventListener('change', function(e) {
			var file = fileInput.files[0];
			
			var textType = /text.*/;

			if (file.type.match(textType)) {
				var reader = new FileReader();

				reader.onload = function(e) {
					fileDisplayArea.innerText = reader.result;
					source = reader.result;
				}

				reader.readAsText(file);	
				
				
				document.getElementById("solve").innerHTML = '<button class = "button" button onclick="calculate()"> Count hard earned money</button>'; 
				document.getElementById("dataTitle").innerHTML = '<h3> Selected file contents:</h3>';
				document.getElementById("step2").innerHTML = '<p><b> Step 2:</b> Click the green button below to search the text file and calculate total order revenue </p>';
				
				
			} else {
				fileDisplayArea.innerText = "File not supported!"
			}	
		});
}

function calculate(){
	//Clear text fields
	document.getElementById("fileDisplayArea").innerHTML = "";
	document.getElementById("dataTitle").innerHTML = "";
	
	// The entire shopify order is condensed in this string: temp
	var temp;
	temp = source.split(''); 
	
	//The string size of the order is held in this variable, size
	var size;
	size = temp.length;

	
	//Algorithm variables
	var priceList = []; // Char array; will store up to 5 characters in a row from the shopify order string
	var checkWord = ""; // string; will convert priceList into a string
	var priceString = ""; // string; holds the string value of a found price
	var finalList = []; // string array; will store all found prices
	var tempSize; // int; represents the size of priceList, and should remain at 5 for each iteration checking to see if it is equal to 'price'
	var i2; // Size of shopify order list
	
	var taxable = []; //string array;
	var taxSize = 0;
	var taxWord = "";
	var taxBool = "";
	var taxList = [];
	
	for(i = 0; i < size - 1; i++){ // Go through every character in the string, looking for each keyword 'price'
		priceList.push(temp[i]); //Every time 5 characters are in a row, check if they are equal to the word 'price'
		tempsize = priceList.length;		
		i2 = i;
		//Every check every sequence of 5 letter words, to check if they equal price.
		if(tempsize == 5){
			for(k = 0; k < 5; k++){
				checkWord = checkWord + priceList[k]; // The 5 chars are now a string in checkWord
			}
			
			// If the checkWord is equal to price, save the char numbers associated with that product
			if(checkWord == "price"){ 
				if(temp[i2 + 3] != 'n'){
					var z = 4; //The value of price is 4 characters offset from the word 'price'
					//Once the word price has been located, search further in the string until the price value is found
					while(temp[i2 + z] != '"'){
						priceString = priceString + temp[i2 + z];
						var sum = i2 + z;
						z++;
					}
					
					//Once the word price has been found, check further in the string to see if it is taxable:
					var loopKeeper = 1;
					while(loopKeeper == 1){
						taxable.push(temp[i2 + z]);
						taxSize = taxable.length;
						
						if(taxSize == 7){
							for(q = 0; q < taxSize; q++){
								taxWord = taxWord + taxable[q];
							}
							if(taxWord == "taxable"){
								while(temp[i2 + z + 3] != ','){
									taxBool = taxBool + temp[i2 + z + 3];
									z++;
								}
								taxList.push(taxBool);
								loopKeeper++;
							}
							taxWord = "";
							taxBool = "";
							taxable.shift();
						}					
						z++;
					}
					finalList.push(priceString); // Save the price of a product, which is now a string
					priceString = ""; // Clear the priceString variable, so it can hold a new price next iteration
				}
			}		
			checkWord = ""; // Clear the checkWord 			
			priceList.shift(); // Remove the last char, to make the size of the priceList char array 4. This way it will be 5 next push. 
		}
	}
	
	
	
	//Display variables
	var grand = 0; // float; Will hold the total sum of all found prices
	var convert = 0; // float; holds a temporary value of a string converted to a float
	
	for(i = 0; i < finalList.length; i++){
		console.log("Price found: " + finalList[i]);
		convert = parseFloat(finalList[i]);
		grand = grand + convert;
	}
	
	total = grand;
	priceSize = finalList.length;
	
	console.log("Total items: " + finalList.length);
	console.log("Money total: $" + grand);
	console.log("Taxables found: " + taxList.length);
	
	var taxes;
	taxes = taxList.length;
	
	//Activate the fields in the UI with information from the javascript
	displayStats(grand, priceSize, taxes);
	
	
}

function displayStats(grand, priceSize, taxes){
	
	
	document.getElementById("salesTotal").innerHTML = "$" + grand;
	document.getElementById("itemTotal").innerHTML = priceSize;
	document.getElementById("taxableTotal").innerHTML = taxes;
	document.getElementById("revenueTotal").innerHTML = "$" + grand;
	document.getElementById("answer").style.display = "block";

}
























