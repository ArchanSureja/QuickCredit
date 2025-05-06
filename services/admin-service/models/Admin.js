const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const AdminSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  institute_name: { type: String, required: true },
  password: { type: String, required: true },
  admin_id: { type: String, required: true, unique: true },
  institute: { type: String, required: true },
  createdAt: { type: Date, default: Date.now }
});

// Hash password before saving
AdminSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

// Method to compare passwords
AdminSchema.methods.comparePassword = async function(candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

module.exports = mongoose.model('Admin', AdminSchema);