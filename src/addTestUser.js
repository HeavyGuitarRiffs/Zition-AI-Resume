const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const mongoURI = 'mongodb+srv://Just214:goldenin89@serverlessinstance0.hrofcqp.mongodb.net/?retryWrites=true&w=majority&appName=ServerlessInstance0'; // Replace with your connection string
mongoose.connect(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true });

const userSchema = new mongoose.Schema({
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true }
});

const User = mongoose.model('User', userSchema);

const addTestUser = async () => {
    const email = 'user@example.com';
    const plainPassword = 'password';
    const hashedPassword = await bcrypt.hash(plainPassword, 10);

    const newUser = new User({
        email: email,
        password: hashedPassword
    });

    try {
        await newUser.save();
        console.log('Test user added successfully');
    } catch (error) {
        console.error('Error adding test user:', error);
    } finally {
        mongoose.connection.close();
    }
};

addTestUser();
