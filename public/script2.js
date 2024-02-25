const tableContainer = document.getElementById("table-container");
const startButton = document.getElementById("start-button");
const timerDisplay = document.getElementById("timer");
const bestResultDisplay = document.getElementById("best-result");
const resultDisplay = document.getElementById("result");
const hintDisplay = document.getElementById("hint");
const improvement=document.getElementById("improve");

const tableSize = 5;
let startTime;
let timerInterval;
//let bestTime = parseFloat(localStorage.getItem("bestTime")) || Infinity;
let highestScore;
let scores=new Array();
const correctSequence = Array.from({ length: tableSize * tableSize }, (_, i) => i + 1);
let currentNumber = 1;
let flag=1;
let score;

let currentPlayer;

document.addEventListener('DOMContentLoaded', async () => {
    const welcomeMessage = document.getElementById('current-player');

    try {
        
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

//fetch and update data
function fetchPlayerData(playerName) {
    
    fetch(`/getPlayerData1?playerName=${playerName}`)
        .then(response => response.json())
        .then(data => {
            
            scores = data.scores || [];
            
            highestScore = data.highestScore;
            if(highestScore>500){
                highestScore=Infinity;
            }
           // fetchPlayerData(currentPlayer);
    calculateImprovement();

            
            document.getElementById("result").innerText = "Result: " + score;
            document.getElementById("best-result").innerText = "Best Result: " + highestScore;
        })
        .catch(error => console.error('Error fetching player data:', error));
}
//fetchPlayerData(currentPlayer);


function updatePlayerData(playerName, newScore) {
    // Update the player data on the server
    fetch('/updatePlayerData1', {
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




function generateSchulteTable(size) {
    tableContainer.innerHTML = "";
    const numbers = Array.from({ length: size * size }, (_, i) => i + 1);
    shuffleArray(numbers);

    for (let i = 1; i <= size * size; i++) {
        const square = document.createElement("div");
        square.className = "square";
        square.textContent = numbers[i - 1];
        tableContainer.appendChild(square);

        if (currentNumber === numbers[i - 1]) {
            square.classList.add("next-number");
            updateHint();
        }
    }
}

function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
}

function startTimer() {
    startTime = Date.now();
    timerInterval = setInterval(updateTimer, 100);
    hintDisplay.textContent = "Find 1";
    startButton.disabled = true;
}

function stopTimer() {
    clearInterval(timerInterval);
    const endTime = Date.now();
    const eclapsedTime = (endTime - startTime) / 1000;
    score=eclapsedTime;
    updatePlayerData(currentPlayer, score);
    fetchPlayerData(currentPlayer);
    calculateImprovement();
    resultDisplay.textContent = `Result: ${score.toFixed(1)} seconds`;

    // if (elapsedTime < highestScore) {
    //     high = elapsedTime;
    //     //localStorage.setItem("bestTime", bestTime);
    //     bestResultDisplay.textContent = `Best Result: ${bestTime.toFixed(1)} seconds`;
    // }

    startButton.disabled = false;
    hintDisplay.textContent = ""; 
}

function updateTimer() {
    const currentTime = Date.now();
    const elapsedTime = (currentTime - startTime) / 1000;
    //updatePlayerData(currentPlayer,eclapsedTime);
    timerDisplay.textContent = elapsedTime.toFixed(1) + "s";
}

function updateHint() {
    hintDisplay.textContent = `Find ${currentNumber}`;
}

startButton.addEventListener("click", () => {
    generateSchulteTable(tableSize);
    timerDisplay.textContent = "0.00s";
    resultDisplay.textContent = "";
    currentNumber=1;
    flag=0;
    startTimer();
});


tableContainer.addEventListener("click", (event) => {
    if(flag==0){
    if (currentNumber === parseInt(event.target.textContent)) {
        event.target.classList.remove("next-number");
        currentNumber++;

        if (currentNumber <= 25) {
           // if (currentNumber <= 5) {
            updateHint();
        } else {
            stopTimer();
        }
    }}
});

generateSchulteTable(tableSize);
bestResultDisplay.textContent = `Best Result: ${highestScore} seconds`;

startButton.disabled = false;

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
     let imp=((sumi-sumf)/sumi)*100;
     improvement.innerText = imp.toFixed(2);
     //"Improvement:-"+imp;
 }
