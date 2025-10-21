require('dotenv').config();



const express = require('express');
const connectToDB = require('./database/db');
const authRoutes = require('./routes/auth-routes');
const homeRoutes = require('./routes/home-routes');
const adminRoutes = require('./routes/admin-routes');
const uploadImageRoutes = require('./routes/image-routes');

connectToDB();

const app = express();
const PORT = process.env.PORT || 3030;

//middlewares
app.use(express.json());

//main route for auth i.e to call 'registerUser/loginUser from the authroutes
app.use('/api/auth', authRoutes);
app.use('/api/home', homeRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/image', uploadImageRoutes);

app.listen(PORT, () => {
  console.log(`server is now listening to PORT ${PORT}`);
});