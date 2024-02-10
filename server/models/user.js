/**
 * This Mongoose model file defines the schema for user data storage in a MongoDB database. It includes fields for username, email, and password, with constraints for required fields and unique values for both username and email. Additionally, it utilizes bcryptjs to hash passwords before saving them to the database, ensuring the security of user credentials.
 * @author Caleb Chiang
 * @version 1.0.0
 *
 */

const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
    username: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true }
});

// Hash password before saving
userSchema.pre('save', async function(next) {
    if (!this.isModified('password')) return next();
    this.password = await bcrypt.hash(this.password, 12);
    next();
});

const User = mongoose.model('User', userSchema);
module.exports = User;