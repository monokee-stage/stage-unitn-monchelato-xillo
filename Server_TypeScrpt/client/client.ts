import axios from "axios";
import { json } from "body-parser";
import { UUID } from "mongodb";
import { Request } from "express";

type Stream_config = {
    delivery:{
      method: string;
      endpoint_url: string;
    };
    events_requested: string;
  };

type List_of_endpoints = {

  configure_stream: string;
  add_subject: string;
  request_verification: string;
}

export class Client
{
  public transmitter_hostname;
  public audience;
  public auth;
  public verify;
  public endpoints: List_of_endpoints;
  public message: Stream_config = {
    delivery:{
      method: "string",
      endpoint_url: "string",
    },
    events_requested: "string",
  }


  public constructor(transmitter_hostname: string, audience: string, bearer: string, verify: boolean = true)
  {
    this.transmitter_hostname = transmitter_hostname;
    this.audience = audience;
    this.auth = bearer;
    this.verify = verify;
    this.endpoints = {
      configure_stream: '/configure-stream',
      add_subject: '/add-subject',
      request_verification: '/request-verification',
    };
    
  }

  public async get_endpoints(endpoint: string) //preimposto degli endpoints 
  {
    const { data, status } = await axios.get<List_of_endpoints>(
      endpoint,
      {
        headers: {
          Accept: 'application/json',
        },
      },
    );
    
    this.endpoints = data;  
  }

  public async configure_stream(endpoint:string) //post
  {
    const { data, status } = await axios.post<Stream_config>(
      endpoint,
      this.message,
      {
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
      },
    );
    console.log(status);
  }

  public async add_subject(endpoint:string,subject:JSON) //post
  {
    const { data, status } = await axios.post<JSON>(    //da cambiare in or dei vari subject
        endpoint,
        subject,
        {
          headers: {
            'Content-Type': 'application/json',
            Accept: 'application/json',
          },
        },
      );
      console.log(status);
  }

  public async request_verification(endpoint:string) //post
  {
    const { data, status } = await axios.post<number>(
        endpoint,
         15 ,
        {
          headers: {
            'Content-Type': 'application/json',
            Accept: 'application/json',
          },
        },
      );
      console.log(status,data);
  }
}

export function pushEvents(req:Request) {
  
  let i=req.body[0];
  console.log(i);

}

export async function inviaRichiestaAlServer() {
  let tentativi = 0;

  while (true) {
    try {
      
      const response = await axios.post('http://localhost:3000/events/poll');

      // Se la risposta è positiva, interrompi il loop
      if (response.status === 200) {
        console.log('Il server ha risposto correttamente:', response.data);
        break;
      }
    } catch (error) {
      if (error instanceof Error)
      // Gestisci gli errori, ad esempio timeout della richiesta
      console.error('Errore durante la richiesta:', error.message);
    }

    // Incrementa il numero di tentativi
    tentativi++;

    // Attendi un po' prima di fare il prossimo tentativo (ad esempio, 1 secondo)
    await new Promise(resolve => setTimeout(resolve, 10000));

    console.log(`Tentativo ${tentativi} di contattare il server...`);
  }
}