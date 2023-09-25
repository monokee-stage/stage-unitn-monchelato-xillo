//This is the add_subject endpoint, it's used by the Event Receiver to add a subject to the Event Stream.

import { Request, Response } from 'express';

let verified: boolean;

export function add_subject(req: Request, res: Response) {
    //Read the subject from receriver request's
    const subject = req.body.subject;

    //Check if optional parameter "verified" is present
    if (req.body.hasOwnProperty('verified') && req.body.verified !== undefined) {
         verified = req.body.verified;
    }
    res.status(200).send();
}