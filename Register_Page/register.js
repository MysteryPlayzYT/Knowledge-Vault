document.getElementById('registerForm').addEventListener('submit', async function (event) {
    event.preventDefault(); // Prevent form from submitting normally

    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const password2 = document.getElementById('password2').value;

    const response = await fetch('http://localhost:3000/api/register', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ name, email, password, password2 })
    });

    const message = await response.text();

    if (response.ok) {
        alert('User registered successfully!');
        window.location.href = '/Login_Page/Login/login.html'; // Redirect to login
    } else {
        document.getElementById('error-message').innerText = message;
    }
});
