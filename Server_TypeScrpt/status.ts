import { Request, Response } from 'express';

export function handleStatus(req: Request, res: Response) {
    //Check if optional parameter "subject" is present
    if (req.body.hasOwnProperty('subject') && req.body.subject !== undefined) {
        const audience = req.body.subject;
    }

    //Set up the header 
    res.setHeader('Content-Type', 'application/json');

    res.status(200).json({
        
    });
}