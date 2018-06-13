import { createStore, combineReducers, applyMiddleware } from 'redux';
import { get } from './http';
import { createLogger } from 'redux-logger';

/* Status action constants */
export const ONLINE = 'ONLINE'; 
export const AWAY = 'AWAY';
export const OFFLINE = 'OFFLINE';
export const BUSY = 'BUSY';

/* Message action constants */
export const UPDATE_STATUS = "UPDATE_STATUS";
export const CREATE_NEW_MESSAGE = "CREATE_NEW_MESSAGE";

/* Network communication status constants */
export const READY = "READY";
export const WAITING = "WAITING";
export const NEW_MESSAGE_SERVER_ACCEPTED = "NEW_MESSAGE_SERVER_ACCEPTED";

export const statusUpdateAction = (val) => {
    return {
        type: UPDATE_STATUS,
        value: val                                      // TODO: Add error-checking
    }
}

const newMessageAction = (content, postedBy) => {
    const date = new Date();

    get('/api/create-message', (id) => {
        store.dispatch({
            type: NEW_MESSAGE_SERVER_ACCEPTED
        });
    });

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
    userStatus: ONLINE,
    networkCommunicationStatus: READY
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

const networkCommunicationStatusReducer = 
    (state = defaultState.networkCommunicationStatus, {type}) => {
    switch(type) {
        case CREATE_NEW_MESSAGE:
            return WAITING;
            break;
        case NEW_MESSAGE_SERVER_ACCEPTED:
            return READY;
            break;
    }
    return state;
}

const globalReducer = combineReducers({
    userStatus: statusReducer,
    messages: messageReducer,
    networkCommunicationStatus: networkCommunicationStatusReducer
});

const store = createStore(
    globalReducer, 
    applyMiddleware(createLogger())
);

const render = () => {
    const { messages, userStatus, networkCommunicationStatus } = store.getState();
    document.getElementById("messages").innerHTML = messages
        .sort((a, b) => b.date - a.date)                        // Sorts messages in chronological order
        .map(message => (`                                      
            <div>
                ${message.postedBy} : ${message.content}
            </div>
        `)).join("");

    document.forms.newMessage.fields.disabled = 
        (userStatus === OFFLINE || networkCommunicationStatus === WAITING);
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


/* Test code for HTTP async mock: */
console.log("Sending mock HTTP request");
get('http://someurl.com', (id) => {
    console.log(`Callback returned id = ${id}`);
});