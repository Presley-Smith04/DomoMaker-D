const helper = require('./helper.js');
const React = require('react');
const { useState, useEffect } = React;
const { createRoot } = require('react-dom/client');


const handleDomo = (e, onDomoAdded) => {
    e.preventDefault();
    helper.hideError();

    const name = e.target.querySelector('#domoName').value;
    const age = e.target.querySelector('#domoAge').value;
    const nickname = e.target.querySelector('#domoNickname').value;
    const mood = document.querySelector('#domoMood').value;

    if (!name || !age) {
        helper.handleError('All fields are required');
        return false;
    }

    helper.sendPost(e.target.action, { name, age, nickname, mood }, onDomoAdded);
    return false;
};

const DomoForm = (props) => {
    return (
        <form id="domoForm"
            onSubmit={(e) => handleDomo(e, props.triggerReload)}
            name="domoForm"
            action="/maker"
            method="POST"
            className="domoForm"
        >
            <label htmlFor="name">Name: </label>
            <input id="domoName" type="text" name="name" placeholder="Domo Name" />

            <label htmlFor="nickname">Nickname: </label>
            <input id="domoNickname" type="text" name="nickname" placeholder="Domo Nickname" />

            <label htmlFor="age">Age: </label>
            <input id="domoAge" type="number" min="0" name="age" />

            <label htmlFor="mood">Mood: </label>
            <input id="domoMood" type="text" name="mood" placeholder="Happy? Sad?" />

            <input className="makeDomoSubmit" type="submit" value="Make Domo" />
        </form>
    );
};

const DomoList = (props) => {
    const [domos, setDomos] = useState(props.domos);

    //targets for update domo
    const [editTarget, setEditTarget] = useState(null);

    useEffect(() => {
        const loadDomosFromServer = async () => {
            const response = await fetch('/getDomos');
            const data = await response.json();
            setDomos(data.domos);
        };
        loadDomosFromServer();
    }, [props.reloadDomos]);

    if (domos.length === 0) {
        return (
            <div className="domoList">
                <h3 className="emptyDomo">No Domos yet!</h3>
            </div>
        );
    }

    const domoNodes = domos.map(domo => {
        const handleDelete = async () => {
            await helper.sendDelete('/deleteDomo', { id: domo._id }, () => {
                props.triggerReload();
            });
        };

        return (
            <div key={domo._id} className="domo">
                <h3 className="domoName">{domo.name}</h3>
                <img src="/assets/img/domoFace.jpeg" alt="Domo Face" className="domoFace" />
                <h3 className="domoAge">Age: {domo.age}</h3>
                {domo.nickname && <h4 className="domoNickname">Nickname: {domo.nickname}</h4>}
                <h3 className="domoMood">Mood: {domo.mood}</h3>
                <button onClick={handleDelete} className="deleteButton">Delete</button>
                <button onClick={() => setEditTarget(domo)} className="editButton">Edit</button>
            </div>
        );
    });

    return (
        <div className="domoList">
            {domoNodes}

            {/* edit form pops up if the form is being edited*/}
            {editTarget && (
                <form className="editForm" onSubmit={async (e) => {
                    e.preventDefault();
                    const name = e.target.querySelector('#editName').value;
                    const age = e.target.querySelector('#editAge').value;
                    const nickname = e.target.querySelector('#editNickname').value;
                    const mood = e.target.querySelector('#editMood').value;

                    await helper.sendPost('/updateDomo', {
                        _id: editTarget._id,
                        name,
                        age,
                        nickname,
                        mood,
                    }, () => {
                        props.triggerReload();
                        setEditTarget(null);
                    });
                }}>
                    <h3>Editing: {editTarget.name}</h3>
                    <label>Name: </label>
                    <input id="editName" name="name" defaultValue={editTarget.name} />

                    <label>Age: </label>
                    <input id="editAge" name="age" type="number" defaultValue={editTarget.age} />

                    <label>Nickname: </label>
                    <input id="editNickname" name="nickname" defaultValue={editTarget.nickname || ''} />

                    <label>Mood: </label>
                    <input id="editMood" name="mood" defaultValue={editTarget.mood} />

                    <button type="submit">Save Changes</button>
                    <button type="button" onClick={() => setEditTarget(null)}>Cancel</button>
                </form>
            )}
        </div>
    );
};

const App = () => {
    const [reloadDomos, setReloadDomos] = useState(false);

    return (
        <div>
            <div id="makeDomo">
                <DomoForm triggerReload={() => setReloadDomos(!reloadDomos)} />
            </div>
            <div id="domos">
                <DomoList domos={[]} reloadDomos={reloadDomos} triggerReload={() => setReloadDomos(!reloadDomos)} />
            </div>
        </div>
    );
};

const init = () => {
    const root = createRoot(document.getElementById('app'));
    root.render(<App />);
};

window.onload = init;