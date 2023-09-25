//This is the configuration endpoint used to read, update or delete the configuration of the stream.

import { Request, Response } from 'express';

const events_supported = [
  "http://localhost/account-credential-change-required",
  "http://localhost/account-purged",
  "http://localhost/account-disabled",
  "http://localhost/account-enabled",
  "http://localhost/identifier-changed",
  "http://localhost/identifier-recycled",
  "http://localhost/credential-compromised",  
  "http://localhost/opt-in",
  "http://localhost/opt-out-initiated",
  "http://localhost/opt-out-cancelled",
  "http://localhost/opt-out-effective",
  "http://localhost/recovery-activated",
  "http://localhost/recovery-information_changed",
  "http://localhost/session-revoked",];

let events_requested = "";
let events_delivered = [""]; 
let endpoint_delivery_url = "";
let delivery = "";


//This endpoint is to update the stream configuration
export function updateConfiguration(req: Request, res: Response) {
    //Saving the issuer of the message (from body of post request, later will have to change to decode and read this info from JWT)
    const audience = req.body.iss;    
  
    //Saving the delivery method chosen (in lastpart) 
    delivery = req.body.delivery_method; 
    const parts = delivery.split('/');
    endpoint_delivery_url = "http://localhost/" + parts[parts.length - 1];
  
    //Saving the events requested from client
    events_requested =  req.body.events_requested;

    //Filtering events supported and requested
    events_delivered = events_supported.filter(event => events_requested.includes(event));

    //(OPTIONAL) Saving format client wants for subject
    const format = req.body.format;
  
    //Set up the header 
    res.setHeader('Content-Type', 'application/json');
    
    //Send response to client with 200 OK
    res.status(200).json({
      "iss":
        "http://localhost/",
      "aud": 
        audience,
      "delivery": {
        "url": endpoint_delivery_url,
        "delivery_method": delivery
      },
      "events_supported": [
        events_supported,
      ],
      "events_requested": [
        events_requested,
      ],
      "events_delivered": [
        events_delivered,
      ],
      "format": 
        format,
      "min_verification_interval": 60,
    });
}

//This endpoint is to read the stream configuration
export function getConfiguration(req: Request, res: Response) {
  //Get the issuer
  const host = req.get('Host');

  //Set up the header 
  res.setHeader('Content-Type', 'application/json');

  res.status(200).json({
    "iss":
      "http://localhost/",
    "aud": [
      host
    ],
    "delivery": {
      "url": endpoint_delivery_url,
      "delivery_method": delivery
    },
    "events_supported": [
      events_supported,
    ],
    "events_requested": [
      events_requested,
    ],
    "events_delivered": [
      events_delivered,
    ]
  });
}

//This endpoint is to delete the stream configuration
export function deleteConfiguration(req: Request, res: Response) {
  events_requested = "";
  events_delivered = [""];
  endpoint_delivery_url = "";
  delivery = "";
  res.status(200).send();
}