import { useEffect, useState } from "react";
import axios from "axios";

export default function AdminPanel() {
  const [students, setStudents] = useState([]);
  const [form, setForm] = useState({
    name: "",
    email: "",
    rollNo: "",
    department: "",
    year: "",
  });
  const [editId, setEditId] = useState(null); // for editing

  // Fetch all students from backend
  const fetchStudents = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/students", {
        withCredentials: true,
      });
      setStudents(res.data);
    } catch (err) {
      console.error("Error fetching students:", err);
      alert(err.response?.data?.message || "Failed to fetch students");
    }
  };

  useEffect(() => {
    fetchStudents();
  }, []);

  // Add or update student
  const submit = async () => {
    try {
      if (editId) {
        // Update student
        await axios.put(`http://localhost:5000/api/students/${editId}`, form, {
          withCredentials: true,
        });
        setEditId(null);
      } else {
        // Add student
        await axios.post("http://localhost:5000/api/students", form, {
          withCredentials: true,
        });
      }
      setForm({ name: "", email: "", rollNo: "", department: "", year: "" });
      fetchStudents();
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || "Operation failed");
    }
  };

  // Delete student
  const remove = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/api/students/${id}`, {
        withCredentials: true,
      });
      fetchStudents();
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || "Delete failed");
    }
  };

  // Edit student
  const edit = (student) => {
    setForm({
      name: student.name,
      email: student.email,
      rollNo: student.rollNo,
      department: student.department,
      year: student.year,
    });
    setEditId(student._id);
    window.scrollTo({ top: 0, behavior: "smooth" }); // scroll to top for editing
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
        <h3>{editId ? "Edit Student" : "Add Student"}</h3>
        <div className="form-group">
          {Object.keys(form).map((key) => (
            <input
              key={key}
              placeholder={key}
              value={form[key]}
              onChange={(e) => setForm({ ...form, [key]: e.target.value })}
              className="form-input"
            />
          ))}
        </div>
        <button className="btn submit-btn" onClick={submit}>
          {editId ? "Update Student" : "Add Student"}
        </button>
      </div>

      <table className="student-table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Email</th>
            <th>Roll</th>
            <th>Dept</th>
            <th>Year</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {students.map((s) => (
            <tr key={s._id}>
              <td>{s.name}</td>
              <td>{s.email}</td>
              <td>{s.rollNo}</td>
              <td>{s.department}</td>
              <td>{s.year}</td>
              <td>
                <button className="btn edit-btn" onClick={() => edit(s)}>
                  ✏️
                </button>{" "}
                <button className="btn delete-btn" onClick={() => remove(s._id)}>
                  ❌
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Embedded CSS */}
      <style>{`
        .admin-container {
          padding: 40px;
          font-family: 'Poppins', sans-serif;
          background: #f4f7fa;
          min-height: 100vh;
        }
        .admin-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 30px;
        }
        .logout-btn {
          background: #ff5f5f;
          color: #fff;
          border: none;
          padding: 10px 20px;
          border-radius: 8px;
          cursor: pointer;
          transition: 0.3s;
        }
        .logout-btn:hover {
          background: #ff2f2f;
          transform: scale(1.05);
        }
        .card.form-card {
          background: #fff;
          padding: 30px;
          border-radius: 15px;
          box-shadow: 0 10px 30px rgba(0,0,0,0.1);
          margin-bottom: 40px;
          transition: transform 0.3s ease, box-shadow 0.3s ease;
        }
        .card.form-card:hover {
          transform: translateY(-5px);
          box-shadow: 0 15px 40px rgba(0,0,0,0.15);
        }
        .form-group {
          display: flex;
          flex-wrap: wrap;
          gap: 15px;
          margin-bottom: 20px;
        }
        .form-input {
          flex: 1 1 180px;
          padding: 10px;
          border-radius: 8px;
          border: 1px solid #ccc;
          transition: 0.3s;
        }
        .form-input:focus {
          border-color: #667eea;
          outline: none;
          box-shadow: 0 0 8px rgba(102,126,234,0.3);
        }
        .btn {
          cursor: pointer;
          border: none;
          border-radius: 10px;
          padding: 10px 20px;
          font-weight: 500;
          transition: 0.3s;
        }
        .submit-btn {
          background: linear-gradient(135deg, #667eea, #764ba2);
          color: #fff;
        }
        .submit-btn:hover {
          transform: scale(1.05);
          box-shadow: 0 8px 20px rgba(102,126,234,0.4);
        }
        .edit-btn {
          background: #fbbf24;
          color: #fff;
          padding: 5px 10px;
          margin-right: 5px;
        }
        .edit-btn:hover {
          background: #f59e0b;
          transform: scale(1.1);
        }
        .delete-btn {
          background: #ff5f5f;
          color: #fff;
          padding: 5px 10px;
        }
        .delete-btn:hover {
          background: #ff2f2f;
          transform: scale(1.1);
        }
        .student-table {
          width: 100%;
          border-collapse: collapse;
          background: #fff;
          border-radius: 10px;
          overflow: hidden;
          box-shadow: 0 10px 20px rgba(0,0,0,0.05);
        }
        .student-table th,
        .student-table td {
          padding: 12px 15px;
          text-align: left;
        }
        .student-table th {
          background: #667eea;
          color: #fff;
        }
        .student-table tbody tr:nth-child(even) {
          background: #f9f9f9;
        }
        .student-table tbody tr:hover {
          background: #e0e7ff;
          transition: 0.3s;
        }
      `}</style>
    </div>
  );
}
