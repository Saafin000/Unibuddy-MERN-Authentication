// backend/models/student.model.js
import mongoose from "mongoose";

const studentSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      validate: {
        validator: function(v) {
          return v.endsWith('@gdgu.org');
        },
        message: 'Email must be a valid GDGU email (@gdgu.org)'
      }
    },
    rollNo: {
      type: String,
      required: true,
      unique: true,
    },
    department: {
      type: String,
      required: true,
    },
    year: {
      type: String,
      required: true,
      enum: ['1', '2', '3', '4'],
    },
    contactNumber: {
      type: String,
      required: true,
    },
    fatherName: {
      type: String,
      required: true,
    },
    motherName: {
      type: String,
      required: true,
    },
    photo: {
      type: String,
    },
    collegeIdCard: {
      type: String,
    },
    status: {
      type: String,
      enum: ['ACTIVE', 'INACTIVE', 'SUSPENDED'],
      default: 'ACTIVE',
    },
  },
  { timestamps: true }
);

export const Student = mongoose.model("Student", studentSchema);