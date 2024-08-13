import mongoose from 'mongoose';

const adminSchema = new mongoose.Schema({
    username: String,
    email: String,
    password: String,
});

const adminModel = mongoose.model('admin', adminSchema);

export { adminModel };
