var sections = ["home","about","experience","skills","vietnam","france","books"];

function showSection(section) {

    // Hide all sections
    for(var i = 0; i <= sections.length - 1; i++){  
        let current = document.getElementById(sections[i])
        current.style.display = "none";
    }


    // reveal after
    for(var i = 0; i<=sections.length - 1; i++){
        if(section === sections[i]){
            let current = document.getElementById(section)
            current.style.display = "block"

            if(section === 'france' || section === 'vietnam'){
                let currentLabel = document.getElementById('travel-label');
                currentLabel.style.color = 'rgba(0, 0, 0, 1.9)';
            }else{
                let currentLabel = document.getElementById(section + '-label');
                currentLabel.style.color = 'rgba(0, 0, 0, 1.9)';
            }
         
        }
    }
}


function greyResume(){
    let currentLabel = document.getElementById('resume-label');
    currentLabel.style.color = 'rgba(0, 0, 0, 0.5)';
}


function greyAllLables(){
    for(var i = 0; i<=sections.length - 1; i++){

        if(sections[i] === 'france' || sections[i] === 'vietnam'){
            let currentLabel = document.getElementById('travel-label');
            currentLabel.style.color = 'rgba(0, 0, 0, 0.5)';
        }else{
            let currentLabel = document.getElementById(sections[i] + '-label');
            currentLabel.style.color = 'rgba(0, 0, 0, 0.5)';
        }            
    }
}

console.log("hiding!")
//showSection('home');

function setHomeLabel(){
    let currentLabel = document.getElementById('home-label');
    currentLabel.style.color = 'rgba(0, 0, 0, 1.9)';
}

setHomeLabel();


function showExperience(){
    document.getElementById('experiences').style.display = "block"
    document.getElementById('experience-cards').style.display = "block"
    document.getElementById('education').style.display = "none"
    document.getElementById('education-card').style.display = "none"

    
}

showExperience()


function showEducation(){
    document.getElementById('education').style.display = "block"
    document.getElementById('education-card').style.display = "block"
    document.getElementById('experiences').style.display = "none"
    document.getElementById('experience-cards').style.display = "none"
    
}




