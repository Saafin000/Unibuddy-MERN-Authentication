import { User } from "../models/user.model.js";
import bcrypt from "bcryptjs";

/* ============================
   GET ALL USERS (ADMIN)
============================ */
export const getAllUsers = async (req, res) => {
  try {
    const users = await User.find()
      .select("-password -verificationToken -resetPasswordToken")
      .sort({ createdAt: -1 });

    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

/* ============================
   CREATE USER (ADMIN)
============================ */
export const createUser = async (req, res) => {
  try {
    const {
      name,
      email,
      password,
      rollNumber,
      department,
      year,
      gender,
      dateOfBirth,
      fatherName,
      motherName,
      contactNumber,
      address,
      photo,
      collegeIdCard,
      role = "STUDENT",
    } = req.body;

    // Basic validation
    if (!name || !email || !password || !rollNumber) {
      return res.status(400).json({
        success: false,
        message: "Required fields missing",
      });
    }

    if (!email.endsWith("@gdgu.org")) {
      return res.status(400).json({
        success: false,
        message: "Only GDGU email allowed",
      });
    }

    const existingUser = await User.findOne({
      $or: [{ email }, { rollNumber }],
    });

    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "User with email or roll number already exists",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      rollNumber,
      department,
      year,
      gender,
      dateOfBirth,
      fatherName,
      motherName,
      contactNumber,
      address,
      photo,
      collegeIdCard,
      role,
      isVerified: true, // Admin-created users
    });

    const responseUser = user.toObject();
    delete responseUser.password;

    res.status(201).json({
      success: true,
      user: responseUser,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/* ============================
   UPDATE USER (ADMIN)
============================ */
export const updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = { ...req.body };

    if (updateData.password?.trim()) {
      updateData.password = await bcrypt.hash(updateData.password, 10);
    } else {
      delete updateData.password;
    }

    const user = await User.findByIdAndUpdate(id, updateData, {
      new: true,
      runValidators: true,
    }).select("-password -verificationToken -resetPasswordToken");

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    res.json({ success: true, user });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/* ============================
   DELETE USER (ADMIN)
============================ */
export const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;

    const user = await User.findByIdAndDelete(id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    res.json({
      success: true,
      message: "User deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
