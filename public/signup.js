document.addEventListener('DOMContentLoaded', () => {
    const signupForm = document.getElementById('signup-form');
    const signupError = document.getElementById('signup-error');

    if (signupForm) {
        signupForm.addEventListener('submit', async (event) => {
            event.preventDefault();

            const usernameInput = document.getElementById('username');
            const passwordInput = document.getElementById('password');

            const username = usernameInput.value;
            const password = passwordInput.value;

            try {
                const response = await fetch('/signup', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ username, password }),
                });

                if (response.ok) {
                    // Redirect to the homepage or perform other actions on successful signup
                    window.location.href = '/';
                } else {
                    // Handle signup failure, show an error message
                    const errorMessage = await response.text();
                    signupError.textContent = errorMessage;
                }
            } catch (error) {
                console.error('An error occurred during signup:', error);
            }
        });
    }
});
