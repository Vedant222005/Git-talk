const express = require('express');
const dotenv = require('dotenv'); 
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;     

app.listen(PORT, () => {
    console.log(`✅ Server is running on http://localhost:${PORT}`);
});

app.get('/health', (req, res) => {
    res.status(200).send('Server is Healthy');
});