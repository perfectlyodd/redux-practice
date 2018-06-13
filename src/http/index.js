import { generate as id } from 'shortid';

const MAX_WAIT_TIME = 3000;

export const get = (url, callback) => {
    setTimeout(() => {
        callback(id());
    }, Math.random() * MAX_WAIT_TIME)
}