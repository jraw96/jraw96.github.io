var source;



// ++++ UI Components +++++ 

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
				
				//One the text file is loaded, present the option to parse the file.
				document.getElementById("solve").innerHTML = '<button class = "button" button onclick="call()"> Count hard earned money</button>'; 
				document.getElementById("dataTitle").innerHTML = '<h3> Selected file contents:</h3>';
				document.getElementById("step2").innerHTML = '<p><b> Step 2:</b> Click the green button below to search the text file and calculate total order revenue </p>';
				
				
			} else {
				fileDisplayArea.innerText = "File not supported!"
			}	
		});
}


// ++++ Parsing Algorithm ++++ 

//Pass the search terms that will be looked for in the Shopify Order forms
function call(){
	//Temporary value array that will hold all the searched for words.
	var tokenArray = [];
	
	
	//Values to be displayed on the UI.
	//To optimize the process below, a loop can definitely be implemented.  For now since there are only a few statistics, entering them manually is okay.
	var totalCadPrice;
	var totalUsdPrice;
	var cadSubTotal;
	var taxTotal;
	var discountTotal;
	var numberOfOrders;
	
	
	//Find(x,y): The first paramter is a string passed into the search algorithm. The second paramter has a value of 1 or 2. If 1, search for a string. If 2, search for a number.
	//getTotal(x,y): The first parameter is an array of strings. The second paramter is a value of 1 or 2. If the value is 1, the function returns the sum of its numerical contents,\
	//				 if the value if a 2, it will return the quantity of elements in the array.
	tokenArray = find("total_price", "1");
	totalCadPrice = getTotal(tokenArray, "1");
	
	tokenArray = find("total_price_usd", "1");
	totalUsdPrice = getTotal(tokenArray, "1");
	
	tokenArray = find("subtotal_price", "1");
	cadSubTotal = getTotal(tokenArray,"1");
	
	tokenArray = find("tax","1");
	taxTotal = getTotal(tokenArray, "1");
	
	tokenArray = find("total_discount","1");
	discountTotal = getTotal(tokenArray,  "1");
	
	tokenarray = find("order_number", "2");
	numberOfOrders = getTotal(tokenArray, "2");

	//Insert data into respective divs in the shopify.html file
	document.getElementById("cadTotal").innerHTML = "$" + totalCadPrice;
	document.getElementById("usdTotal").innerHTML = "$" + totalUsdPrice;
	document.getElementById("cadSubTotal").innerHTML = "$" + cadSubTotal;
	document.getElementById("tax").innerHTML = "$" + taxTotal;
	document.getElementById("discount").innerHTML = "$" + discountTotal;
	document.getElementById("ordersTotal").innerHTML = numberOfOrders;
	
	//Reveal data in fade-in effect
	document.getElementById("answer").style.display = "block";
}


function find(term, sel){

	
	document.getElementById("fileDisplayArea").innerHTML = "";
	document.getElementById("dataTitle").innerHTML = "";
	
	// The entire shopify order is condensed in this string: temp
	var temp;
	temp = source.split(''); 
	
	//The string size of the order is held in this variable, size
	var size;
	size = temp.length;
	
	//Algorithm variables
	var wordList = []; // Char array; will store up to 5 characters in a row from the shopify order string
	var checkWord = ""; // string; will convert wordList into a string
	var wordString = ""; // string; holds the string value of a found price
	var finalList = []; // string array; will store all found prices
	var tempSize; // int; represents the size of wordList, and should remain at 5 for each iteration checking to see if it is equal to 'price'
	

	var termSize = term.length; // Get the size of the word to be searched
	
	for(i = 0; i < size; i++){ // Check every character in the entire Shopify order.
		wordList.push(temp[i]); //Every there are N characters in a row equal to the size of the passed term, check if they are the passed term.
		tempSize = wordList.length;		
	
		if(tempSize == termSize){ // Convert the list of char into a string.
			for(k = 0; k < termSize; k++){
				checkWord = checkWord + wordList[k]; // The 5 chars are now a string in checkWord
			}
			
			// If the checkWord is equal to the searched word, extract the value associated with that word.
			if(checkWord == term){ 
			
			if(sel == "1"){
				if((temp[i + 3] == '"') && (temp[i - termSize] == '"')){
					var z = 4; //String values are offset 4 characters from the key value.
					while(temp[i + z] != '"'){
						wordString = wordString + temp[i + z];
						z++;
					}
					finalList.push(wordString); // Save the value from the key-value pair into a new array. This array will collect all values.
					wordString = ""; // Clear the wordString variable, so it can hold a string next iteration
				}
			}
			
			
			//Save a value that is not a string; ie. a number or boolean.
			 if(sel == "2"){
				if((temp[i + 3] == '"') && (temp[i - termSize] == '"')){
					var z = 3; //Value's that aren't strings are offset by 3 characters.
					while(temp[i + z] != ','){
						wordString = wordString + temp[i + z];
						
						z++;
					}
					finalList.push(wordString); // Save the price of a product, which is now a string
					wordString = ""; // Clear the wordString variable, so it can hold a new price next iteration
					}	
				}
			}		
			checkWord = ""; // Clear the checkWord 			
			wordList.shift(); // Remove the last char, to make the size of the wordList char array 4. This way it will be 5 next push. 
		}
	}

	return finalList; //return the array so that it can be analyzed accordingly.
	
}



//This function takes an array and selection bit. It returns the total sum or number of elements in the array.
function getTotal(list, sel){

	var size;
	size = list.length;
	var temp;
	var total = 0;
	
	// Return sum
	if (sel == "1"){
	for(i = 0; i <= size - 1; i++){
		console.log("Price found: " + list[i]);
		temp = parseFloat(list[i]);
		total = total + temp;
	}
	
	
	total = Math.round(total * 100) / 100
	
		return total;
	}
	
	
	// Return the number of elements
	if (sel == "2"){
		return list.length;
	}
	
}


























