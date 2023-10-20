import bodyParser from "body-parser";
import { pushEvents } from "./client";
import express from "express";
import {Client} from "./client";
import * as subject1 from "./subject1.json";
import * as subject2 from "./subject2.json";
const port = 3030;
let app;

app = express();

app.use(bodyParser.json());
app.post('/push',(req, res) => {
  pushEvents(req);
  res.status(200);
});
    
const first_endpoint = "http://localhost:3000/.well-known/sse-configuration";
let bearer:string = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6ImVubmlvLm1vbmNoZWxhdG9Ac3R1ZGVudGkudW5pdG4uaXQiLCJpYXQiOjE1MTYyMzkwMjJ9.jVo8R2f8PdrXfqd4NmVb4dw_rfA02BikG3zIFXavTRU";

app.listen(port, async () => {
  console.log(`Server is Fire at http://localhost:${port}`);

  
});


(async () => { 

let client = new Client("transmitter_hostname", "audience", bearer);  //sistema i parametri
await client.inviaRichiestaAlServer(first_endpoint); //passaggio di endpoints

await client.configure_stream(); //configura stream
await client.delete_configuration(); //elimina stream
await client.configure_stream(); //riconfigura stream
client.request_verification(); //scambio di un evento di prova

client.add_subject(JSON.parse(JSON.stringify(subject1)));//aggiunta di un subject

await client.add_subject(JSON.parse(JSON.stringify(subject2)));//aggiunta e rimozione di un subject
client.remove_subject(JSON.parse(JSON.stringify(subject2)));

client.update_status();//update e get dello status
client.get_status();

})();
