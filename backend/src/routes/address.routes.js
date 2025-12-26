import express from "express";
import {
  addAddress,
  getAddresses,
  updateAddress,
  deleteAddress,
  setDefaultAddress,
} from "../controllers/address.controller.js";
import { protect } from "../middleware/auth.middleware.js";
import { validateAddress } from "../middleware/address.middleware.js";

const router = express.Router();

router.post("/", protect, validateAddress, addAddress);
router.get("/", protect, getAddresses);
router.put("/:addressId", protect, validateAddress, updateAddress);
router.delete("/:addressId", protect, deleteAddress);
router.put("/:addressId/default", protect, setDefaultAddress);

export default router;
