"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const body_parser_1 = __importDefault(require("body-parser"));
const app_1 = require("./app");
const client_1 = require("./client");
const port = 3030;
let app = (0, app_1.create_app)();
app.use(body_parser_1.default.json());
app.post('/push', (req, res) => {
    (0, client_1.pushEvents)(req);
    res.status(200);
});
(0, client_1.inviaRichiestaAlServer)();
app.listen(port, () => {
    console.log(`Server in ascolto sulla porta ${port}`);
});
