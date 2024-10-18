document.getElementById('LoginForm').addEventListener('submit', async function(event) {
    event.preventDefault(); // Prevent form from submitting normally

    const email = document.getElementById('Username').value; // Use 'email' for clarity
    const password = document.getElementById('Password').value;

    try {
        const response = await fetch('http://localhost:3000/api/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ email, password })
        });

        const data = await response.json();

        if (response.ok) {
            alert('Login successful!');
            window.location.href = data.redirectUrl; // Redirect to explore page
        } else {
            document.getElementById('error-message').innerText = data.message || 'Login failed. Please try again.';
        }
    } catch (error) {
        console.error('Error during login:', error);
        document.getElementById('error-message').innerText = 'An error occurred. Please try again later.';
    }
});
