import { Dispatcher, ReduceStore } from './flux';
import { generate as id } from 'shortid';

const CREATE_TASK = 'CREATE_TASK';
const COMPLETE_TASK = 'COMPLETE_TASK';
const SHOW_TASKS = 'SHOW_TASKS';

const createNewTaskAction = (content) => {
    return {
        type: CREATE_TASK,
        value: content
    }
};

const showTasksAction = (show) => {
    return {
        type: SHOW_TASKS,
        value: show
    }
};

const completeTaskAction = (id, isComplete) => {
    return {
        type: COMPLETE_TASK,
        id, 
        value: isComplete
    }
};

const tasksDispatcher = new Dispatcher();

class TaskStore extends ReduceStore {
    getInitialState() {
        return {
            tasks: [
                {
                    id: id(),
                    content: "Update CSS styles",
                    complete: false
                },
                {
                    id: id(),
                    content: "Add unit tests",
                    complete: false
                },
                {
                    id: id(),
                    content: "Social media stuff",
                    complete: false
                },
                {
                    id: id(),
                    content: "Install jQuery and RXJS for betterification",
                    complete: true
                }            
            ],
            showComplete: true
        };
    }

    reduce(state, action) {
        console.log("Reducing...", state, action);
        let newState;
        switch(action.type) {
            case CREATE_TASK:
                newState = { ...state, tasks: [...state.tasks]};
                newState.tasks.push({
                    id: id(),
                    content: action.value,
                    complete: false
                });
                return newState;
            case SHOW_TASKS:
                newState = { ...state, tasks: [...state.tasks], showComplete: action.value };
                return newState;
            case COMPLETE_TASK:
                newState = { ...state, tasks: [...state.tasks]};
                const affectedElementIndex = newState.tasks.findIndex(t => (t.id === action.id));
                console.log(`Index of task about to change: ${affectedElementIndex}`)
                newState.tasks[affectedElementIndex] = 
                    { ...state.tasks[affectedElementIndex], complete: action.value };
                return newState;
        }
        return state;
    }

    getState() {
        return this.__state;
    }
}

const taskComponent = ({content, complete, id}) => (
    `<section>
        ${content} <input type="checkbox" name="taskCompleteCheck" data-taskid=${id} ${complete ? "checked" : ""}>
    </section>`
);

document.forms.undo.addEventListener("submit", e => {
    e.preventDefault();
        // Prevents page reload
    tasksStore.revertToLastState();
})

const render = () => {
    const tasksSection = document.getElementById("tasks");
    const state = tasksStore.getState();
    console.log(`State about to be rendered: ${state}`);
    const rendered = state.tasks
        .filter(task => state.showComplete ? true : !task.complete)
        .map(taskComponent)
        .join("");
    tasksSection.innerHTML = rendered;

    document.getElementsByName("taskCompleteCheck").forEach(elem => {
        elem.addEventListener("change", e => {
            const id = e.target.attributes["data-taskid"].value;
            const checked = e.target.checked;
            tasksDispatcher.dispatch(completeTaskAction(id, checked));
        });
    });
};

document.forms.newTask.addEventListener("submit", e => {
    e.preventDefault();
        // Prevents page refresh
    const name = e.target.newTaskName.value;
    if (name) {
        tasksDispatcher.dispatch(createNewTaskAction(name));
        e.target.newTaskName.value = null;
    }
});

document.getElementById("showComplete").addEventListener("change", ({target}) => {
    const showComplete = target.checked;
    tasksDispatcher.dispatch(showTasksAction(showComplete));
});

const tasksStore = new TaskStore(tasksDispatcher);

tasksDispatcher.dispatch('TEST_DISPATCH');

tasksStore.addListener(() => {
    render();
});

render();