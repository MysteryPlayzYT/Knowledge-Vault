const express = require('express');
const { Client } = require('pg');
const bodyParser = require('body-parser');
const cors = require('cors');
const bcrypt = require('bcrypt');
const app = express();
const port = 3000;

app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Connecting to PostgreSQL 
const client = new Client({
    user: 'postgres',
    host: 'localhost',
    database: 'KnowledgeVault',
    password: 'Naras58545256%)@',
    port: 5432,
});

client.connect()
    .then(() => console.log('Connected to PostgreSQL database'))
    .catch(err => console.error('Connection error', err.stack));

// Route to register
app.post('/api/register', async (req, res) => {
    const { name, email, password, password2 } = req.body;

    // Checking If the password is matching if matching it allows the user
    if (password !== password2) {
        return res.status(400).send('Passwords do not match');
    }

    try {

        const hashedPassword = await bcrypt.hash(password, 10);

        // It Insert the user into the database of postgreqsql
        await client.query(
            'INSERT INTO users(name, email, password) VALUES($1, $2, $3)',
            [name, email, hashedPassword]
        );

        res.status(201).send('User registered successfully');
    } catch (error) {
        if (error.code === '23505') {
            res.status(400).send('Email already exists');
        } else {
            console.error(error);
            res.status(500).send('Server error');
        }
    }
});

// Route to Login
app.post('/api/login', async (req, res) => {
    const { email, password } = req.body;

    try {
        const result = await client.query('SELECT * FROM users WHERE email = $1', [email]);
        const user = result.rows[0];

        if (!user) {
            return res.status(400).json({ message: 'Invalid email or password' });
        }

        const validPassword = await bcrypt.compare(password, user.password);
        if (!validPassword) {
            return res.status(400).json({ message: 'Invalid email or password' });
        }

        res.status(200).json({ message: 'Login successful', redirectUrl: '/Explore_page/Explore-Page.html' });
    } catch (error) {
        console.error('Error during login:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// to start the server
app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
