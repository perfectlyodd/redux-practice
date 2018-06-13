import { createStore } from 'redux';

const ONLINE = 'ONLINE'; 
const AWAY = 'AWAY';
const OFFLINE = 'OFFLINE';
const BUSY = 'BUSY';

const UPDATE_STATUS = "UPDATE_STATUS";

const statusUpdateAction = (val) => {
    return {
        type: UPDATE_STATUS,
        value: val                                      // TODO: Add error-checking
    }
}

const defaultState = {
    messages: [
        {
            date: new Date('2018-6-13 15:14:15'),
            postedBy: 'the Dude',
            content: 'the Dude abides'
        },
        {
            date: new Date('2018-6-13 15:27:18'),
            postedBy: 'Putin',
            content: 'Did anyone see my shirt?'
        },
        {
            date: new Date('2018-6-13 15:47:38'),
            postedBy: 'the Trumpster',
            content: 'Media covfefe of Singapore has been tremendous!!!'
        }
    ],
    userStatus: ONLINE
}

const globablReducer = (state = defaultState, {type, value}) => {
    switch(type) {
        case UPDATE_STATUS:
            return {...state, userStatus: value};
            break;
    }
    return state;
}

const store = createStore(globablReducer);

const render = () => {
    const { messages, userStatus } = store.getState();
    document.getElementById("messages").innerHTML = messages
        .sort((a, b) => b.date - a.date)                        // Sorts messages in chronological order
        .map(message => (`                                      
            <div>
                ${message.postedBy} : ${message.content}
            </div>
        `)).join("");

    document.forms.newMessage.fields.disabled = (userStatus === OFFLINE)
}

document.forms.selectStatus.status.addEventListener("change", (e) => {
    store.dispatch(
        statusUpdateAction(e.target.value)
    );
});

render();

store.subscribe(render);