import express, { Express, Request, Response, Application } from 'express';
import dotenv from 'dotenv';
import { updateConfiguration, getConfiguration, deleteConfiguration } from './configuration_endpoint';
import { add_subject } from './add_subject_endpoint';
import { remove_subject } from './remove_subject_endpoint';
import { verification } from './verification_endpoint';


import { handleStatus } from './status';

//For env File 
dotenv.config();

const app: Application = express();
app.use(express.json());
const port = process.env.PORT || 3000;

//This is the well-known configuration endpoint where the client will connect to receive all the endpoints needed to configure the stream.
//(/.well-known/ if an application registers the name 'example', the corresponding well-known URI on 'http://www.example.com/' would be 'http://www.example.com/.well-known/example'.)
app.get('/.well-known/sse-configuration', (req: Request, res: Response) => { 

  //Set up the header 
  res.setHeader('Content-Type', 'application/json');

  //We send the 200 OK HTTP status code with the JSON object containing the endpoints            
  res.status(200).json({
    "configuration_endpoint":
        "https://localhost/configuration",
    "add_subject_endpoint": 
        "https://localhostadd-subject",
    "remove_subject_endpoint": 
        "https://localhost/remove-subject",
    "verification_endpoint": 
        "https://localhost/verification",
    "status_endpoint": 
        "https://localhost/status",
    "issuer": 
        "https://most-secure.com/",
    "jwks_uri": 
        "https://localhost/jwks.json",
    "delivery_methods_supported": [
        "https://schemas.openid.net/secevent/risc/delivery-method/push",          
        "https://schemas.openid.net/secevent/risc/delivery-method/poll"          
    ],
    "critical_subject_members": [
        "user"
    ]
  });
});

app.post('/configuration_endpoint', updateConfiguration);
app.get('/configuration_endpoint', getConfiguration);
app.delete('/configuration_endpoint', deleteConfiguration);

app.post('/add_subject_endpoint', add_subject);
app.post('/remove_subject_endpoint', remove_subject);

app.post('/verification_endpoint', verification);


app.get('/status', handleStatus);


//Endpoint to add a subject to the stream
app.post('/add-subject', (req: Request, res: Response) => {              
  console.log(req.body)                                 
  res.send('add-subject');
});

app.post('/remove-subject', (req: Request, res: Response) => {              
  console.log(req.body)                                 
  res.send('remove-subject');
});

app.post('/verification', (req: Request, res: Response) => {             
  console.log(req.body)                                 
  res.send('verification');
});

app.post('/', (req: Request, res: Response) => {                 //perchè enpoint è vuoto
  console.log(req.body)                                 
  res.send('issuer');
});

app.post('/jwks.json', (req: Request, res: Response) => {               
  console.log(req.body)                                 
  res.send('jwks');
});

app.post('/push', (req: Request, res: Response) => {            //?? guarda configuration.json
  console.log(req.body)                                 
  res.send('push');
});

app.post('/poll', (req: Request, res: Response) => {            //??  guarda configuration.json
  console.log(req.body)                                 
  res.send('poll');
});

app.listen(port, () => {
  console.log(`Server is Fire at http://localhost:${port}`);
});
