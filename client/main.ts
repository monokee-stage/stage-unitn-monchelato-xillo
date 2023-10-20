import bodyParser from "body-parser";
import { pushEvents } from "./client";
import express from "express";
import {Client} from "./client";
import * as subject from "./subject.json";

const port = 3030;
let app;

app = express();

app.use(bodyParser.json());
app.post('/push',(req, res) => {
  pushEvents(req);
  res.status(200);
});
    
const first_endpoint = "http://localhost:3000/.well-known/sse-configuration";
let bearer:string = "";

app.listen(port, async () => {
  console.log(`Server is Fire at http://localhost:${port}`);

  const url = 'https://test.monokee.com/6627a356-c838-4ad9-8ff3-e2924b204280/oauth2/651b923d-4daa-4f00-8875-3b89cbb8d421/token';
  const data = new URLSearchParams();
  data.append('grant_type', 'client_credentials');

  const headers = {
    'Content-Type': 'application/x-www-form-urlencoded',
    'Authorization': 'Basic c2hhcmVkc2lnbmFscy1yZXNvdXJjZS1zZXJ2ZXI6c2hhcmVkc2lnbmFscy1yZXNvdXJjZS1zZXJ2ZXI='
  };

  async function getToken(): Promise<void> {
    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: headers,
        body: data
      });

      if (response.ok) {
        const data = await response.json();
        bearer = data.access_token;
        console.log('Access Token Server:', data.access_token);
      } else {
        console.error('Error during token request:', response.statusText);
      }
    } catch (error) {
      console.error('Error during token request:', error);
    }
  }
  getToken();
});

let client = new Client("transmitter_hostname", "audience", bearer);  //sistema i parametri



(async () => { 


await client.inviaRichiestaAlServer(first_endpoint); //passaggio di endpoints



client.add_subject(JSON.parse('{"ciao":"ciao"}'));

/*client.configure_stream(); //configura stream
client.request_verification(); //scambio di un evnto di prova
for (let i = 0; i < subject.length; i++) {
    client.add_subject(client.endpoints.add_subject_endpoint,JSON.parse(JSON.stringify(subject[i])));    //aggiunta dei vari subject
  }
client.remove_subject(client.endpoints.remove_subject_endpoint, JSON.parse('{"format": "email", "email": "salve"}'));
client.poll(client.endpoints.delivery_methods_supported[1]);
*/
})();
