// backend/routes/student.route.js
import express from "express";
import { Student } from "../models/student.model.js";
import { verifyToken } from "../middleware/verifyToken.js";
import { User } from "../models/user.model.js";

const router = express.Router();

// Middleware to check if user is admin
const isAdmin = async (req, res, next) => {
  try {
    const user = await User.findById(req.userId);
    if (!user || user.role !== 'ADMIN') {
      return res.status(403).json({ 
        success: false, 
        message: "Access denied. Admin only." 
      });
    }
    next();
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// Get all students (Admin only)
router.get("/", verifyToken, isAdmin, async (req, res) => {
  try {
    const students = await Student.find().sort({ createdAt: -1 });
    res.status(200).json(students);
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      message: error.message 
    });
  }
});

// Add new student (Admin only)
router.post("/", verifyToken, isAdmin, async (req, res) => {
  try {
    const { name, email, rollNo, department, year, contactNumber, fatherName, motherName } = req.body;

    // Validate GDGU email
    if (!email.endsWith('@gdgu.org')) {
      return res.status(400).json({ 
        success: false, 
        message: "Only GDGU email addresses are allowed" 
      });
    }

    // Check if student already exists
    const existingStudent = await Student.findOne({ 
      $or: [{ email }, { rollNo }] 
    });

    if (existingStudent) {
      return res.status(400).json({ 
        success: false, 
        message: "Student with this email or roll number already exists" 
      });
    }

    const student = new Student({
      name,
      email,
      rollNo,
      department,
      year,
      contactNumber,
      fatherName,
      motherName,
    });

    await student.save();

    res.status(201).json({ 
      success: true, 
      message: "Student added successfully",
      student 
    });
  } catch (error) {
    res.status(400).json({ 
      success: false, 
      message: error.message 
    });
  }
});

// Update student (Admin only)
router.put("/:id", verifyToken, isAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    // Validate GDGU email if provided
    if (updateData.email && !updateData.email.endsWith('@gdgu.org')) {
      return res.status(400).json({ 
        success: false, 
        message: "Only GDGU email addresses are allowed" 
      });
    }

    const student = await Student.findByIdAndUpdate(
      id,
      updateData,
      { new: true, runValidators: true }
    );

    if (!student) {
      return res.status(404).json({ 
        success: false, 
        message: "Student not found" 
      });
    }

    res.status(200).json({ 
      success: true, 
      message: "Student updated successfully",
      student 
    });
  } catch (error) {
    res.status(400).json({ 
      success: false, 
      message: error.message 
    });
  }
});

// Delete student (Admin only)
router.delete("/:id", verifyToken, isAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    
    const student = await Student.findByIdAndDelete(id);

    if (!student) {
      return res.status(404).json({ 
        success: false, 
        message: "Student not found" 
      });
    }

    res.status(200).json({ 
      success: true, 
      message: "Student deleted successfully" 
    });
  } catch (error) {
    res.status(400).json({ 
      success: false, 
      message: error.message 
    });
  }
});

export default router;