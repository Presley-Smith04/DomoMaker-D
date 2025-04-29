//basic constants like react, etc. 
const helper = require('./helper.js');
const React = require('react');
const { useState, useEffect } = React;
const { createRoot } = require('react-dom/client');


//handle status funciton to handle the current status
const handleStatus = (e, onStatusAdded) => {
    e.preventDefault();
    helper.hideError();


    //all status possibilities
    const update = e.target.querySelector('#statusUpdate').value;
    const mood = document.querySelector('#statusMood').value;
    const emoji = e.target.querySelector('#statusEmoji').value;
    const taglineInput = e.target.querySelector('#statusTagline');
    const tagline = taglineInput && !taglineInput.disabled ? taglineInput.value : '';


    //all are required
    if (!update || !mood || !emoji) {
        helper.handleError('All fields are required');
        return false;
    }


    //send
    helper.sendPost(e.target.action, { update, mood, emoji, tagline }, onStatusAdded);
    return false;
};




const StatusForm = (props) => {
    //check for premium
    const [isPremium, setIsPremium] = useState(false);

    useEffect(() => {
        const checkPremium = async () => {
            const res = await fetch('/profile');
            const data = await res.json();
            setIsPremium(data.premium);
        };
        checkPremium();
    }, []);


    //status form
    return (
        <form id="statusForm"
            onSubmit={(e) => handleStatus(e, props.triggerReload)}
            name="statusForm"
            action="/maker"
            method="POST"
            className="statusForm"
        >
            <label htmlFor="update">Status Update: </label>
            <input id="statusUpdate" type="text" name="update" placeholder="What's going on?" />

            <label htmlFor="mood">Mood: </label>
            <input id="statusMood" type="text" name="mood" placeholder="Feeling?" />

            <label htmlFor="emoji">Emoji: </label>
            <input id="statusEmoji" type="text" name="emoji" placeholder="emoji" maxLength="2" />

            <label htmlFor="tagline">Tagline: </label>
            <input
                id="statusTagline"
                type="text"
                name="tagline"
                placeholder={isPremium ? "Optional tagline..." : "Tagline (premium only)"}
                disabled={!isPremium}
            />

            <input className="makeStatusSubmit" type="submit" value="Post Status" />
        </form>
    );
};


const StatusList = (props) => {
    //already made statuses
    const [statuses, setStatuses] = useState(props.statuses);

    const [editTarget, setEditTarget] = useState(null);


    //get from server
    useEffect(() => {
        const loadStatusesFromServer = async () => {
            const response = await fetch('/getStatuses');
            const data = await response.json();
            setStatuses(data.statuses);
        };
        loadStatusesFromServer();
    }, [props.reloadStatuses]);


    //if none, show none
    if (statuses.length === 0) {
        return (
            <div className="statusList">
                <h3 className="emptyStatus">No Statuses yet!</h3>
            </div>
        );
    }

    //handle deletion
    const statusNodes = statuses.map(status => {
        const handleDelete = async () => {
            await helper.sendDelete('/deleteStatus', { id: status._id }, () => {
                props.triggerReload();
            });
        };

         //status form
        return (
            <div key={status._id} className="status" >
                <h3 className="statusUser">{status.username}</h3>
                <p className="statusEmoji" style={{ fontSize: '2rem' }}>{status.emoji}</p>
                <p className="statusUpdate">"{status.update}"</p>
                <p className="statusMood">Mood: <strong>{status.mood}</strong></p>
                <button onClick={handleDelete} className="deleteButton">Delete</button>
                <button onClick={() => setEditTarget(status)} className="editButton">Edit</button> {}
            </div>
        );
    });


    //status form edit
    return (
        <div className="statusList">
            {statusNodes}

            {editTarget && (
                <form className="editForm" onSubmit={async (e) => {
                    e.preventDefault();
                    const username = e.target.querySelector('#editUsername').value;
                    const emoji = e.target.querySelector('#editEmoji').value;
                    const update = e.target.querySelector('#editUpdate').value;
                    const mood = e.target.querySelector('#editMood').value;

                    await helper.sendPost('/updateStatus', {
                        _id: editTarget._id,
                        username,
                        emoji,
                        update,
                        mood,
                    }, () => {
                        props.triggerReload();
                        setEditTarget(null);
                    });
                }}>
                    <h3>Editing: {editTarget.username}</h3>

                    <label>Username: </label>
                    <input id="editUsername" name="username" defaultValue={editTarget.username} />

                    <label>Emoji: </label>
                    <input id="editEmoji" name="emoji" defaultValue={editTarget.emoji} />

                    <label>Status Update: </label>
                    <input id="editUpdate" name="update" defaultValue={editTarget.update} />

                    <label>Mood: </label>
                    <input id="editMood" name="mood" defaultValue={editTarget.mood} />

                    <button type="submit">Save Changes</button>
                    <button type="button" onClick={() => setEditTarget(null)}>Cancel</button>
                </form>
            )}
        </div>
    );
};


//app
const App = () => {
    const [reloadStatuses, setReloadStatuses] = useState(false);


    //statuses and premium toggle
    return (
        <div>
            <div id="makeStatus">
                <StatusForm triggerReload={() => setReloadStatuses(!reloadStatuses)} />
            </div>
            <div id="statuses">
                <StatusList statuses={[]} reloadStatuses={reloadStatuses} triggerReload={() => setReloadStatuses(!reloadStatuses)} />
            </div>
            <div id="premiumToggle" style={{ position: 'fixed', bottom: 0, width: '100%', textAlign: 'center', padding: '10px', backgroundColor: '#eee' }}>
                <button onClick={async () => {
                    await fetch('/togglePremium', { method: 'POST' });
                    window.location.reload();
                }}>
                    Toggle Premium Mode
                </button>
            </div>
        </div>
    );
};


//initialize
const init = () => {
    const root = createRoot(document.getElementById('app'));
    root.render(<App />);
};

window.onload = init;


