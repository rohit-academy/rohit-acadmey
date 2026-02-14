import mongoose from "mongoose";
import User from "../models/User.js";
import Class from "../models/Class.js";
import Subject from "../models/Subject.js";
import Material from "../models/Material.js";
import Order from "../models/Order.js";
import logger from "../utils/logger.js";

/* 📊 DASHBOARD STATS */
export const getAdminStats = async (req, res) => {
  try {
    const [
      totalUsers,
      totalClasses,
      totalSubjects,
      totalMaterials,
      totalOrders,
    ] = await Promise.all([
      User.countDocuments(),
      Class.countDocuments(),
      Subject.countDocuments(),
      Material.countDocuments(),
      Order.countDocuments(),
    ]);

    const totalRevenueData = await Order.aggregate([
      { $match: { paymentStatus: "Paid" } },
      { $group: { _id: null, total: { $sum: "$amount" } } },
    ]);

    const totalRevenue = totalRevenueData[0]?.total || 0;

    logger.info("Admin stats fetched");

    res.json({
      success: true,
      data: {
        totalUsers,
        totalClasses,
        totalSubjects,
        totalMaterials,
        totalOrders,
        totalRevenue,
      },
    });
  } catch (error) {
    logger.error(`Admin stats error: ${error.message}`);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

/* 👥 GET ALL USERS (with pagination) */
export const getAllUsers = async (req, res) => {
  try {
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;

    const users = await User.find()
      .select("-password")
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit);

    const total = await User.countDocuments();

    logger.info("Admin fetched users list");

    res.json({
      success: true,
      data: users,
      pagination: {
        total,
        page,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    logger.error(`Get users error: ${error.message}`);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

/* 🚫 BLOCK USER */
export const blockUser = async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id))
      return res.status(400).json({ success: false, message: "Invalid user ID" });

    await User.findByIdAndUpdate(req.params.id, { isBlocked: true });

    logger.warn(`User blocked: ${req.params.id}`);

    res.json({ success: true, message: "User blocked" });
  } catch (error) {
    logger.error(`Block user error: ${error.message}`);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

/* ✅ UNBLOCK USER */
export const unblockUser = async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id))
      return res.status(400).json({ success: false, message: "Invalid user ID" });

    await User.findByIdAndUpdate(req.params.id, { isBlocked: false });

    logger.warn(`User unblocked: ${req.params.id}`);

    res.json({ success: true, message: "User unblocked" });
  } catch (error) {
    logger.error(`Unblock user error: ${error.message}`);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

/* ❌ DELETE USER */
export const deleteUser = async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id))
      return res.status(400).json({ success: false, message: "Invalid user ID" });

    await User.findByIdAndDelete(req.params.id);

    logger.warn(`User deleted: ${req.params.id}`);

    res.json({ success: true, message: "User removed" });
  } catch (error) {
    logger.error(`Delete user error: ${error.message}`);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

/* 📦 ALL ORDERS (with pagination) */
export const getAllOrders = async (req, res) => {
  try {
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;

    const orders = await Order.find()
      .populate("user", "name phone")
      .populate("materials", "title price")
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit);

    const total = await Order.countDocuments();

    logger.info("Admin fetched orders list");

    res.json({
      success: true,
      data: orders,
      pagination: {
        total,
        page,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    logger.error(`Get orders error: ${error.message}`);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

/* 📄 ALL MATERIALS (with pagination) */
export const getAllMaterials = async (req, res) => {
  try {
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;

    const materials = await Material.find()
      .populate("class", "name")
      .populate("subject", "name")
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit);

    const total = await Material.countDocuments();

    logger.info("Admin fetched materials list");

    res.json({
      success: true,
      data: materials,
      pagination: {
        total,
        page,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    logger.error(`Get materials error: ${error.message}`);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};
