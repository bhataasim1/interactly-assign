import express, { Router } from "express";
import { FreshSalesController } from "../controller/freshSales.controller";

const freshSaleRouter: Router = express.Router();
const freshSalesController = new FreshSalesController();

freshSaleRouter.post("/createContact", freshSalesController.createContact);
freshSaleRouter.get(
  "/getContact/:contact_id/:data_store",
  freshSalesController.getContact
);
freshSaleRouter.post(
  "/updateContact/:contact_id",
  freshSalesController.updateContact
);
freshSaleRouter.post("/deleteContact/:contact_id/:data_store", freshSalesController.deleteContact);

export default freshSaleRouter;
