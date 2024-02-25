const guessInput = document.getElementById("guess-input");
const guessButton = document.getElementById("guess-button");
const message = document.getElementById("message");
const attempts = document.getElementById("attempts");
const scoreDisplay = document.getElementById("score");
const highestScoreDisplay = document.getElementById("highest");
const replayButton = document.getElementById("replay-button");
const improvement=document.getElementById("improve");

let secretNumber;
let remainingAttempts = 10;
let score = 0;
let highestScore = 0;//localStorage.getItem("bestScore") || 0;
let scores=new Array();

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

function fetchPlayerData(playerName) {
    // Fetch the player data from the server
    fetch(`/getPlayerData2?playerName=${playerName}`)
        .then(response => response.json())
        .then(data => {
            
            scores = data.scores || [];
            highestScore = data.highestScore || 0;
           // fetchPlayerData(currentPlayer);
    calculateImprovement();

            
            scoreDisplay.innerText = "Score: " + score;
            highestScoreDisplay.innerText = "Highest Score: " + highestScore;
        })
        .catch(error => console.error('Error fetching player data:', error));
}
//fetchPlayerData(currentPlayer);

function updatePlayerData(playerName, newScore) {
    // Update the player data on the server
    fetch('/updatePlayerData2', {
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



function updateHighestScore() {
    //if (score >= highestScore) {
     // highestScore = score;
      fetchPlayerData(currentPlayer);
     // localStorage.setItem("bestScore", highestScore);
   // }
  
    highestScoreDisplay.innerText = `Your Best : ${highestScore}`;
  }

function generateRandomNumber(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function startNewGame() {

    secretNumber = generateRandomNumber(1, 100);
    remainingAttempts = 10;
    attempts.innerText = remainingAttempts;
    score = 0;
    scoreDisplay.innerText = `Score:${score}`;
    highestScoreDisplay.innerText = `Your Best : ${highestScore}`;
    guessInput.value = "";
    message.innerText = "";
    guessInput.disabled = false;
    guessButton.disabled = false;
}

function checkGuess() {
    const userGuess = parseInt(guessInput.value);
   

    if (isNaN(userGuess) || userGuess < 1 || userGuess > 100) {
        message.innerText = "Please enter a valid number between 1 and 100.";
    } else {
        remainingAttempts--;

        if (userGuess === secretNumber) {
            message.innerText = "Congratulations! You guessed the correct number!";
            score = (remainingAttempts + 1) * 20;
            updatePlayerData(currentPlayer,score);
            guessInput.disabled = true;
            guessButton.disabled = true;
        } else if (userGuess < secretNumber) {
            let messageText = `${userGuess} :-( `;
            messageText += "Try a higher number.";
            message.innerText = messageText;
        } else {
            let messageText = `${userGuess} :-( `;
            messageText += "Try a lower number.";
            message.innerText = messageText;
        }

        attempts.innerText = remainingAttempts;

        if (remainingAttempts === 0) {
            message.innerText = `Game over. The correct number was ${secretNumber}.`;
            score=0;
            updatePlayerData(currentPlayer,score);
            
            scoreDisplay.innerText="Score: " + score;
            guessInput.disabled = true;
            guessButton.disabled = true;
            replayButton.style.display = "block";
            updateHighestScore();
        } else if (userGuess !== secretNumber) {
            guessInput.value = "";
        }

        scoreDisplay.innerText = `Score:${score}`;
        updateHighestScore();
        
          highestScoreDisplay.innerText = `Your Best : ${highestScore}`;
    }
}

guessButton.addEventListener("click", checkGuess);

guessInput.addEventListener("keydown", (event) => {
    if (event.key === "Enter") {
        checkGuess();
    }
});

replayButton.addEventListener("click", () => {
    startNewGame();
    if (score >= highestScore) {
        highestScore = score;
        fetchPlayerData(currentPlayer);
        //localStorage.setItem("bestScore", highestScore);
      }
    
      highestScoreDisplay.innerText = `Your Best : ${highestScore}`; // Display the best score on replay
});

startNewGame();
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
