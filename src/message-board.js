import { createStore } from 'redux';

const ONLINE = 'ONLINE'; 
const AWAY = 'AWAY';
const OFFLINE = 'OFFLINE';
const BUSY = 'BUSY';

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


const store = createStore((state = defaultState) => {
    return state;
});

const render = () => {
    const { messages, userStatus } = store.getState();
    document.getElementById("messages").innerHTML = messages
        .sort((a, b) => b.date - a.date)                        // Sorts messages in chronological order
        .map(message => (`                                      
            <div>
                ${message.postedBy} : ${message.content}
            </div>
        `)).join("");
}

render();