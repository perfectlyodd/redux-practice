import { Dispatcher } from './flux';

const controlPanelDispatcher = new Dispatcher();


// The syntax here isolates the "target" properties of the event object for use in the callback
document.getElementById('userNameInput').addEventListener('input', ({target}) => {
    const name = target.value;
    console.log("Dispatching...", name);
    controlPanelDispatcher.dispatch('TODO__NAMEINPUTACTION');
})

// This will register the passed arrow function as a listener on the dispatcher
controlPanelDispatcher.register(action => {
    console.info("Received action...", action);
})