//This is the remove_subject endpoint, it's used by the Event Receiver to remove a subject from the Event Stream.

import { Request, Response } from 'express';

export function remove_subject(req: Request, res: Response) {
    //Read the subject from receriver request's
    const subject = req.body.subject;
    
    res.status(204).send();
}