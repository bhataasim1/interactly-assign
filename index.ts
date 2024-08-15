import express, { Application, Request, Response } from "express";
import { BaseEnvironment } from "./Environment";
import cors from "cors";
import { sendApiResponseMiddleware } from "./middleware/apiResponse.middleware";
import freshSaleRouter from "./routes/freshSale.routes";
import twilioRouter from "./routes/twilio.routes";

const env = new BaseEnvironment();

const app: Application = express();

app.use(express.json());
app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(sendApiResponseMiddleware);

app.use("/", freshSaleRouter);
app.use("/", twilioRouter);

app.get("/health-check", (req: Request, res: Response) => {
  return res.send("I am alive!");
});

app.listen(env.PORT, () => {
  console.log(`Server is running on ${env.HOST}:${env.PORT}`);
});
