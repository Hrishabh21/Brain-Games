document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.getElementById('login-form');
    const loginError = document.getElementById('login-error');

    if (loginForm) {
        loginForm.addEventListener('submit', async (event) => {
            event.preventDefault();

            const usernameInput = document.getElementById('username');
            const passwordInput = document.getElementById('password');

            const username = usernameInput.value;
            const password = passwordInput.value;

            try {
                const response = await fetch('/login', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ username, password }),
                });

                if (response.ok) {
                    // Redirect to the homepage or perform other actions on successful login
                    window.location.href = '/';
                } else {
                    // Handle login failure, show an error message
                    const errorMessage = await response.text();
                    loginError.textContent = errorMessage;
                }
            } catch (error) {
                console.error('An error occurred during login:', error);
            }
        });
    }
});
