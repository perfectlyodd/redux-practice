import { createStore, combineReducers } from 'redux';

const ONLINE = 'ONLINE'; 
const AWAY = 'AWAY';
const OFFLINE = 'OFFLINE';
const BUSY = 'BUSY';

const UPDATE_STATUS = "UPDATE_STATUS";
const CREATE_NEW_MESSAGE = "CREATE_NEW_MESSAGE";

const statusUpdateAction = (val) => {
    return {
        type: UPDATE_STATUS,
        value: val                                      // TODO: Add error-checking
    }
}

const newMessageAction = (content, postedBy) => {
    const date = new Date();
    return {
        type: CREATE_NEW_MESSAGE,
        value: content,
        postedBy,
        date
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


const statusReducer = (state = defaultState.userStatus, {type, value}) => {
    switch(type) {
        case UPDATE_STATUS:
            return value;
            break;
    }
    return state;
};

const messageReducer = (state = defaultState.messages, {type, value, postedBy, date}) => {
    switch(type) {
        case CREATE_NEW_MESSAGE:
            const newState = [
                {
                    date: date, 
                    postedBy: postedBy, 
                    content: value
                }, 
                ...state];
            return newState;
            break;
    }
    return state;
};

const globalReducer = combineReducers({
    userStatus: statusReducer,
    messages: messageReducer
});

const store = createStore(globalReducer);

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
    document.forms.newMessage.newMessage.value = "";
}

document.forms.selectStatus.status.addEventListener("change", (e) => {
    store.dispatch(
        statusUpdateAction(e.target.value)
    );
});

document.forms.newMessage.addEventListener("submit", (e) => {
    e.preventDefault();
        // Prevents page reloading
    const value = e.target.newMessage.value;
    const username = localStorage["preferences"] ? JSON.parse(localStorage["preferences"]).userName : "Jimbo Wales";
    store.dispatch(newMessageAction(value, username));
});

render();

store.subscribe(render);