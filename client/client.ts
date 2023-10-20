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
  public state;


  public constructor(transmitter_hostname: string, audience: string, bearer: string, verify: boolean = true)
  {
    this.transmitter_hostname = transmitter_hostname;
    this.audience = audience;
    this.auth = bearer;
    this.verify = verify;
    this.state = "enable";
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

  public async configure_stream() //post
  {
    const { data, status } = await axios.post<Client_config>(
      this.endpoints.configuration_endpoint,      
      {
        "sub": "1234567890",
        "iss": "sevrer",
        "aud": [
        "http://receiver.example.com/web",
        "http://receiver.example.com/mobile"
      ],
      "delivery": {
        "delivery_method":
          "https://schemas.openid.net/secevent/risc/delivery-method/push",
          "url": "http://localhost:3030/push"},
      "events_requested": [
        "https://schemas.openid.net/secevent/risc/event-type/account-credential-change-required",
        "https://schemas.openid.net/secevent/risc/event-type/account-disabled",
        "https://schemas.openid.net/secevent/risc/event-type/recovery_information_changed"
      ]
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


  public async delete_configuration() //delete
  {
    const { data, status } = await axios.delete<Client_config>(
      this.endpoints.configuration_endpoint,
      {
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
          'Authorization': `Bearer ${this.auth}`
        }}
    );
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
          "iss": "sevrer",
          "aud": [
          "http://receiver.example.com/web",
          "http://receiver.example.com/mobile"
          ],
          "state": this.state
      },
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

  public async update_status() //post
  {
    const { data, status } = await axios.post(
      this.endpoints.status_endpoint,
      {
        "status": "disabled",
        
        "subject": {
          "format": "email",
          "email": "foo@example2.com"
        },
        "verified": true
      },
      {
        headers: {
          'Content-Type': 'application/json',//da mettere bearer token
          Accept: 'application/json',
          'Authorization': `Bearer ${this.auth}`
        },
      }
      
    );
    
    console.log(data);
  }


  public async get_status() //get
  {
    const { data, status } = await axios.get(
    this.endpoints.status_endpoint,
    {
      headers:
      {
        'authorization': `Bearer ${this.auth}`
      }
      
    }
  );
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
              'authorization': `Bearer ${this.auth}`
            }
            
          }
        );

        // Se la risposta è positiva, interrompi il loop
        if (status === 200) {
          this.endpoints = (data as List_of_endpoints); 
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

  console.log(req.body);

}


