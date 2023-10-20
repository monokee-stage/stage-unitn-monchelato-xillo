import axios from "axios";
import { json } from "body-parser";
import { UUID } from "mongodb";
import { Request, Response } from 'express';import { publicDecrypt } from "crypto";
;

type Stato = "enabled"|"disabled"|"paused";

interface Client_config {
  client_id:string;
  events_requested: string[];
  events_delivered: string[]; 
  endpoint_delivery_url: string;
  delivery: string;
  delivery_method: string;
  aud:string[];
  status:Stato;
  events: RequestInit[];
  index: number;
}

interface List_of_endpoints {

  configuration_endpoint:
        string,
  add_subject_endpoint: 
      string,
  remove_subject_endpoint: 
      string,
  verification_endpoint: 
      string,
  status_endpoint: 
      string,
  issuer: 
      string,
  jwks_uri: 
      string,
  delivery_methods_supported: [
      string,          
      string          
  ],
  critical_subject_members: [
      string
  ]
}

export class Client
{
  public transmitter_hostname;
  public audience;
  public auth;
  public verify;
  public endpoints;


  public constructor(transmitter_hostname: string, audience: string, bearer: string, verify: boolean = true)
  {
    this.transmitter_hostname = transmitter_hostname;
    this.audience = audience;
    this.auth = bearer;
    this.verify = verify;
    this.endpoints = {

      configuration_endpoint:
            "",
      add_subject_endpoint: 
          "",
      remove_subject_endpoint: 
          "",
      verification_endpoint: 
          "",
      status_endpoint: 
          "",
      issuer: 
          "",
      jwks_uri: 
          "",
      delivery_methods_supported: [
          "",          
          ""          
      ],
      critical_subject_members: [
          ""
      ]
    };
    
  }

  /*public async get_endpoints(endpoint: string) //get
  {
    const { data, status } = await axios.get<List_of_endpoints>(
      endpoint,
      {
        headers:
        {
          'Authorization': `Bearer ${this.auth}`
        }
      }
    );

    this.endpoints = (data as List_of_endpoints); 

    console.log(status);
  }*/

  public async configure_stream() //post
  {
    const { data, status } = await axios.post<Client_config>(
      this.endpoints.configuration_endpoint,      //controlla sia l'endpoint giusto
      {
        delivery:{
          method: "https://schemas.openid.net/secevent/risc/delivery-method/push",
          endpoint_url: "string",
        },
        events_requested: "https://schemas.openid.net/secevent/risc/event-type/credential-compromise",
      },
      {
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
          'Authorization': `Bearer ${this.auth}`
        },
        
      },
    );
    console.log(status);
  }

  public async add_subject(subject:JSON) //post
  {
    const { data, status } = await axios.post<JSON>(          
        this.endpoints.add_subject_endpoint,
        subject,
        {
          headers: {
            'Content-Type': 'application/json',
            Accept: 'application/json',
            'Authorization': `Bearer ${this.auth}`
          },
        }
      );
      console.log(status);

  }

  public async remove_subject(subject:JSON) //post
  {
    const { data, status } = await axios.post<JSON>(          
        this.endpoints.remove_subject_endpoint,
        subject,
        {
          headers: {
            'Content-Type': 'application/json',
            Accept: 'application/json',
            'Authorization': `Bearer ${this.auth}`
          },
        },
      );
      console.log(status);
  }

  public async request_verification() //post
  {
    const { data, status } = await axios.post(
        this.endpoints.verification_endpoint,
           
        {
          headers: {
            'Content-Type': 'application/json',//da mettere bearer token
            Accept: 'application/json',
            'Authorization': `Bearer ${this.auth}`
          },
        },
      );
      console.log(status,data);
  }

  public async get_status(endpoint: string) //get
  {
    const { data, status } = await axios.get(
      this.endpoints.status_endpoint
    );
    
    console.log(data);
  }

  public async poll(endpoint:string){
    const { data, status } = await axios.post<string>(
      endpoint,
       {
        'maxevents': 5,
        'returnImmediately': true,
       } , //cambia in json da inviare
      {
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
          'Authorization': ''
        },
      },
    );
    console.log(status,data);
  }

  public async inviaRichiestaAlServer(endpoint:string) {
    let tentativi = 0;

    while (true) {
      try {
        
        const { data, status } = await axios.get<List_of_endpoints>(
          endpoint,
          {
            headers:
            {
              'Authorization': `Bearer ${this.auth}`
            }
          }
        );

        // Se la risposta è positiva, interrompi il loop
        if (status === 200) {
          this.endpoints = (data as List_of_endpoints); 
          console.log(this.endpoints.add_subject_endpoint);
          console.log('Il server ha risposto correttamente:', status);
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
}

export function pushEvents(req:Request) {

  req.body.forEach(function (value: any) {
    console.log(value);
  })

}

