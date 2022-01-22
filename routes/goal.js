const express = require('express');
const {Goal, validateGoal }  = require('../models/goal');
const router = express.Router();


router.get('/', async (req, res) => {
    try {
        const goal = await Goal.find();
        return res.send(goal);
    } catch (ex) {
        return res.status(500).send(`Internal Server Error: ${ex}`);
    }
})

router.post('/', async (req, res) => {
    try {
        const goal = new Goal({
            goal: req.body.goal,
        
        });

        await goal.save();

        return res.send(goal)
    } catch (ex) {
        return res.status(500).send(`Internal Server Error: ${ex}`);
    }
});

router.put('/:id', async (req, res) => {
    try {
        const { error } = validateGoal(req.body);
        if (error) return res.status(400).send(error);

        const goal = await Goal.findByIdAndUpdate(req.params.id,
            {
                goal: req.body.goal, 
            });

        if (!goal) return res.status(400).send(` The food with id of of "${req.params.id}" does not exist`);

        await goal.save();

        return res.send(goal);
    } catch (ex) {
        return res.status(500).send(`Internal Server Error: ${ex}`)
    }
})

router.delete('/:id', async (req, res) => {
    try {
        const goal = await Goal.findByIdAndRemove(req.params.id);

        if (!goal)
        return res.status(400).send(`The food with the id of "${req.params.id}" does not exist`);

        return res.send(goal);
    } catch (ex) {
        return res.status(500).send(`Internal Server Error: ${ex}`);
    }
});

module.exports = router;
