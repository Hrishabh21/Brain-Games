const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const path = require('path');

const cors = require('cors');

const app = express();

app.use(cors());


mongoose.connect('mongodb://localhost:27017/brainGamesDB', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});


const User = mongoose.model('User', {
    username: String,
    password: String,
    gameScores: [Number],
    highestScore: { type: Number, default: 0 },
    gameScores1: [Number],
    highestScore1: { type: Number, default: 0 },
    gameScores2: [Number],
    highestScore2: { type: Number, default: 0 },
});


const CurrentPlayer = mongoose.model('CurrentPlayer', {
    playerName: String,
});

// Middleware
app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.json());

// Routes
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.get('/login', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'login.html'));
});

app.post('/login', async (req, res) => {
    const { username, password } = req.body;

    try {
        
        const user = await User.findOne({ username, password });

        if (user) {
            
            await CurrentPlayer.findOneAndUpdate({}, { playerName: username }, { upsert: true });

           
            res.status(200).send('Login successful');
        } else {
            
            res.status(401).send('Invalid username or password');
        }
    } catch (error) {
        
        res.status(500).send('Internal server error');
    }
});

app.get('/signup', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'signup.html'));
});
app.get('/color', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'color.html'));
});
app.get('/schulte', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'schulte.html'));
});
app.get('/noguess', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'noguess.html'));
});

app.post('/signup', async (req, res) => {
    const { username, password } = req.body;

    try {
        
        const existingUser = await User.findOne({ username });

        if (existingUser) {
            
            res.status(409).send('Username already exists');
        } else {
            // Create a new user
            const newUser = new User({ username, password });
            await newUser.save();

            
            await CurrentPlayer.findOneAndUpdate({}, { playerName: username }, { upsert: true });

           
            res.status(201).send('Signup successful');
        }
    } catch (error) {
        
        res.status(500).send('Internal server error');
    }
});

// Add a new route to get the current player name
app.get('/getCurrentPlayer', async (req, res) => {
  try {
      
      const currentPlayer = await CurrentPlayer.findOne({});
      
      res.status(200).json({ playerName: currentPlayer ? currentPlayer.playerName : null });
  } catch (error) {
      
      res.status(500).send('Internal server error');
  }
});
//for color game

app.get('/getPlayerData', async (req, res) => {
  const playerName = req.query.playerName;

  try {
      const user = await User.findOne({ username: playerName });

      if (user) {
          res.json({
              scores: user.gameScores,
              highestScore: user.highestScore,
          });
      } else {
          res.status(404).send('Player not found');
      }
  } catch (error) {
      res.status(500).send('Internal server error');
  }
});

// New route to update player data
app.post('/updatePlayerData', async (req, res) => {
  const playerName = req.body.playerName;
  const newScore = req.body.newScore;

  try {
      const user = await User.findOne({ username: playerName });

      if (user) {
          
          user.gameScores.push(newScore);
          var n=user.gameScores.length;
          if(n>15){
            user.gameScores.shift();
          }
          if (newScore > user.highestScore) {
              user.highestScore = newScore;
          }

          
          await user.save();

          res.json({ message: 'Player data updated successfully' });
      } else {
          res.status(404).send('Player not found');
      }
  } catch (error) {
      res.status(500).send('Internal server error');
  }
});

//for schulte table
app.get('/getPlayerData1', async (req, res) => {
    const playerName = req.query.playerName;
  
    try {
        const user = await User.findOne({ username: playerName });
  
        if (user) {
            res.json({
                scores: user.gameScores1,
                highestScore: user.highestScore1,
            });
        } else {
            res.status(404).send('Player not found');
        }
    } catch (error) {
        res.status(500).send('Internal server error');
    }
  });
  
  // New route to update player data
  app.post('/updatePlayerData1', async (req, res) => {
    const playerName = req.body.playerName;
    const newScore = req.body.newScore;
  
    try {
        const user = await User.findOne({ username: playerName });
  
        if (user) {
            // Update scores and highest score
            user.gameScores1.push(newScore);
            var n=user.gameScores1.length;
            if(n>15){
              user.gameScores1.shift();
            }
            // if(user.highestScore1==0){
            //     user.highestScore1= newScore;
            // }
            if (newScore < user.highestScore1) {
                user.highestScore1 = newScore;
            }
  
            // Save the updated user data
            await user.save();
  
            res.json({ message: 'Player data updated successfully' });
        } else {
            res.status(404).send('Player not found');
        }
    } catch (error) {
        res.status(500).send('Internal server error');
    }
  });
// for number guessing
  app.get('/getPlayerData2', async (req, res) => {
    const playerName = req.query.playerName;
  
    try {
        const user = await User.findOne({ username: playerName });
  
        if (user) {
            res.json({
                scores: user.gameScores2,
                highestScore: user.highestScore2,
            });
        } else {
            res.status(404).send('Player not found');
        }
    } catch (error) {
        res.status(500).send('Internal server error');
    }
  });
  
  // New route to update player data
  app.post('/updatePlayerData2', async (req, res) => {
    const playerName = req.body.playerName;
    const newScore = req.body.newScore;
  
    try {
        const user = await User.findOne({ username: playerName });
  
        if (user) {
            // Update scores and highest score
            user.gameScores2.push(newScore);
            var n=user.gameScores2.length;
            if(n>15){
              user.gameScores2.shift();
            }
            if (newScore > user.highestScore2) {
                user.highestScore2 = newScore;
            }
  
            // Save the updated user data
            await user.save();
  
            res.json({ message: 'Player data updated successfully' });
        } else {
            res.status(404).send('Player not found');
        }
    } catch (error) {
        res.status(500).send('Internal server error');
    }
  });
  




const PORT = 3002;
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
