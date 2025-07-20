const express = require('express');
const jwt = require('jsonwebtoken');
const Task = require('../models/Task');

const router = express.Router();

const authMiddleware = (req, res, next) => {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) return res.status(401).json({ error: 'No token' });
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.userId = decoded.userId;
        next();
    } catch (err) {
        res.status(403).json({ error: 'Invalid token' });
    }
};

router.use(authMiddleware);

router.get('/', async (req, res) => {
    const tasks = await Task.find({ userId: req.userId });
    res.json(tasks);
});

router.post('/', async (req, res) => {
    const { text } = req.body;
    const task = new Task({ userId: req.userId, text, completed: false });
    await task.save();
    res.status(201).json(task);
});

router.put('/:id', async (req, res) => {
    const task = await Task.findOneAndUpdate(
        { _id: req.params.id, userId: req.userId },
        { completed: req.body.completed },
        { new: true }
    );
    res.json(task);
});

router.delete('/:id', async (req, res) => {
    await Task.findOneAndDelete({ _id: req.params.id, userId: req.userId });
    res.status(204).send();
});

module.exports = router;
