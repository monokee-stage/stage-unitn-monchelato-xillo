
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
    fetch(this.endpoints.configuration_endpoint, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
      'Authorization': `Bearer ${this.auth}`
    },
    body: JSON.stringify({
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
      "https://schemas.openid.net/secevent/caep/event-type/session-revoked",
      "https://schemas.openid.net/secevent/caep/event-type/credential-change",
    ]
  }) // Dati da inviare nel corpo della richiesta
  })
  .then(response => response.text())
  .then(data => console.log(data))
  .catch(error => console.error('Si è verificato un errore:', error));
  
  }


  public async delete_configuration() //delete
  {
    fetch(this.endpoints.configuration_endpoint, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
        'Authorization': `Bearer ${this.auth}`
      },
      body:null // Dati da inviare nel corpo della richiesta
    })
    .then(response => response.text())
    .then(data => console.log(data))
    .catch(error => console.error('Si è verificato un errore:', error));
    
  }

  public async add_subject(subject:BodyInit) //post
  {
    fetch(this.endpoints.add_subject_endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
        'Authorization': `Bearer ${this.auth}`
      },
      body: subject // Dati da inviare nel corpo della richiesta
    })
    .then(response => response.text())
    .then(data => console.log(data))
    .catch(error => console.error('Si è verificato un errore:', error));
    
  }

  public async remove_subject(subject:BodyInit) //post
  {
    fetch(this.endpoints.remove_subject_endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
        'Authorization': `Bearer ${this.auth}`
      },
      body: subject // Dati da inviare nel corpo della richiesta
    })
    .then(response => response.text())
    .then(data => console.log(data))
    .catch(error => console.error('Si è verificato un errore:', error));
    
  }

  public async request_verification() //post
  {
    fetch(this.endpoints.verification_endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',//da mettere bearer token
        Accept: 'application/json',
        'Authorization': `Bearer ${this.auth}`
      },
      body: JSON.stringify({
        "iss": "sevrer",
        "aud": [
        "http://receiver.example.com/web",
        "http://receiver.example.com/mobile"
        ],
        "state": this.state
    }) // Dati da inviare nel corpo della richiesta
    })
    .then(response => response.text())
    .then(data => console.log(data))
    .catch(error => console.error('Si è verificato un errore:', error));
    
  }

  public async update_status() //post
  {
    fetch(this.endpoints.status_endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',//da mettere bearer token
        Accept: 'application/json',
        'Authorization': `Bearer ${this.auth}`
      },
      body: JSON.stringify({
        "status": "disabled",
        
        "subject": {
          "format": "email",
          "email": "foo@example2.com"
        },
        "verified": true
      }) // Dati da inviare nel corpo della richiesta
    })
    .then(response => response.text())
    .then(data => console.log(data))
    .catch(error => console.error('Si è verificato un errore:', error));
    
  }


  public async get_status() //get
  {
    fetch(this.endpoints.status_endpoint, {
      method: 'GET',
      headers:
      {
        'authorization': `Bearer ${this.auth}`
      },
      body: null // Dati da inviare nel corpo della richiesta
    })
    .then(response => response.text())
    .then(data => console.log(data))
    .catch(error => console.error('Si è verificato un errore:', error));
    
  }
  


  public async inviaRichiestaAlServer(endpoint:string) {
    let tentativi = 0;

        fetch(endpoint, {
          method: 'GET',
          headers:
            {
              'authorization': `Bearer ${this.auth}`
            },
          body: null // Dati da inviare nel corpo della richiesta
        })
        .then(response => response.text())
        .then(data => console.log(data))
        .catch(error => console.error('Si è verificato un errore:', error));
        

      // Attendi un po' prima di fare il prossimo tentativo (ad esempio, 1 secondo)
      await new Promise(resolve => setTimeout(resolve, 10000));

      console.log(`Tentativo ${tentativi} di contattare il server...`);
    
  }
}
