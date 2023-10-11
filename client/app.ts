import axios from "axios";
import express,{ Express } from "express";
import {Client} from "./client";
import * as subject from "./subject.json";
import { json } from "body-parser";


//await del transmitter

export function create_app()
{
    const app = express();
    const first_endpoint = "http://localhost:3000/events/get_endpoints";
    

    let client = new Client("transmitter_hostname", "audience", "bearer");  //sistema i parametri
    client.get_endpoints(first_endpoint); //passaggio di endpoints
    client.configure_stream(client.endpoints.configure_stream); //configura stream
    client.request_verification(client.endpoints.request_verification); //scambio di un evnto di prova
    /*for (let i = 0; i < subject.length; i++) {
        client.add_subject(final_endpoints.add_subject,JSON.parse(JSON.stringify(subject[i])));    //aggiunta dei vari subject
      }
      */
    
    
    return app;
}