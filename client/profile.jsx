import React, { useState } from 'react';

const ProfilePage = () => {
    //name, password, etc.
    const [username, setUsername] = useState('');
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');

    const handleUsernameChange = (event) => {
        //set
        setUsername(event.target.value);
    };

    const handlePasswordChange = (event) => {
        //change password
        if (event.target.name === 'currentPassword') {
            setCurrentPassword(event.target.value);
        } else {
            setNewPassword(event.target.value);
        }
    };

    //profile form
    return (
        <div>
            <h1>Profile Page</h1>
            <form action="/profile" method="POST">
                <label htmlFor="username">Change Username:</label>
                <input
                    type="text"
                    id="username"
                    name="username"
                    value={username}
                    onChange={handleUsernameChange}
                    required
                />
                <button type="submit">Update Username</button>
            </form>

            <br />

            <form action="/profile/password" method="POST">
                <label htmlFor="currentPassword">Current Password:</label>
                <input
                    type="password"
                    id="currentPassword"
                    name="currentPassword"
                    value={currentPassword}
                    onChange={handlePasswordChange}
                    required
                />
                <br />
                <label htmlFor="newPassword">New Password:</label>
                <input
                    type="password"
                    id="newPassword"
                    name="newPassword"
                    value={newPassword}
                    onChange={handlePasswordChange}
                    required
                />
                <br />
                <button type="submit">Change Password</button>
            </form>
        </div>
    );
};

export default ProfilePage;
