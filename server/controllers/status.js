const models = require('../models');
const Status = models.Status;
const Account = models.Account;


const makerPage = (req, res) => {
    return res.render('app');
};


const makeStatus = async (req, res) => {
    if (!req.body.update || !req.body.mood || !req.body.emoji) {
        return res.status(400).json({ error: 'All fields are required!' });
    }

    const account = await Account.AccountModel.findById(req.session.account._id);
    const updateWords = req.body.update.trim().split(/\s+/);
    const moodWords = req.body.mood.trim().split(/\s+/);
    const wordLimit = 5;


    if (!account.premium) {
        if (updateWords.length > wordLimit || moodWords.length > wordLimit) {
            return res.status(400).json({ error: 'too many words!! Upgrade to premium for more words' });
        }
    }

    const statusData = {
        update: req.body.update,
        mood: req.body.mood,
        emoji: req.body.emoji,
        owner: req.session.account._id,
        username: account.username,
    };

    try {
        const newStatus = new Status(statusData);
        await newStatus.save();

        return res.status(201).json({ update: newStatus.update, mood: newStatus.mood, emoji: newStatus.emoji, username: newStatus.username });
    } catch (err) {
        console.log(err);
        if (err.code === 11000) {
            return res.status(400).json({ error: 'Status already exists!' });
        }
        return res.status(500).json({ error: 'An error occurred' });
    }
};

const getStatuses = async (req, res) => {
    try {
        const docs = await Status.StatusModel
            .find({ owner: req.session.account._id })
            .select('update mood emoji username createdDate')
            .lean()
            .exec();

        return res.json({ statuses: docs });
    } catch (err) {
        console.log(err);
        return res.status(500).json({ error: 'Error retrieving statuses' });
    }
};


const updateStatus = async (req, res) => {
    const { _id, update, mood, emoji } = req.body;

    // Check for missing required fields
    if (!_id || !update || !mood || !emoji) {
        return res.status(400).json({ error: 'All fields are required for update' });
    }


    try {
        // Find the status
        const status = await Status.StatusModel.findById(_id);

        // Handle non-existent status
        if (!status) {
            return res.status(404).json({ error: 'Status not found' });
        }

        // Handle unauthorized access
        if (!status.owner.equals(req.session.account._id)) {
            return res.status(403).json({ error: 'Not your status' });
        }

        // Update editable fields
        status.update = update;
        status.mood = mood;
        status.emoji = emoji;

        await status.save();

        return res.status(200).json({ message: 'Update successful' });
    } catch (err) {
        console.error('Update Status Error:', err);
        return res.status(400).json({ error: 'Error updating status' });
    }
};





const deleteStatus = async (req, res) => {
    try {
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




module.exports = {
    makerPage,
    makeStatus,
    getStatuses,
    deleteStatus,
    updateStatus,
};
