import express, { Express, Request, Response } from 'express';
import bodyParser from 'body-parser';


const app = express();
const port = 3000;

// Middleware per il parsing del corpo delle richieste in formato JSON
app.use(bodyParser.json());

app.post('/events/poll',(req, res) => {

    res.status(200).json(pollEvents(req));
});

app.listen(port, () => {
    console.log(`Server in ascolto sulla porta ${port}`);
});

function pollEvents(req:Request) {

  const event = {
      "jti": "12345",
      "iat": "0934723987",
      "iss": "http://localhost/" ,
      "aud":  req.body.iss,
      "events": {
          "http://localhost/":{       
              "state": true
          }
      }
    };                        //utilizzo un evento generico, 
                              //sostituire con lettura da db
                              //prendendo gli eventi corretti da stream

  return [event, 200];
}
