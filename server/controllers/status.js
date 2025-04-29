const models = require('../models');
const { Status, Account } = require('../models'); 



const makerPage = (req, res) => {
    return res.render('app');
};



const makeStatus = async (req, res) => {
    //make sure all fields filled
    if (!req.body.update || !req.body.mood || !req.body.emoji) {
        return res.status(400).json({ error: 'All fields are required!' });
    }

    const account = await Account.findById(req.session.account._id);
    const updateWords = req.body.update.trim().split(/\s+/);
    const moodWords = req.body.mood.trim().split(/\s+/);
    const wordLimit = 5;

    //premium for more words
    if (!account.premium) {
        if (updateWords.length > wordLimit || moodWords.length > wordLimit) {
            return res.status(400).json({ error: 'Update Too Long!! Upgrade to premium for more words' });
        }
    }

    //status data
    const statusData = {
        update: req.body.update,
        mood: req.body.mood,
        emoji: req.body.emoji,
        tagline: account.premium ? req.body.tagline || '' : '',
        owner: req.session.account._id,
        username: account.username,
    };

    try {
        //get new status models adn return
        const newStatus = new Status.StatusModel(statusData);
        await newStatus.save();

        return res.status(201).json({ 
            update: newStatus.update, 
            mood: newStatus.mood, 
            emoji: newStatus.emoji, 
            tagline: newStatus.tagline,
            username: newStatus.username 
        });
    } catch (err) {
        console.log(err);
        if (err.code === 11000) {
            return res.status(400).json({ error: 'Status already exists!' });
        }
        return res.status(500).json({ error: 'An error occurred' });
    }
};


//get statuses based on account
const getStatuses = async (req, res) => {
    try {
        const docs = await Status.StatusModel
            .find({ owner: req.session.account._id })
            .select('update mood emoji tagline username createdDate')
            .lean()
            .exec();

        return res.json({ statuses: docs });
    } catch (err) {
        console.log(err);
        return res.status(500).json({ error: 'Error retrieving statuses' });
    }
};


//update statuts
const updateStatus = async (req, res) => {
    const { _id, update, mood, emoji, tagline } = req.body;


    //all fields need to be met
    if (!_id || !update || !mood || !emoji) {
        return res.status(400).json({ error: 'All fields are required for update' });
    }

    try {
        //get status model and update
        const status = await Status.StatusModel.findById(_id);
        if (!status) {
            return res.status(404).json({ error: 'Status not found' });
        }

        if (!status.owner.equals(req.session.account._id)) {
            return res.status(403).json({ error: 'Not your status' });
        }

        status.update = update;
        status.mood = mood;
        status.emoji = emoji;

        const account = await Account.findById(req.session.account._id);
        if (account.premium) {
            status.tagline = tagline || '';
        }

        await status.save();

        return res.status(200).json({ message: 'Update successful' });
    } catch (err) {
        console.error('Update Status Error:', err);
        return res.status(400).json({ error: 'Error updating status' });
    }
};


//delete status
const deleteStatus = async (req, res) => {
    try {
        //delete status from account
        const statusId = req.body.id;
        const deleted = await Status.StatusModel.deleteOne({ _id: statusId, owner: req.session.account._id });

        if (deleted.deletedCount === 0) {
            return res.status(404).json({ error: 'Status not found' });
        }

        return res.status(200).json({ message: 'Status deleted successfully' });
    } catch (err) {
        console.log(err);
        return res.status(500).json({ error: 'Failed to delete Status' });
    }
};

//premium toggle
const togglePremium = async (req, res) => {
    try {
        const account = await Account.findById(req.session.account._id);
        account.premium = !account.premium;
        await account.save();

        return res.json({ premium: account.premium });
    } catch (err) {
        console.error('Toggle premium failed:', err);
        return res.status(500).json({ error: 'Could not toggle premium' });
    }
};



module.exports = {
    makerPage,
    makeStatus,
    getStatuses,
    deleteStatus,
    updateStatus,
    togglePremium,
};
