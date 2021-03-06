const connectDB = require('./startup/db');
const express = require('express');
const app = express();
const goal = require('./routes/goal');
const users = require('./routes/users');
const auth = require('./routes/auth');
const cors = require('cors');


connectDB();

app.use(cors());
app.use(express.json());
app.use('/api/users', users)
app.use('/api/auth', auth)
app.use('api/goals', goal)

const port = process.env.PORT || 5000;
app.listen(port, () => {
    console.log(`Server started on port: ${port}`);
});