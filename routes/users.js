const {User, validateUser }  = require("../models/user");
const {Food} = require('../models/food');
const {Goal} = require('../models/goal')
const bcrypt = require('bcrypt');
const express = require('express');
const router = express.Router();

router.get('/', async (req, res) => {
    try {
        const user = await User.find();
        return res.send(user);
    } catch (ex) {
        return res.status(500).send(`Internal Server Error: ${ex}`);
    }
})

router.get('/:id', async (req, res) => {
    try {
        const user = await User.findById(req.params.id);

        if (!user)
        return res.status(400).send(`The user with id ${req.params.id} does not exist`);

        return res.send(user);

    } catch (ex) {
        return res.status(500).send(`Internal Server Error: ${ex}`);
    }
});

router.put('/:id', async (req, res) => {
    try {
        const { error } = vailidate(req.body);
        if (error) return res.status(400).send(error);

        const user = await User.findByIdAndUpdate(req.params.id,
            {
                name: req.body.name,
                email: req.body.email,
                password: req.body.password
            });

            if (!user) return res.status(400).send(` The user with id of "${req.params.id}" does not exist.`);

            await user.save();

            return res.send(user);
    } catch {
        return res.status(500).send(`Internal Server Error: ${ex}`);
    }
});


router.post('/register', async (req, res) => {
    try {
        const { error } = validateUser(req.body);

        if (error) return res.status(400).send(error.details[0].message);

        let user = await User.findOne({email: req.body.email});
        if (user) return res.status(400).send('Users already registered.');

        const salt = await bcrypt.genSalt(10);
        user = new User({
            name: req.body.name,
            email: req.body.email,
            password: await bcrypt.hash(req.body.password, salt)
        });

        await user.save();

        const token = user.generateAuthToken();

        return res
        .header('x-auth-token', token)
        .header('access-control-expose-headers', 'x-auth-token')
        .send({_id: user._id, name: user.name, email: user.email });
    } catch (ex) {
        return res.status(500).send(`Internal Server Error: ${ex}`);
    }
})



router.delete('/:id', async (req, res) => {
    try {

        const user = await User.findByIdAndRemove(req.params.id);

        if (!user) return res.status(400).send(`The user with id of "${req.params.id}" does not exist`
        );

        return res.send(user);

    } catch (ex) {
        return res.status(500).send(`Internal Server Error: ${ex}`);
    }
});

// push

router.post('/foods/:id', async (req, res) => {

    try {
        const user = await User.findById(req.params.id);
        if (!user) return res.status(400).send(`The user with the id of "${req.params.id}" does not exist`);
    
    const food = new Food({
        name: req.body.name,
        servingSize: req.body.servingSize,
        protein: req.body.protein,
        fats: req.body.fats,
        sugars: req.body.sugars,
        calories: req.body.calories
    });

    user.foodDiary.push(food);

    await user.save();

    return res.send(user);
} catch (ex) {
    return res.send(500).send(`Internal Server Error: ${ex}`)
}
});

router.delete('/foods/:id', async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        if(!user) return res.status(500).send(`The user with the ID "${req.params.id}" does not exist`);
        
        user.foodDiary.pop(req.body.name)
        
        await user.save();

        return res.send(user);
        
    } catch (ex) {
        return res.status(500).send(`Internal Server Error: ${ex}`)
    }
});

router.post('/goals/:id', async (req, res) => {

    try {
        const user = await User.findById(req.params.id);

        if (!user) return res.status(400).send(`The user with the id of "${req.params.id}" does not exist`);
    
    const goal = new Goal({
        goal: req.body.goal,
    });

    user.goal.push(goal);

    await user.save();

    return res.send(user);
} catch (ex) {
    return res.send(500).send(`Internal Server Error: ${ex}`)
}
});

router.delete('/goals/:id', async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        if(!user) return res.status(500).send(`The user with the ID "${req.params.id}" does not exist`);

        const newGoalArray = user.goal.filter(function(goal) {
            return goal.name !== req.body.name
        });

        user.goal = [...newGoalArray];
        await user.save();

        return res.send(user);
        
    } catch (ex) {
        return res.status(500).send(`Internal Server Error: ${ex}`)
    }
});
module.exports = router;