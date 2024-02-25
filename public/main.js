document.addEventListener('DOMContentLoaded', async () => {
    const welcomeMessage = document.getElementById('welcome-message');

    try {
        // Fetch the current player name from the server
        const response = await fetch('http://localhost:3002/getCurrentPlayer');
        const data = await response.json();

        // Check if there is a current player
        if (data && data.playerName) {
            welcomeMessage.textContent = `Hi, ${data.playerName}!`;
        } else {
            welcomeMessage.textContent = 'Hi, Guest User!';
        }
    } catch (error) {
        console.error('An error occurred while fetching the current player:', error);
    }
});
