
const models = require('../models');
const Domo = models.Domo;

const makerPage = (req, res) => {
    return res.render('app');
};

const makeDomo = async (req, res) => {
    if (!req.body.name || !req.body.age) {
        return res.status(400).json({ error: 'Both fields are required!' });
    }

    const domoData = {
        name: req.body.name,
        age: req.body.age,
        nickname: req.body.nickname || '',
        owner: req.session.account._id,
        mood: req.body.mood || 'neutral',
    };

    try {
        const newDomo = new Domo(domoData);
        await newDomo.save();
        return res.status(201).json({ name: newDomo.name, age: newDomo.age, nickname: newDomo.nickname, mood: newDomo.mood });
    } catch (err) {
        console.log(err);
        if (err.code === 11000) {
            return res.status(400).json({ error: 'Domo already exists!' });
        }
        return res.status(500).json({ error: 'An error occurred' });
    }
};

const getDomos = async (req, res) => {
    try {
        const query = { owner: req.session.account._id };
        const docs = await Domo.find(query).select('name age nickname').lean().exec();

        return res.json({ domos: docs });
    } catch (err) {
        console.log(err);
        return res.status(500).json({ error: 'Error retrieving domos' });
    }
};

const deleteDomo = async (req, res) => {
    try {
        const domoId = req.body.id;
        const deleted = await Domo.deleteOne({ _id: domoId, owner: req.session.account._id });

        if (deleted.deletedCount === 0) {
            return res.status(404).json({ error: 'Domo not found' });
        }

        return res.status(200).json({ message: 'Domo deleted successfully' });
    } catch (err) {
        console.log(err);
        return res.status(500).json({ error: 'Failed to delete Domo' });
    }
};


const updateDomo = async (req, res) => {
    try {
        const { _id, name, age, mood, nickname } = req.body;

        // Check for missing required fields
        if (!_id || !name || !age || !mood || !nickname) {
            return res.status(400).json({ error: 'All fields are required for update' });
        }

        // Find the domo
        const domo = await Domo.findById(_id);

        // Handle non-existent domo
        if (!domo) {
            return res.status(404).json({ error: 'Domo not found' });
        }

        // Handle unauthorized access
        if (!domo.owner.equals(req.session.account._id)) {
            return res.status(403).json({ error: 'Not your domo' });
        }

        // Update editable fields
        domo.name = name;
        domo.age = age;
        domo.mood = mood;
        domo.nickname = nickname;

        await domo.save();

        return res.status(200).json({ message: 'Update successful' });
    } catch (err) {
        console.error('Update Domo Error:', err);
        return res.status(400).json({ error: 'Error updating domo' });
    }
};


module.exports = {
    makerPage,
    makeDomo,
    getDomos,
    deleteDomo,
    updateDomo,
};
