import express, { Router } from "express";
import { TwilioScript } from "../controller/twilioScript";

const twilioRouter: Router = express.Router();

const twilioScript = new TwilioScript();

twilioRouter.post("/createCall", twilioScript.createCall);
twilioRouter.post("/gather", twilioScript.checkCallStatus);

export default twilioRouter;
