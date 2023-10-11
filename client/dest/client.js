"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.inviaRichiestaAlServer = exports.pushEvents = exports.Client = void 0;
const axios_1 = __importDefault(require("axios"));
class Client {
    constructor(transmitter_hostname, audience, bearer, verify = true) {
        this.message = {
            delivery: {
                method: "string",
                endpoint_url: "string",
            },
            events_requested: "string",
        };
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
    get_endpoints(endpoint) {
        return __awaiter(this, void 0, void 0, function* () {
            const { data, status } = yield axios_1.default.get(endpoint, {
                headers: {
                    Accept: 'application/json',
                },
            });
            this.endpoints = data;
        });
    }
    configure_stream(endpoint) {
        return __awaiter(this, void 0, void 0, function* () {
            const { data, status } = yield axios_1.default.post(endpoint, this.message, {
                headers: {
                    'Content-Type': 'application/json',
                    Accept: 'application/json',
                },
            });
            console.log(status);
        });
    }
    add_subject(endpoint, subject) {
        return __awaiter(this, void 0, void 0, function* () {
            const { data, status } = yield axios_1.default.post(//da cambiare in or dei vari subject
            endpoint, subject, {
                headers: {
                    'Content-Type': 'application/json',
                    Accept: 'application/json',
                },
            });
            console.log(status);
        });
    }
    request_verification(endpoint) {
        return __awaiter(this, void 0, void 0, function* () {
            const { data, status } = yield axios_1.default.post(endpoint, 15, {
                headers: {
                    'Content-Type': 'application/json',
                    Accept: 'application/json',
                },
            });
            console.log(status, data);
        });
    }
}
exports.Client = Client;
function pushEvents(req) {
    let i = req.body[0];
    console.log(i);
}
exports.pushEvents = pushEvents;
function inviaRichiestaAlServer() {
    return __awaiter(this, void 0, void 0, function* () {
        let tentativi = 0;
        while (true) {
            try {
                const response = yield axios_1.default.post('http://localhost:3000/events/poll');
                // Se la risposta è positiva, interrompi il loop
                if (response.status === 200) {
                    console.log('Il server ha risposto correttamente:', response.data);
                    break;
                }
            }
            catch (error) {
                if (error instanceof Error)
                    // Gestisci gli errori, ad esempio timeout della richiesta
                    console.error('Errore durante la richiesta:', error.message);
            }
            // Incrementa il numero di tentativi
            tentativi++;
            // Attendi un po' prima di fare il prossimo tentativo (ad esempio, 1 secondo)
            yield new Promise(resolve => setTimeout(resolve, 10000));
            console.log(`Tentativo ${tentativi} di contattare il server...`);
        }
    });
}
exports.inviaRichiestaAlServer = inviaRichiestaAlServer;
