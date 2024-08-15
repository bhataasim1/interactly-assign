import twilio from "twilio";
import { BaseEnvironment } from "../Environment";
import { Request, Response } from "express";

const env = new BaseEnvironment();

const client = twilio(env.TWILIO_ACCOUNT_SID, env.TWILIO_AUTH_TOKEN);

export class TwilioScript {
  constructor() {
    this.createCall = this.createCall.bind(this);
    this.checkCallStatus = this.checkCallStatus.bind(this);
  }

  async createCall(req: Request, res: Response) {
    const { to } = req.body;
    try {
      const call = await client.calls.create({
        from: env.TWILIO_PHONE_NUMBER,
        to,
        twiml: `
            <Response>
              <Gather action="/gather" method="POST" numDigits="1">
                <Play>https://ect82q.bn.files.1drv.com/y4mGYURLog88TliAQzjx2o-VVvuPFqH5VpPhp94ha_9lvoKiack4PwOHLaSyluMnLwBHoOZSM2sD1BrnHGtqB1vxc3z6F9C1DgE8FCh7OFnF9Kin2GY60PYca53fTrOkDd7l-An-AJHhUHzrckxYwL47_rmJajno_iZeCWeNWjLo2mzqT1qh11EtXoHHjouyVSvjJLhJvdahEfKn0kNE_pbbA?</Play>
              </Gather>
              <Hangup/>
            </Response>
          `,
      });

      res.status(200).json({
        message: "IVR call initiated successfully",
        callSid: call.sid,
      });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "Failed to initiate IVR call" });
    }
  }

  async checkCallStatus(req: Request, res: Response) {
    client.messages
      .create({
        body: "Here is your personalized interview link: https://v.personaliz.ai/?id=9b697c1a&uid=fe141702f66c760d85ab&mode=test",
        to: "+91xxxxxxxxx", // Replace with your phone number
        from: env.TWILIO_PHONE_NUMBER,
      })
      .then((message) => console.log(message.sid))
      .catch((err) => console.error(err));
    res.send("<Response><Say>Thank you!</Say></Response>");
  }
}
