import express from "express";
import createHttpError from "http-errors";
import { Op } from "sequelize";
import ProductModel from "./model.js";

const ProductRouter = express.Router();

ProductRouter.get("/", async (req, res, next) => {
  try {
    const query = {};
    if (req.query.name) {
      query.name = {
        [Op.like]: `%${req.query.name}%`,
      };
    }
    const products = await ProductModel.findAll({ where: query });
    res.send(products);
  } catch (error) {
    next(error);
  }
});

ProductRouter.get("/:id", async (req, res, next) => {
  try {
    const product = await ProductModel.findByPk(req.params.id);
    if (!product) {
      next(createHttpError(404, "Product not found"));
    } else {
      res.send(product);
    }
  } catch (error) {
    next(error);
  }
});

ProductRouter.post("/", async (req, res, next) => {
  try {
    const { id } = await ProductModel.create(req.body);
    res.status(201).send({ id });
  } catch (error) {
    next(error);
  }
});

ProductRouter.put("/:id", async (req, res, next) => {
  try {
    const [updatedRows, updatedRecords] = await ProductModel.update(req.body, {
      where: { id: req.params.id },
      returning: true,
    });
    if (updatedRows > 0) {
      res.send(updatedRecords[0]);
    } else {
      next(createHttpError(404, "Product not found"));
    }
  } catch (error) {
    next(error);
  }
});

ProductRouter.delete("/:id", async (req, res, next) => {
  try {
    const rows = await ProductModel.destroy({ where: { id: req.params.id } });
    if (rows > 0) {
      res.status(204).send();
    } else {
      next(createHttpError(404, "Product not found"));
    }
  } catch (error) {
    next(error);
  }
});

export default ProductRouter;
