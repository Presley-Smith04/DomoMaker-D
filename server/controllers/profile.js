const Account = require('../models/Account');

//render the profile pageS]
module.exports.profilePage = (req, res) => {
    const username = req.session.account.username;
    res.render('profile', { username });
};

//handle updates
module.exports.updateUsername = async (req, res) => {
    const userId = req.session.account._id;
    const newUsername = req.body.username;

    try {
        //findByIdAndUpdate built in mongoose funciton
        const account = await Account.findByIdAndUpdate(userId, { username: newUsername }, { new: true });

        //check for account found
        if (!account) {
            return res.status(404).send('Account not found.');
        }

        req.session.account.username = account.username;
        res.redirect('/profile');
    } catch (err) {
        console.error('Error updating username:', err);
        return res.status(500).send('Error updating username.');
    }
};



//handle password update
module.exports.updatePassword = async (req, res) => {
    const userId = req.session.account._id;
    const { currentPassword, newPassword } = req.body;

    try {
        //look for account
        const account = await Account.findById(userId);

        if (!account) {
            return res.status(404).send('Account not found.');
        }

        //verify passwords
        const isMatch = await Account.verifyPassword(currentPassword);

        if (!isMatch) {
            //dont let new password = old password
            return res.status(400).send('Incorrect current password.');
        }


        //save info
        await Account.setPassword(newPassword);

        await account.save();

        res.redirect('/profile');
    } catch (err) {
        console.error('Error updating password:', err);
        return res.status(500).send('Error updating password.');
    }
};
