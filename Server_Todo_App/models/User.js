const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const Todo = new mongoose.Schema({
    userId: { type: String, required: true },
    title: { type: String, required: true },
    desc: { type: String, required: true },
});
mongoose.model("Todo", Todo)
const CompletedTodos = new mongoose.Schema({
    userId: { type: String, required: true },
    title: { type: String, required: true },
    desc: { type: String, required: true }
})
mongoose.model("CompletedTodos", CompletedTodos)
const userSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    codedb: { type: String, default: null },
    isActive: { type: Boolean, default: false },
    codeTime: { type: Date, default: null },

});
mongoose.model("User", userSchema)