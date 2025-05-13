import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import dotenv from "dotenv";
import { Configuration, OpenAIApi } from "openai";

dotenv.config();

const app = express();
app.use(cors());
app.use(bodyParser.json());

const openai = new OpenAIApi(
  new Configuration({ apiKey: process.env.OPENAI_API_KEY })
);

app.post("/api/chat", async (req, res) => {
  const { assistant_id, message } = req.body;
  try {
    const response = await openai.beta.threads.createAndRun({
      assistant_id,
      thread: { messages: [{ role: "user", content: message }] },
    });
    const final = await openai.beta.threads.runs.retrieve(response.id, response.thread_id);
    const msg = final.last_error?.message || final.status;
    res.json({ reply: msg });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error al contactar con OpenAI" });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor escuchando en puerto ${PORT}`);
});
