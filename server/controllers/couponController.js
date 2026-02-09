import Coupon from "../models/Coupon.js";
import logger from "../utils/logger.js";

/* ➕ CREATE COUPON (Admin) */
export const createCoupon = async (req, res) => {
  try {
    let { code, discountPercent, expiryDate } = req.body;

    if (!code || !discountPercent || !expiryDate) {
      return res.status(400).json({ message: "All fields required" });
    }

    code = code.trim().toUpperCase();

    if (discountPercent <= 0 || discountPercent > 80) {
      return res.status(400).json({ message: "Discount must be between 1-80%" });
    }

    const exists = await Coupon.findOne({ code });
    if (exists) return res.status(400).json({ message: "Coupon already exists" });

    const coupon = await Coupon.create({
      code,
      discountPercent,
      expiryDate
    });

    logger.info(`Coupon created: ${code}`);

    res.status(201).json(coupon);
  } catch (error) {
    logger.error(`Create coupon error: ${error.message}`);
    res.status(500).json({ message: "Server Error" });
  }
};


/* 📃 GET ALL COUPONS (Admin) */
export const getCoupons = async (req, res) => {
  try {
    const coupons = await Coupon.find().sort({ createdAt: -1 });
    res.json(coupons);
  } catch (error) {
    logger.error(`Get coupons error: ${error.message}`);
    res.status(500).json({ message: "Server Error" });
  }
};


/* ❌ DELETE COUPON */
export const deleteCoupon = async (req, res) => {
  try {
    const deleted = await Coupon.findByIdAndDelete(req.params.id);

    if (!deleted) return res.status(404).json({ message: "Coupon not found" });

    logger.warn(`Coupon deleted: ${deleted.code}`);

    res.json({ message: "Coupon deleted" });
  } catch (error) {
    logger.error(`Delete coupon error: ${error.message}`);
    res.status(500).json({ message: "Server Error" });
  }
};


/* 🎟 APPLY COUPON (User checkout) */
export const applyCoupon = async (req, res) => {
  try {
    const { code, cartTotal } = req.body;

    if (!code || !cartTotal || cartTotal <= 0) {
      return res.status(400).json({ message: "Invalid data" });
    }

    const coupon = await Coupon.findOne({ code: code.toUpperCase() });
    if (!coupon) return res.status(404).json({ message: "Invalid coupon" });

    if (coupon.expiryDate < new Date())
      return res.status(400).json({ message: "Coupon expired" });

    const discountAmount = (cartTotal * coupon.discountPercent) / 100;
    const finalAmount = Math.max(cartTotal - discountAmount, 1); // never 0

    res.json({
      discountPercent: coupon.discountPercent,
      discountAmount,
      finalAmount
    });
  } catch (error) {
    logger.error(`Apply coupon error: ${error.message}`);
    res.status(500).json({ message: "Server Error" });
  }
};
