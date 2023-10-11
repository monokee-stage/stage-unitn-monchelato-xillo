"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.create_app = void 0;
const express_1 = __importDefault(require("express"));
const client_1 = require("./client");
//await del transmitter
function create_app() {
    const app = (0, express_1.default)();
    const first_endpoint = "http://localhost:3000/events/get_endpoints";
    let client = new client_1.Client("transmitter_hostname", "audience", "bearer"); //sistema i parametri
    client.get_endpoints(first_endpoint); //passaggio di endpoints
    client.configure_stream(client.endpoints.configure_stream); //configura stream
    client.request_verification(client.endpoints.request_verification); //scambio di un evnto di prova
    /*for (let i = 0; i < subject.length; i++) {
        client.add_subject(final_endpoints.add_subject,JSON.parse(JSON.stringify(subject[i])));    //aggiunta dei vari subject
      }
      */
    return app;
}
exports.create_app = create_app;
