import bodyParser from "body-parser";
import { create_app } from "./app";
import { pushEvents, inviaRichiestaAlServer } from "./client";


const port = 3030;
let app = create_app();
app.use(bodyParser.json());
app.post('/push',(req, res) => {
  pushEvents(req);
  res.status(200);
});
inviaRichiestaAlServer();
app.listen(port, () => {
  console.log(`Server in ascolto sulla porta ${port}`);
});