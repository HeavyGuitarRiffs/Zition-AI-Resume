const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

// MongoDB connection string
const mongoURI = 'mongodb+srv://Just214:goldenin89@serverlessinstance0.hrofcqp.mongodb.net/?retryWrites=true&w=majority&appName=ServerlessInstance0';
mongoose.connect(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true });

// User Schema
const userSchema = new mongoose.Schema({
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true }
});

const User = mongoose.model('User', userSchema);

// Login function
const loginUser = async (email, plainPassword) => {
    try {
        const user = await User.findOne({ email });
        if (!user) {
            return console.log('User not found');
        }
        
        const isPasswordValid = await bcrypt.compare(plainPassword, user.password);
        if (!isPasswordValid) {
            return console.log('Invalid password');
        }
        
        console.log('User logged in successfully');
    } catch (error) {
        console.error('Error logging in user:', error);
    } finally {
        mongoose.connection.close();
    }
};

// Test the login function
loginUser('user@example.com', 'password');
