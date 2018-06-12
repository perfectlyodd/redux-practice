import { Dispatcher } from './flux/Dispatcher';
import { Store } from './flux/Store';

const UPDATE_FONT_SIZE_PREFERENCE = "UPDATE_FONT_SIZE_PREFERENCE";
const UPDATE_USERNAME = "UPDATE_USERNAME";

const controlPanelDispatcher = new Dispatcher();

const userNameUpdateAction = (name) => {
    return {
        type: UPDATE_USERNAME,
        value: name
    }
}

const fontSizePreferenceUpdateAction = (size) => {
    return {
        type: UPDATE_FONT_SIZE_PREFERENCE,
        value: size
    }
}


// The syntax here isolates the "target" properties of the event object for use in the callback
document.getElementById('userNameInput').addEventListener('input', ({target}) => {
    const name = target.value;
    console.log("Dispatching...", name);
    controlPanelDispatcher.dispatch(userNameUpdateAction(name));
});

document.forms.fontSizeForm.fontSize.forEach(element => {
    element.addEventListener('change', ({target}) => {
        controlPanelDispatcher.dispatch(fontSizePreferenceUpdateAction(target.value));
    });
});

class UserPrefsStore extends Store {
    getInitialState() {
        return localStorage["preferences"] ? JSON.parse(localStorage["preferences"]) : {
            userName: "Xavier", 
            fontSize: "small"
        }

        // return {
        //     userName: "Xavier",
        //     fontSize: "small"
        // }
    }
    __onDispatch(action) {
        switch(action.type) {
            case UPDATE_USERNAME:
                this.__state.userName = action.value;
                this.__emitChange();
                break;
            case UPDATE_FONT_SIZE_PREFERENCE:
                this.__state.fontSize = action.value;
                this.__emitChange();
                break;
        }
        console.log("Store received dispatch", action);
        this.__emitChange();
    }
    getUserPreferences() {
        return this.__state;
    }
}

const userPrefsStore = new UserPrefsStore(controlPanelDispatcher);

// This will be called every time the state updates
userPrefsStore.addListener((state) => {
    console.info("The current state is...", state);
    render(state);
    localStorage["preferences"] = JSON.stringify(state);
});

const render = ({userName, fontSize}) => {
    document.getElementById("userName").innerText = userName;
    document.getElementsByClassName("container")[0].style.fontSize = fontSize === "small" ? "16px" : "24px";
    document.forms.fontSizeForm.fontSize.value = fontSize;
}

render(userPrefsStore.getUserPreferences());

// This will register the passed arrow function as a listener on the dispatcher
// controlPanelDispatcher.register(action => {
//     console.info("Received action...", action);
// });