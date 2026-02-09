import User from "../models/User.js";
import Class from "../models/Class.js";
import Subject from "../models/Subject.js";
import Material from "../models/Material.js";
import Order from "../models/Order.js";
import logger from "../utils/logger.js"; // ⭐ ADD THIS

/* 📊 DASHBOARD STATS */
export const getAdminStats = async (req, res) => {
  try {
    const [
      totalUsers,
      totalClasses,
      totalSubjects,
      totalMaterials,
      totalOrders
    ] = await Promise.all([
      User.countDocuments(),
      Class.countDocuments(),
      Subject.countDocuments(),
      Material.countDocuments(),
      Order.countDocuments()
    ]);

    const totalRevenueData = await Order.aggregate([
      { $match: { paymentStatus: "Paid" } },
      { $group: { _id: null, total: { $sum: "$amount" } } }
    ]);

    const totalRevenue = totalRevenueData[0]?.total || 0;

    logger.info("Admin stats fetched");

    res.json({
      totalUsers,
      totalClasses,
      totalSubjects,
      totalMaterials,
      totalOrders,
      totalRevenue
    });
  } catch (error) {
    logger.error(`Admin stats error: ${error.message}`);
    res.status(500).json({ message: "Server Error" });
  }
};

/* 👥 GET ALL USERS */
export const getAllUsers = async (req, res) => {
  try {
    const users = await User.find()
      .select("-password")
      .sort({ createdAt: -1 });

    logger.info("Admin fetched users list");
    res.json(users);
  } catch (error) {
    logger.error(`Get users error: ${error.message}`);
    res.status(500).json({ message: "Server Error" });
  }
};

/* 🚫 BLOCK USER */
export const blockUser = async (req, res) => {
  try {
    await User.findByIdAndUpdate(req.params.id, { isBlocked: true });
    logger.warn(`User blocked: ${req.params.id}`);
    res.json({ success: true, message: "User blocked" });
  } catch (error) {
    logger.error(`Block user error: ${error.message}`);
    res.status(500).json({ message: "Server Error" });
  }
};

/* ✅ UNBLOCK USER */
export const unblockUser = async (req, res) => {
  try {
    await User.findByIdAndUpdate(req.params.id, { isBlocked: false });
    logger.warn(`User unblocked: ${req.params.id}`);
    res.json({ success: true, message: "User unblocked" });
  } catch (error) {
    logger.error(`Unblock user error: ${error.message}`);
    res.status(500).json({ message: "Server Error" });
  }
};

/* ❌ DELETE USER */
export const deleteUser = async (req, res) => {
  try {
    await User.findByIdAndDelete(req.params.id);
    logger.warn(`User deleted: ${req.params.id}`);
    res.json({ message: "User removed" });
  } catch (error) {
    logger.error(`Delete user error: ${error.message}`);
    res.status(500).json({ message: "Server Error" });
  }
};

/* 📦 ALL ORDERS */
export const getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find()
      .populate("user", "name phone")
      .populate("materials", "title price")
      .sort({ createdAt: -1 });

    logger.info("Admin fetched orders list");
    res.json(orders);
  } catch (error) {
    logger.error(`Get orders error: ${error.message}`);
    res.status(500).json({ message: "Server Error" });
  }
};

/* 📄 ALL MATERIALS */
export const getAllMaterials = async (req, res) => {
  try {
    const materials = await Material.find()
      .populate("class", "name")
      .populate("subject", "name")
      .sort({ createdAt: -1 });

    logger.info("Admin fetched materials list");
    res.json(materials);
  } catch (error) {
    logger.error(`Get materials error: ${error.message}`);
    res.status(500).json({ message: "Server Error" });
  }
};
