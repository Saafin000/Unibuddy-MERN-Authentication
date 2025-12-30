import { useEffect, useState } from "react";
import axios from "axios";
import "./AdminPanel.css";

export default function AdminPanel() {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    name: "",
    email: "",
    rollNo: "",
    department: "",
    year: "",
    fatherName: "",
    motherName: "",
    contactNumber: "",
    address: "",
    dateOfBirth: "",
    gender: "",
  });
  const [editId, setEditId] = useState(null);

  // Fetch all students from backend
  const fetchStudents = async () => {
    setLoading(true);
    try {
      const res = await axios.get("http://localhost:5000/api/students", {
        withCredentials: true,
      });
      setStudents(res.data);
    } catch (err) {
      console.error("Error fetching students:", err);
      alert(err.response?.data?.message || "Failed to fetch students");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStudents();
  }, []);

  // Add or update student
  const submit = async (e) => {
    e.preventDefault();
    
    // Validation
    if (!form.name || !form.email || !form.rollNo || !form.department || !form.year || !form.fatherName || !form.motherName || !form.contactNumber) {
      alert("Please fill all required fields");
      return;
    }

    // Validate email
    if (!form.email.endsWith('@gdgu.org')) {
      alert("Email must be a valid GDGU email (@gdgu.org)");
      return;
    }

    setLoading(true);
    try {
      if (editId) {
        // Update student
        await axios.put(`http://localhost:5000/api/students/${editId}`, form, {
          withCredentials: true,
        });
        alert("Student updated successfully!");
        setEditId(null);
      } else {
        // Add student
        await axios.post("http://localhost:5000/api/students", form, {
          withCredentials: true,
        });
        alert("Student added successfully!");
      }
      setForm({ 
        name: "", 
        email: "", 
        rollNo: "", 
        department: "", 
        year: "",
        fatherName: "",
        motherName: "",
        contactNumber: "",
        address: "",
        dateOfBirth: "",
        gender: "",
      });
      fetchStudents();
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || "Operation failed");
    } finally {
      setLoading(false);
    }
  };

  // Delete student
  const remove = async (id) => {
    if (!window.confirm("Are you sure you want to delete this student?")) {
      return;
    }
    
    setLoading(true);
    try {
      await axios.delete(`http://localhost:5000/api/students/${id}`, {
        withCredentials: true,
      });
      alert("Student deleted successfully!");
      fetchStudents();
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || "Delete failed");
    } finally {
      setLoading(false);
    }
  };

  // Edit student
  const edit = (student) => {
    setForm({
      name: student.name || "",
      email: student.email || "",
      rollNo: student.rollNo || "",
      department: student.department || "",
      year: student.year || "",
      fatherName: student.fatherName || "",
      motherName: student.motherName || "",
      contactNumber: student.contactNumber || "",
      address: student.address || "",
      dateOfBirth: student.dateOfBirth ? student.dateOfBirth.split('T')[0] : "",
      gender: student.gender || "",
    });
    setEditId(student._id);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Cancel edit
  const cancelEdit = () => {
    setEditId(null);
    setForm({ 
      name: "", 
      email: "", 
      rollNo: "", 
      department: "", 
      year: "",
      fatherName: "",
      motherName: "",
      contactNumber: "",
      address: "",
      dateOfBirth: "",
      gender: "",
    });
  };

  // Logout
  const handleLogout = async () => {
    try {
      await axios.post(
        "http://localhost:5000/api/auth/logout",
        {},
        { withCredentials: true }
      );
      window.location.href = "/login";
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="admin-container">
      <div className="admin-header">
        <h1>Admin Panel 🛠️</h1>
        <button className="btn logout-btn" onClick={handleLogout}>
          Logout
        </button>
      </div>

      <div className="card form-card">
        <h3>{editId ? "Edit Student" : "Add New Student"}</h3>
        <form onSubmit={submit}>
          <div className="form-grid">
            {/* Personal Information */}
            <div className="form-section">
              <h4>Personal Information</h4>
              <input
                type="text"
                placeholder="Full Name *"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                className="form-input"
                required
              />
              <input
                type="email"
                placeholder="Email (@gdgu.org) *"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                className="form-input"
                required
              />
              <input
                type="date"
                placeholder="Date of Birth"
                value={form.dateOfBirth}
                onChange={(e) => setForm({ ...form, dateOfBirth: e.target.value })}
                className="form-input"
              />
              <select
                value={form.gender}
                onChange={(e) => setForm({ ...form, gender: e.target.value })}
                className="form-input"
              >
                <option value="">Select Gender</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>
            </div>

            {/* Academic Information */}
            <div className="form-section">
              <h4>Academic Information</h4>
              <input
                type="text"
                placeholder="Roll Number *"
                value={form.rollNo}
                onChange={(e) => setForm({ ...form, rollNo: e.target.value })}
                className="form-input"
                required
              />
              <input
                type="text"
                placeholder="Department *"
                value={form.department}
                onChange={(e) => setForm({ ...form, department: e.target.value })}
                className="form-input"
                required
              />
              <select
                value={form.year}
                onChange={(e) => setForm({ ...form, year: e.target.value })}
                className="form-input"
                required
              >
                <option value="">Select Year *</option>
                <option value="1">1st Year</option>
                <option value="2">2nd Year</option>
                <option value="3">3rd Year</option>
                <option value="4">4th Year</option>
              </select>
            </div>

            {/* Family & Contact Information */}
            <div className="form-section">
              <h4>Family & Contact Information</h4>
              <input
                type="text"
                placeholder="Father's Name *"
                value={form.fatherName}
                onChange={(e) => setForm({ ...form, fatherName: e.target.value })}
                className="form-input"
                required
              />
              <input
                type="text"
                placeholder="Mother's Name *"
                value={form.motherName}
                onChange={(e) => setForm({ ...form, motherName: e.target.value })}
                className="form-input"
                required
              />
              <input
                type="tel"
                placeholder="Contact Number *"
                value={form.contactNumber}
                onChange={(e) => setForm({ ...form, contactNumber: e.target.value })}
                className="form-input"
                required
              />
              <textarea
                placeholder="Address"
                value={form.address}
                onChange={(e) => setForm({ ...form, address: e.target.value })}
                className="form-input"
                rows="3"
              />
            </div>
          </div>

          <div className="form-actions">
            <button type="submit" className="btn submit-btn" disabled={loading}>
              {loading ? "Processing..." : editId ? "Update Student" : "Add Student"}
            </button>
            {editId && (
              <button type="button" className="btn cancel-btn" onClick={cancelEdit}>
                Cancel
              </button>
            )}
          </div>
        </form>
      </div>

      <div className="table-container">
        <h3>All Students ({students.length})</h3>
        {loading ? (
          <div className="loading">Loading...</div>
        ) : students.length === 0 ? (
          <div className="no-data">No students found. Add your first student above.</div>
        ) : (
          <div className="table-wrapper">
            <table className="student-table">
              <thead>
                <tr>
                  <th>Roll No</th>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Department</th>
                  <th>Year</th>
                  <th>Contact</th>
                  <th>Father's Name</th>
                  <th>Mother's Name</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {students.map((s) => (
                  <tr key={s._id}>
                    <td>{s.rollNo}</td>
                    <td>{s.name}</td>
                    <td>{s.email}</td>
                    <td>{s.department}</td>
                    <td>{s.year}</td>
                    <td>{s.contactNumber}</td>
                    <td>{s.fatherName}</td>
                    <td>{s.motherName}</td>
                    <td>
                      <span className={`status-badge ${s.status?.toLowerCase()}`}>
                        {s.status || 'ACTIVE'}
                      </span>
                    </td>
                    <td className="action-buttons">
                      <button className="btn edit-btn" onClick={() => edit(s)} title="Edit">
                        ✏️
                      </button>
                      <button className="btn delete-btn" onClick={() => remove(s._id)} title="Delete">
                        ❌
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}