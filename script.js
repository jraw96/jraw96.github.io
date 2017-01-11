var source;
var total;
//Get text file that user uploads
window.onload = function() {
		var fileInput = document.getElementById('fileInput');
		var fileDisplayArea = document.getElementById('fileDisplayArea');
		
		displayTextFile(fileInput,fileDisplayArea);
}


//Display contents of selected file inside text box
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
				
				
				document.getElementById("solve").innerHTML = '<button class = "button" button onclick="call()"> Count hard earned money</button>'; 
				document.getElementById("dataTitle").innerHTML = '<h3> Selected file contents:</h3>';
				document.getElementById("step2").innerHTML = '<p><b> Step 2:</b> Click the green button below to search the text file and calculate total order revenue </p>';
				
				
			} else {
				fileDisplayArea.innerText = "File not supported!"
			}	
		});
}

//Pass the search terms that will be looked for in the Shopify Order forms
function call(){
	//Temporary value array that will hold all the searched for words.
	var tokenArray = [];
	
	
	//Values to be displayed on the UI.
	//To optimize the process below, a loop can definitely be implemented. For now since there are only a few statistics, entering them manually is okay.
	var totalCadPrice;
	var totalUsdPrice;
	var cadSubTotal;
	var taxTotal;
	var discountTotal;
	
	tokenArray = find("total_price");
	totalCadPrice = getTotal(tokenArray);
	
	tokenArray = find("total_price_usd");
	totalUsdPrice = getTotal(tokenArray);
	
	tokenArray = find("subtotal_price");
	cadSubTotal = getTotal(tokenArray);
	
	tokenArray = find("tax");
	taxTotal = getTotal(tokenArray);
	
	tokenArray = find("total_discount");
	discountTotal = getTotal(tokenArray);

	//Insert data into respective divs in the shopify.html file
	document.getElementById("cadTotal").innerHTML = "$" + totalCadPrice;
	document.getElementById("usdTotal").innerHTML = "$" + totalUsdPrice;
	document.getElementById("cadSubTotal").innerHTML = "$" + cadSubTotal;
	document.getElementById("tax").innerHTML = "$" + taxTotal;
	document.getElementById("discount").innerHTML = "$" + discountTotal;
	
	//Reveal data in fade-in effect
	document.getElementById("answer").style.display = "block";
}


function find(term){
	
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
	
	
	
	
	var termSize = term.length; // Get the size of the word to be searched
	console.log("termSize: " + termSize);
	
	var taxable = []; //string array;
	var taxSize = 0;
	var taxWord = "";
	var taxBool = "";
	var taxList = [];
	
	for(i = 0; i < size; i++){ // Go through every character in the string, looking for each keyword 'price'
		priceList.push(temp[i]); //Every time 5 characters are in a row, check if they are equal to the word 'price'
		tempSize = priceList.length;		
		i2 = i;
		//Every check every sequence of 5 letter words, to check if they equal price.
		
		if(tempSize == termSize){
			for(k = 0; k < termSize; k++){
				checkWord = checkWord + priceList[k]; // The 5 chars are now a string in checkWord
			}
			
			// If the checkWord is equal to price, save the char numbers associated with that product
			if(checkWord == term){ 
				if((temp[i2 + 3] == '"') && (temp[i2 - termSize] == '"')){
					var z = 4; //The value of price is 4 characters offset from the word 'price'
					//Once the word price has been located, search further in the string until the price value is found
					while(temp[i2 + z] != '"'){
						priceString = priceString + temp[i2 + z];
						
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

	return finalList; //return the array to the function called
	
}


function getTotal(list){
	
	var size;
	size = list.length;
	var temp;
	var total = 0;
	console.log("Elements inside array: " + list.length);
	
	for(i = 0; i <= size - 1; i++){
		console.log("Price found: " + list[i]);
		temp = parseFloat(list[i]);
		total = total + temp;
		console.log("Added " + temp + " to total");
		console.log("Current total: " + total);
	}
	console.log("Price total: " + total);
	
	total = Math.round(total * 100) / 100
	
	return total;
}


























