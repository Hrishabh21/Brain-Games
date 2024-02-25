const colors = ["Red", "Blue", "Green", "Yellow"];
const challengeName = ["Text", "Color","Text", "Color","Text", "Color","Text", "Color","Text", "Color"];
const options = document.querySelectorAll(".option");
const challengeText = document.getElementById("challenge-text");
const timer = document.getElementById("timer");
const resultElement = document.getElementById("result");
const startButton = document.getElementById("start-button");
const improvement=document.getElementById("improve");
let isGameOver=false;

let intervalId;
let score = 0;
let highestScore =0;
let lifeline = 1;
let timerInterval = 10000; 
let gainScore=0;
let scores=new Array();
let improve=0;
//localStorage.clear();

let currentPlayer;

document.addEventListener('DOMContentLoaded', async () => {
    const welcomeMessage = document.getElementById('current-player');

    try {
        // fetch the current player name from the server
        const response = await fetch('/getCurrentPlayer');
        const data = await response.json();

       
        if (data && data.playerName) {
            welcomeMessage.textContent = `Hi, ${data.playerName}!`;
            currentPlayer=data.playerName;

            
            fetchPlayerData(currentPlayer);
            
        } else {
            welcomeMessage.textContent = 'Hi, Guest User!';
        }
    } catch (error) {
        console.error('An error occurred while fetching the current player:', error);
    }
});




document.getElementById("highest-score").innerText = "Highest Score: " + highestScore;

function fetchPlayerData(playerName) {
    // Fetch the player data from the server
    fetch(`/getPlayerData?playerName=${playerName}`)
        .then(response => response.json())
        .then(data => {
            
            scores = data.scores || [];
            highestScore = data.highestScore || 0;
           // fetchPlayerData(currentPlayer);
    calculateImprovement();

            
            document.getElementById("score").innerText = "Score: " + score;
            document.getElementById("highest-score").innerText = "Highest Score: " + highestScore;
        })
        .catch(error => console.error('Error fetching player data:', error));
}


function updatePlayerData(playerName, newScore) {
    // Update the player data on the server
    fetch('/updatePlayerData', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            playerName,
            newScore,
        }),
    })
    .then(response => response.json())
    .then(data => {
        
        console.log('Player data updated:', data);
    })
    .catch(error => console.error('Error updating player data:', error));
}



function startNewRound() {
   
    options[0].disabled=false;
           options[1].disabled=false;
           options[2].disabled=false;
           options[3].disabled=false;
    if (lifeline >= 0) {

        const randomText1 = challengeName[Math.floor(Math.random() * challengeName.length)];
        const randomText2 = colors[Math.floor(Math.random() * colors.length)];
       

        challengeText.innerText = randomText1 + " " + randomText2;
        const shuffledIndex=shuffleArray([0,1,2,3]);

        const shuffledColors = shuffleArray([...colors]);
        shuffledColors.forEach((color, index) => {
            options[index].innerText = shuffledColors[shuffledIndex[index]];
            options[index].style.backgroundColor = color;

            if (randomText1 === "Color") {
                options[index].onclick = () => checkAnswer(color === randomText2);
            } else {
                options[index].onclick = () => checkAnswer(shuffledColors[shuffledIndex[index]] === randomText2);
            }
        });


        
        let timeLeft = timerInterval / 1000;
        timer.innerText = timeLeft;
        clearInterval(intervalId);
        intervalId = setInterval(() => {
            if (!isGameOver) {
                if (lifeline >=0) {
                    timeLeft--;
                }
                timer.innerText = timeLeft;
        
                if (gainScore===50&&timerInterval>=3000) {
                    timerInterval -= 1000;
                    document.getElementById("score").innerText = "Score: " + score;
                    gainScore=0;
                }
        
                if (timeLeft === 0) {
                    clearInterval(intervalId);
                    //lifeline--;
                    checkAnswer(false);
                }
          
            }
        }, 1000);
    } 
    else {
        //updatePlayerData(currentPlayer, score);
        options[0].disabled=true;
        options[1].disabled=true;
        options[2].disabled=true;
        options[3].disabled=true;
        
        resultElement.innerText = "Game over!";
        if (score > highestScore) {
            highestScore = score;
           
            //localStorage.setItem("highScore", highestScore);
        }
        fetchPlayerData(currentPlayer);
        document.getElementById("highest-score").innerText = "Highest Score: " + highestScore;
        //calculateImprovement();
        
          
           isGameOver=true;
           calculateImprovement();

           options[0].disabled=true;
           options[1].disabled=true;
           options[2].disabled=true;
           options[3].disabled=true;
           
           lifeline=1;
           
          
        
        startButton.innerText = "Restart";
       startButton.style.display = "inline-block";
       
    }
}

function checkAnswer(isCorrect) {
    if (isCorrect) {
        score += 10;
        gainScore+=10;
        resultElement.innerText = "Correct! +10 Points";
    } else {
       
        if (score >= 5&&lifeline!=0) {
            score -= 5;
            gainScore-=10;

        }
            
            if(lifeline==0){
                isGameOver=true;
                updatePlayerData(currentPlayer,score);
                calculateImprovement();
                options[0].disabled=true;
                options[1].disabled=true;
                options[2].disabled=true;
                options[3].disabled=true;
            }
            lifeline--;
            
        
        resultElement.innerText = "Incorrect. Try again.";
    }

   
         
    document.getElementById("score").innerText = "Score: " + score;
    document.getElementById("highest-score").innerText = "Highest Score: " + highestScore;
    calculateImprovement();
    if(lifeline>=0){
    document.getElementById("lifeline").innerText = "Lifeline: " + lifeline;
    }
    setTimeout(() => {
        resultElement.innerText = "";
        startNewRound();
    }, 200);
}

function shuffleArray(array) {
    const shuffledArray = [...array];
    for (let i = shuffledArray.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffledArray[i], shuffledArray[j]] = [shuffledArray[j], shuffledArray[i]];
    }
    return shuffledArray;
}

startButton.addEventListener("click", function () {
    score = 0;
    lifeline = 1;
    timerInterval = 10000; 
    isGameOver=false;
    document.getElementById("lifeline").innerText = "Lifeline: " + lifeline;
    document.getElementById("score").innerText = "Score: 0";
    resultElement.innerText = "";
    startButton.style.display = "none";
    document.getElementById("highest-score").innerText = "Highest Score: " + highestScore;
    fetchPlayerData(currentPlayer);
    calculateImprovement();
    startNewRound();
    
});
function calculateImprovement(){
   // const arr=[...array];
    let n=scores.length;
    let p=n/2;
    if(p>4){
        p=4;
    }
    let sumi=0;
    let sumf=0;
    for(let i=0;i<=p;i++){
        sumi+=scores[i];
        sumf+=scores[n-1-i];
    }
    let imp=((sumf-sumi)/sumi)*100;
    improvement.innerText = imp.toFixed(2);
    //"Improvement:-"+imp;
}
