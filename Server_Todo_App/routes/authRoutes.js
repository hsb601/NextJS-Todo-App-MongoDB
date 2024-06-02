const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const User = mongoose.model("User");
const Todo = mongoose.model("Todo");
const CompletedTodo = mongoose.model("CompletedTodos");

const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
require('dotenv').config();
const nodemailer = require("nodemailer");

// Mailer function
async function mailer(recieveremail, code) {
    let transporter = nodemailer.createTransport({
        host: "smtp.gmail.com",
        port: 587,
        secure: false,
        requireTLS: true,
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS,
        },
    });

    let info = await transporter.sendMail({
        from: 'Todo',
        to: recieveremail,
        subject: "Signup Verification",
        text: `Your Verification Code is ${code}`,
        html: `<a href=http://localhost:3000/verify?code=${code}>Click to verify Your code</a>`,
    });
}

// Signup Route
router.post('/signup', async (req, res) => {
    const { name, email, password } = req.body;
    var success = null;

    if (!name || !email || !password) {
        return res.json({ error: "Please add all the fields" });
    }

    try {
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            if (!existingUser.isActive) {
                success = true;
                return res.send({ message: "Ops! Not an active user. Verification code sent to your email. Please click verify.", success });
            } else {
                success = true;
                return res.send({ message: "User with this email already exists", success });
            }
        } else {
            const codedb = Math.floor(100000 + Math.random() * 900000).toString();
            const code = btoa(codedb);
            const codeTime = new Date();
            const hashedPassword = await bcrypt.hash(password, 10);
            await mailer(email, code);
            const user = new User({ name, email, password: hashedPassword, codedb, isActive: false, codeTime });
            await user.save();
            const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET);
            res.send({ message: "Verification Code Sent to your Email", token, code, success: true });
        }
    } catch (err) {
        console.error(err);
        res.status(500).send({ error: "Internal Server Error" });
    }
});

// Verify Route
router.post('/verify', async (req, res) => {
    const { code, email } = req.body;
    var success = null;
    if (!code || !email) {
        return res.send({ error: "Invalid request" });
    }
    try {
        const activeUser = await User.findOne({ email });
        const currentTime = new Date();
        const codeTime = new Date(activeUser.codeTime);
        const timeDifference = (currentTime - codeTime) / (1000 * 60);


        if (activeUser && activeUser.isActive === true) {
            success = true
            return res.send({ message: "No need to verify, you are a verified user", success });
        }

        else if (timeDifference > 5) {
            activeUser.codedb = null;
            await activeUser.save();
            return res.send({ error: "Verification code expired, please request a new one" });
        }

        const codedb = atob(code);
        const user = await User.findOne({ email, codedb });

        if (!user) {
            return res.send({ error: "Invalid verification code or email" });
        } else {
            success = true
            user.isActive = true;
            user.codedb = null;
            await user.save();
            return res.send({ message: "Email verified successfully. Thanks for your patience! Please Login", success });
        }
    } catch (err) {
        console.error('Error during email verification:', err);
        res.status(500).send({ error: 'Internal server error' });
    }
});
// resend code route
router.post('/resend', async (req, res) => {
    const { email } = req.body;
    var success = null;
    const activeUser = await User.findOne({ email });
    const codedb = Math.floor(100000 + Math.random() * 900000);
    const code = btoa(codedb)
    const codeResendTime = Date();

    if (activeUser.codedb === null) {
        activeUser.codeTime = codeResendTime;
        activeUser.codedb = codedb;
        await activeUser.save();
        await mailer(email, code);
        success = true
        res.send({ message: "Verification Code Sent to your Email", success });

    }
    else if (activeUser.codedb !== null) {
        success = true
        res.send({ message: "Verification Code Sent to your Email Please go to email and click to verify Thanks!", success });

    }
});



// Signin Route
router.post('/signin', async (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) {
        return res.json({ error: "Please add email or password" });
    }

    try {
        const savedUser = await User.findOne({ email });
        if (!savedUser) {
            return res.json({ error: "Invalid Credentials" });
        }
        if (savedUser.isActive === false) {
            return res.json({ error: "You are not a active user" });
        }
        const isMatch = await bcrypt.compare(password, savedUser.password);
        if (isMatch) {
            const token = jwt.sign({ _id: savedUser._id }, process.env.JWT_SECRET);
            res.send({ token });
        }
        else {
            return res.json({ error: "Invalid Credentials" });
        }
    } catch (err) {
        console.error('Error during signin:', err);
        res.status(500).send({ error: 'Internal server error' });
    }
});


// Add todo
router.post('/todo', async (req, res) => {
    const { email, title, desc } = req.body;

    if (!email || !title || !desc) {
        return res.json({ error: "Invalid request, No data found" });
    }
    try {

        const savedUser = await User.findOne({ email });
        if (!savedUser) {
            return res.json({ error: "User not found" });
        }

        const _id = savedUser._id;
        const existingTodo = await Todo.findOne({ userId: _id, title });
        if (existingTodo) {
            return res.json({ error: 'Todo with this title already exists' });
        }

        const newTodo = new Todo({
            title,
            desc,
            userId: _id
        });
        await newTodo.save();
        const todos = await Todo.find({ userId: _id });
        res.send({ message: "Todo item added successfully", todos });

    } catch (err) {
        console.error('Error during adding todo:', err);
        res.status(500).send({ error: 'Internal server error' });
    }
});

// get todo route
router.post('/gettodo', async (req, res) => {
    const { email } = req.body;

    if (!email) {
        return res.json({ error: "Invalid request, No data found" });
    }

    try {
        const savedUser = await User.findOne({ email });
        if (!savedUser) {
            return res.json({ error: "User not found" });
        }
        const _id = savedUser._id
        const todo = await Todo.find({ userId: _id });
        if (todo) {
            res.json({ todos: todo });
        }

        else {
            res.json({ error: "No todo exists" });
        }
    } catch (err) {
        console.error('Error during fetching todo:', err);
        res.status(500).send({ error: 'Internal server error' });
    }
});

// Complete a todo
router.post('/completeTodo', async (req, res) => {
    const { email, title } = req.body;

    try {
        const user = await User.findOne({ email });

        if (!user) {
            return res.json({ error: 'User not found' });
        }

        const _id = user._id;
        const todos = await Todo.find({ userId: _id });
        const todoIndex = todos.findIndex(todo => todo.title === title);
        if (todoIndex === -1) {
            return res.json({ error: 'Todo not found' });
        }

        const [completedTodo] = todos.splice(todoIndex, 1);
        const newCompletedTodo = new CompletedTodo({
            title: completedTodo.title,
            desc: completedTodo.desc,
            userId: _id
        });

        await newCompletedTodo.save();
        await Todo.deleteOne({ _id: completedTodo._id });
        const updatedTodos = await Todo.find({ userId: _id });
        const completedTodos = await CompletedTodo.find({ userId: _id });
        res.json({ message: 'Todo completed successfully', todos: updatedTodos, completedTodos: completedTodos });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Delete a todo
router.delete('/deleteTodo', async (req, res) => {
    const { email, title } = req.body;

    try {
        const user = await User.findOne({ email });

        if (!user) {
            return res.json({ error: 'User not found' });
        }
        const _id = user._id;
        const todos = await Todo.find({ userId: _id });
        const todoIndex = todos.findIndex(todo => todo.title === title);
        const CompletdTodos = await CompletedTodo.find({ userId: _id });
        const todoIndexCompleted = CompletdTodos.findIndex(todo => todo.title === title);
        if (todoIndex === -1 && todoIndexCompleted === -1) {
            return res.json({ error: 'Todo not found' });
        }

        else if (todoIndex !== -1) {
            const [Todos] = todos.splice(todoIndex, 1);
            await Todo.deleteOne({ _id: Todos._id });
            const updatedTodos = await Todo.find({ userId: _id });
            res.json({ message: 'Todo deleted successfully', todos: updatedTodos });
        }

        else if (todoIndexCompleted !== -1) {
            const [CompletedTodos] = CompletdTodos.splice(todoIndexCompleted, 1);
            await CompletedTodo.deleteOne({ _id: CompletedTodos._id });
            const updatedCompletedTodos = await CompletedTodo.find({ userId: _id });
            res.json({ message: 'Todo deleted successfully', completedTodos: updatedCompletedTodos });
        }

    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Update Route
router.post('/updateTodo', async (req, res) => {
    const { title, desc, email, originalTitle } = req.body;
    if (!title || !desc || !email || !originalTitle) {
        return res.status(400).json({ error: "Invalid request" });
    }

    try {
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }

        const updatedTodo = await Todo.findOneAndUpdate(
            { userId: user._id, title: originalTitle },
            { title, desc },
            { new: true } 
        );

        if (!updatedTodo) {
            return res.status(404).json({ error: 'Todo not found' });
        }

        return res.json({ message: "Todo updated successfully", updatedTodo });

    } catch (err) {
        console.error('Error during todo update:', err);
        res.status(500).json({ error: 'Internal server error' });
    }
});



module.exports = router;
