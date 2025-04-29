const Account = require('../models/Account');
const bcrypt = require('bcrypt');


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
    try {
      const { currentPassword, newPassword } = req.body;
  
      //find account
        const account = await Account.findById(req.session.account._id);
  
      //authenticate and verify
      Account.authenticate(account.username, currentPassword, async (err, doc) => {
        if (err) {
          return res.status(500).send('Error verifying current password');
        }
  
        if (!doc) {
          return res.status(400).send('Incorrect current password');
        }
  
        //hash new pass
        const hashedPassword = await bcrypt.hash(newPassword, 10);
        account.password = hashedPassword;
        await account.save();
  
        res.send('Password updated successfully');
      });
  
    } catch (error) {
      console.error('Error updating password:', error);
      res.status(500).send('Error updating password');
    }
  };