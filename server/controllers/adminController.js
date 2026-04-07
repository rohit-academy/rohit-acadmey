import mongoose from "mongoose";
import User from "../models/User.js";
import Class from "../models/Class.js";
import Subject from "../models/Subject.js";
import Material from "../models/Material.js";
import Order from "../models/Order.js";
import logger from "../utils/logger.js";
import generateToken from "../utils/generateToken.js";

/* =====================================
   🔐 ADMIN LOGIN (FINAL SECURE)
===================================== */
export const adminLogin = async (req, res) => {
  try {

    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Email & password required"
      });
    }

    const admin = await User.findOne({
      email: email.toLowerCase().trim(),
      role: "admin"
    }).select("+password");

    if (!admin) {
      return res.status(401).json({
        success: false,
        message: "Admin not found"
      });
    }

    if (admin.isBlocked) {
      return res.status(403).json({
        success: false,
        message: "Account blocked"
      });
    }

    /* 🔒 SAFE LOCK CHECK */
    if (typeof admin.isLocked === "function" && admin.isLocked()) {
      return res.status(403).json({
        success: false,
        message: "Too many attempts. Try later"
      });
    }

    /* 🔐 PASSWORD SAFETY */
    if (!admin.comparePassword) {
      return res.status(500).json({
        success: false,
        message: "Password method missing"
      });
    }

    const isMatch = await admin.comparePassword(password);

    if (!isMatch) {

      if (admin.incrementLoginAttempts) {
        await admin.incrementLoginAttempts();
      }

      return res.status(401).json({
        success: false,
        message: "Invalid credentials"
      });
    }

    /* ✅ SUCCESS */
    if (admin.updateLoginTime) {
      await admin.updateLoginTime();
    }

    logger.info(`🟢 Admin login: ${admin.email}`);

    const token = generateToken({
      id: admin._id,
      role: "admin"
    });

    return res.json({
      success: true,
      token,
      role: "admin",
      user: {
        _id: admin._id,
        email: admin.email,
        role: admin.role
      }
    });

  } catch (error) {
    logger.error(`❌ Admin login error: ${error.message}`);

    return res.status(500).json({
      success: false,
      message: "Admin login failed"
    });
  }
};


/* =====================================
   📊 DASHBOARD STATS (SAFE)
===================================== */
export const getAdminStats = async (req, res) => {
  try {

    const [
      totalUsers,
      totalClasses,
      totalSubjects,
      totalMaterials,
      totalOrders,
      revenue,
      downloads
    ] = await Promise.all([

      User.countDocuments({ isBlocked: false }),
      Class.countDocuments({ isActive: true }),
      Subject.countDocuments({ isActive: true }),
      Material.countDocuments({ isActive: true }),
      Order.countDocuments(),

      Order.aggregate([
        { $match: { status: "paid" } },
        { $group: { _id: null, total: { $sum: "$amount" } } }
      ]),

      Material.aggregate([
        { $group: { _id: null, total: { $sum: "$downloads" } } }
      ])
    ]);

    const totalRevenue = revenue.length ? revenue[0].total : 0;
    const totalDownloads = downloads.length ? downloads[0].total : 0;

    res.json({
      success: true,
      data: {
        totalUsers,
        totalClasses,
        totalSubjects,
        totalMaterials,
        totalOrders,
        totalRevenue,
        totalDownloads
      }
    });

  } catch (error) {
    logger.error(`❌ Admin stats error: ${error.message}`);

    res.status(500).json({
      success: false,
      message: "Server Error"
    });
  }
};


/* =====================================
   👥 GET USERS (SAFE PAGINATION)
===================================== */
export const getAllUsers = async (req, res) => {
  try {

    const page = Math.max(1, Number(req.query.page) || 1);
    const limit = Math.min(50, Number(req.query.limit) || 20);
    const skip = (page - 1) * limit;

    const [users, total] = await Promise.all([
      User.find()
        .select("-password -__v")
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean(),

      User.countDocuments()
    ]);

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
    logger.error(`❌ Get users error: ${error.message}`);

    res.status(500).json({
      success: false,
      message: "Server Error"
    });
  }
};


/* =====================================
   🔁 BLOCK / UNBLOCK USER
===================================== */
export const toggleUserBlock = async (req, res) => {
  try {

    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid user ID"
      });
    }

    if (req.user?._id?.toString() === id) {
      return res.status(400).json({
        success: false,
        message: "You cannot modify yourself"
      });
    }

    const user = await User.findById(id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found"
      });
    }

    user.isBlocked = !user.isBlocked;
    await user.save();

    res.json({
      success: true,
      message: `User ${user.isBlocked ? "blocked" : "unblocked"}`
    });

  } catch (error) {
    logger.error(`❌ Toggle user error: ${error.message}`);

    res.status(500).json({
      success: false,
      message: "Server Error"
    });
  }
};


/* =====================================
   ❌ DELETE USER (SOFT)
===================================== */
export const deleteUser = async (req, res) => {
  try {

    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid user ID"
      });
    }

    if (req.user?._id?.toString() === id) {
      return res.status(400).json({
        success: false,
        message: "Cannot delete yourself"
      });
    }

    await User.findByIdAndUpdate(id, {
      isBlocked: true
    });

    res.json({
      success: true,
      message: "User deactivated"
    });

  } catch (error) {
    logger.error(`❌ Delete user error: ${error.message}`);

    res.status(500).json({
      success: false,
      message: "Server Error"
    });
  }
};


/* =====================================
   📄 GET MATERIALS
===================================== */
export const getAllMaterials = async (req, res) => {
  try {

    const page = Math.max(1, Number(req.query.page) || 1);
    const limit = 20;
    const skip = (page - 1) * limit;

    const [materials, total] = await Promise.all([
      Material.find()
        .populate("classId", "name")
        .populate("subjectId", "name")
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit),

      Material.countDocuments()
    ]);

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
    logger.error(`❌ Get materials error: ${error.message}`);

    res.status(500).json({
      success: false,
      message: "Failed to fetch materials"
    });
  }
};


/* =====================================
   📦 GET ALL ORDERS (PAGINATED)
===================================== */
export const getAllOrders = async (req, res) => {
  try {

    const page = Math.max(1, Number(req.query.page) || 1);
    const limit = Math.min(50, Number(req.query.limit) || 20);
    const skip = (page - 1) * limit;

    const [orders, total] = await Promise.all([
      Order.find()
        .populate("user", "name phone email")
        .populate("materials", "title price")
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit),

      Order.countDocuments()
    ]);

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
    logger.error(`❌ Get orders error: ${error.message}`);

    res.status(500).json({
      success: false,
      message: "Failed to fetch orders"
    });
  }
};