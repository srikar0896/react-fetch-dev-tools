import { BehaviorSubject } from "rxjs";
import uuid from "uuid";

let versions = [];
let currentVersion = {};

const versionsSubscriber = new BehaviorSubject(versions);
export const currentVersionSubscriber = new BehaviorSubject(currentVersion)

export const registerVersion = (version) => {

    versions = [version, ...versions];
    versionsSubscriber.next(versions);
    console.log(versions);
};

export const setCurrentVersion = version => {
    currentVersion = version;
};

export default versionsSubscriber;
