import { BaseController } from "./_BaseController";
import { Request, Response } from "express";
import axios from "axios";
import { BaseEnvironment } from "../Environment";
import { prisma } from "../prisma/prisma";

const env = new BaseEnvironment();

type ContactData = {
  first_name: string;
  last_name: string;
  email: string;
  mobile_number: string;
  data_store?: string;
};

export class FreshSalesController extends BaseController {
  constructor() {
    super();
    this.createContact = this.createContact.bind(this);
    this.getContact = this.getContact.bind(this);
    this.updateContact = this.updateContact.bind(this);
    this.deleteContact = this.deleteContact.bind(this);
  }
  async createContact(req: Request, res: Response) {
    const {
      first_name,
      last_name,
      email,
      mobile_number,
      data_store,
    }: ContactData = req.body;

    if (!first_name || !last_name || !email || !mobile_number || !data_store) {
      return this._sendResponse(res, "Please provide all required fields", 400);
    }

    if (data_store === "CRM") {
      const response = await this._createContactInCRM({
        first_name,
        last_name,
        email,
        mobile_number,
      });

      //   console.log("CRM response", response);
      //   const { data } = response;
      const { contact } = response.data;

      return this._sendResponse(res, "Contact created in CRM", 201, {
        contact,
      });
    } else if (data_store === "DATABASE") {
      try {
        const existingContact = await this._checkExistingContact({
          email,
          mobile_number,
        });

        if (existingContact) {
          return this._sendResponse(
            res,
            "Contact with this email or mobile number already exists",
            400
          );
        }

        const contacts = await prisma.contact.create({
          data: {
            first_name,
            last_name,
            email,
            mobile_number,
          },
        });

        return this._sendResponse(res, "Contact created in Database", 201, {
          contacts,
        });
      } catch (error) {
        return this._sendError(res, error);
      }
    }
  }

  async getContact(req: Request, res: Response) {
    const { contact_id, data_store } = req.params;

    if (!contact_id || !data_store) {
      return this._sendResponse(res, "Please provide valid contact id", 400);
    }

    if (data_store === "CRM") {
      try {
        const response = await this._getContactFromCRM(contact_id);

        if (!response.data) {
          return this._sendResponse(res, "Contact not found in CRM", 404);
        }

        // const { data } = response;
        const { contact } = response.data;

        return this._sendResponse(res, "Contact fetched from CRM", 200, {
          contact,
        });
      } catch (error) {
        return this._sendError(res, error);
      }
    } else if (data_store === "DATABASE") {
      try {
        const contact = await prisma.contact.findUnique({
          where: {
            id: parseInt(contact_id),
          },
        });

        if (!contact) {
          return this._sendResponse(res, "Contact not found in Database", 404);
        }

        // console.log("contact", contact);

        return this._sendResponse(res, "Contact fetched from Database", 200, {
          contact,
        });
      } catch (error) {
        return this._sendError(res, error);
      }
    }
  }

  async updateContact(req: Request, res: Response) {
    const { contact_id } = req.params;
    const { new_email, new_phone, data_store } = req.body;

    if (!contact_id || !data_store) {
      return this._sendResponse(res, "Please provide valid contact id", 400);
    }

    if (data_store === "CRM") {
      const response = await this._updateContactInCRM(contact_id, {
        email: new_email,
        mobile_number: new_phone,
      });

      const { contact } = response.data;

      return this._sendResponse(res, "Contact updated in CRM", 200, {
        contact,
      });
    } else if (data_store === "DATABASE") {
      try {
        const existingContact = await this._checkExistingContact({
          email: new_email,
          mobile_number: new_phone,
        });

        if (existingContact) {
          return this._sendResponse(
            res,
            "Contact with this email or mobile number already exists",
            400
          );
        }

        const contact = await prisma.contact.update({
          where: {
            id: parseInt(contact_id),
          },
          data: {
            email: new_email,
            mobile_number: new_phone,
          },
        });

        return this._sendResponse(res, "Contact updated in Database", 200, {
          contact,
        });
      } catch (error) {
        return this._sendError(res, error);
      }
    }
  }

  async deleteContact(req: Request, res: Response) {
    const { contact_id, data_store } = req.params;

    if (!contact_id || !data_store) {
      return this._sendResponse(res, "Please provide valid contact id", 400);
    }

    if (data_store === "CRM") {
      try {
        const response = await this._deleteContactFromCRM(contact_id);

        if (!response.data) {
          return this._sendResponse(res, "Contact not found in CRM", 404);
        }

        const { contact } = response.data;

        return this._sendResponse(res, "Contact deleted from CRM", 200, {
          contact,
        });
      } catch (error) {
        return this._sendError(res, error);
      }
    } else if (data_store === "DATABASE") {
      try {
        const contact = await prisma.contact.delete({
          where: {
            id: parseInt(contact_id),
          },
        });

        return this._sendResponse(res, "Contact deleted from Database", 200, {
          contact,
        });
      } catch (error) {
        return this._sendError(res, error);
      }
    }
  }

  async _createContactInCRM(data: ContactData) {
    return await axios.post(
      `https://${env.FRESHSALES_DOMAIN}/api/contacts`,
      data,
      {
        headers: {
          Authorization: `Token token=${env.FRESHSALES_API_KEY}`,
        },
      }
    );
  }

  async _checkExistingContact(
    data: Pick<ContactData, "email" | "mobile_number">
  ) {
    return await prisma.contact.findFirst({
      where: {
        OR: [
          {
            email: data.email,
          },
          {
            mobile_number: data.mobile_number,
          },
        ],
      },
    });
  }

  async _getContactFromCRM(contact_id: string) {
    return await axios.get(
      `https://${env.FRESHSALES_DOMAIN}/api/contacts/${contact_id}`,
      {
        headers: {
          Authorization: `Token token=${env.FRESHSALES_API_KEY}`,
        },
      }
    );
  }

  async _updateContactInCRM(contact_id: string, data: any) {
    return await axios.put(
      `https://${env.FRESHSALES_DOMAIN}/api/contacts/${contact_id}`,
      data,
      {
        headers: {
          Authorization: `Token token=${env.FRESHSALES_API_KEY}`,
        },
      }
    );
  }

  async _deleteContactFromCRM(contact_id: string) {
    return await axios.delete(
      `https://${env.FRESHSALES_DOMAIN}/api/contacts/${contact_id}`,
      {
        headers: {
          Authorization: `Token token=${env.FRESHSALES_API_KEY}`,
        },
      }
    );
  }
}
