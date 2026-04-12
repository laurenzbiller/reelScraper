import express from "express";
import path from "path";
import http from 'http';
import { reelController } from "./controllers/reelController.ts";
import { entryController } from "./controllers/entryController.ts";
import { initWSS } from "./services/websocketService.ts";

const app = express();
const PORT = 3000;

app.use(express.json());
app.use(express.static(path.resolve('public')));

app.post("/reel", reelController.handle);
app.get("/entries", entryController.getAll);

const server = http.createServer(app);
initWSS(server);

// start server
server.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});