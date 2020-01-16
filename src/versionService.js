import { BehaviorSubject } from "rxjs";
import uuid from "uuid";

let versions = [];

const versionsSubscriber = new BehaviorSubject(versions);

export const registerVersion = (version) => {
    
    const updatedVersions = [
        ...versions,
        version
    ];

    versions = [version, ...versions];
    versionsSubscriber.next(versions);
};

export default versionsSubscriber;
