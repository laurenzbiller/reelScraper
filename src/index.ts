import express from "express";
import path from "path";
import { reelController } from "./controllers/reelController.ts";
import { entryController } from "./controllers/entryController.ts";

const app = express();
const PORT = 3000;

app.use(express.json());
app.use(express.static(path.resolve('public')));

app.post("/reel", reelController.handle);
app.get("/entries", entryController.getAll);

// start server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});