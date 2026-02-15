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
      revenueData,
      downloadsData
    ] = await Promise.all([
      User.countDocuments(),
      Class.countDocuments(),
      Subject.countDocuments(),
      Material.countDocuments(),
      Order.countDocuments(),

      Order.aggregate([
        { $match: { paymentStatus: "Paid" } },
        { $group: { _id: null, total: { $sum: "$amount" } } }
      ]),

      Material.aggregate([
        { $group: { _id: null, total: { $sum: "$downloads" } } }
      ])
    ]);

    const totalRevenue = revenueData[0]?.total || 0;
    const totalDownloads = downloadsData[0]?.total || 0;

    logger.info("Admin stats fetched");

    res.json({
      success: true,
      totalUsers,
      totalClasses,
      totalSubjects,
      totalMaterials,
      totalOrders,
      totalRevenue,
      totalDownloads
    });

  } catch (error) {
    logger.error(`Admin stats error: ${error.message}`);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

/* 👥 GET ALL USERS */
export const getAllUsers = async (req, res) => {
  try {
    const page = Math.max(1, Number(req.query.page) || 1);
    const limit = Math.max(1, Number(req.query.limit) || 20);
    const skip = (page - 1) * limit;

    const [users, total] = await Promise.all([
      User.find()
        .select("-password")
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean(),
      User.countDocuments()
    ]);

    logger.info("Admin fetched users list");

    res.json({
      success: true,
      data: users,
      pagination: {
        total,
        page,
        pages: Math.ceil(total / limit)
      }
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

/* 📦 ALL ORDERS */
export const getAllOrders = async (req, res) => {
  try {
    const page = Math.max(1, Number(req.query.page) || 1);
    const limit = Math.max(1, Number(req.query.limit) || 20);
    const skip = (page - 1) * limit;

    const [orders, total] = await Promise.all([
      Order.find()
        .populate("user", "name phone")
        .populate("materials", "title price")
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean(),
      Order.countDocuments()
    ]);

    logger.info("Admin fetched orders list");

    res.json({
      success: true,
      data: orders,
      pagination: {
        total,
        page,
        pages: Math.ceil(total / limit)
      }
    });

  } catch (error) {
    logger.error(`Get orders error: ${error.message}`);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

/* 📄 ALL MATERIALS */
export const getAllMaterials = async (req, res) => {
  try {
    const page = Math.max(1, Number(req.query.page) || 1);
    const limit = Math.max(1, Number(req.query.limit) || 20);
    const skip = (page - 1) * limit;

    const [materials, total] = await Promise.all([
      Material.find()
        .populate("classId", "name")
        .populate("subjectId", "name")
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean(),
      Material.countDocuments()
    ]);

    logger.info("Admin fetched materials list");

    res.json({
      success: true,
      data: materials,
      pagination: {
        total,
        page,
        pages: Math.ceil(total / limit)
      }
    });

  } catch (error) {
    logger.error(`Get materials error: ${error.message}`);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};
