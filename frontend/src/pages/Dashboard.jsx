import React, { useState, useEffect, useContext } from 'react';
import AuthContext from '../context/AuthContext'; // Assuming you store auth info in this context
import axios from 'axios';

const Dashboard = () => {
  const { logout, user } = useContext(AuthContext); // Get the logged-in user data
  console.log(user.username);
  const [employees, setEmployees] = useState([]);
  const [filteredEmployees, setFilteredEmployees] = useState([]);
  const [id,setId] = useState(2343);
  const [employee, setEmployee] = useState({
    name: '',
    email: '',
    mobile: '',
    designation: 'designation', // Default value
    gender: '', // Default value
    course: [], // Checkboxes array
  });
  const [image, setImage] = useState(null);
  const [search, setSearch] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [editEmployeeId, setEditEmployeeId] = useState(null);

  useEffect(() => {
    loadEmployees();
  }, []);

  const loadEmployees = async () => {
    try {
      const { data } = await axios.get('http://localhost:5000/api/employees');
      setEmployees(data.employees);
      setFilteredEmployees(data.employees);
    } catch (err) {
      console.error(err);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    Object.keys(employee).forEach((key) => {
      if (key === 'course') {
        formData.append(key, JSON.stringify(employee[key])); // Handle array data
      } else {
        formData.append(key, employee[key]);
      }
    });
    if (image) formData.append('image', image);

    try {
      if (isEditing) {
        // Update the employee
        await axios.put(`http://localhost:5000/api/employees/${editEmployeeId}`, formData);
      } else {
        // Add a new employee
        await axios.post('http://localhost:5000/api/employees', formData);
      }
      loadEmployees();
      clearForm();
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/api/employees/${id}`);
      loadEmployees();
    } catch (err) {
      console.error(err);
    }
  };

  const handleEdit = (emp) => {
    setEmployee({
      name: emp.name,
      email: emp.email,
      mobile: emp.mobile,
      designation: emp.designation,
      gender: emp.gender,
      course: emp.course,
    });
    setEditEmployeeId(emp._id);
    setId(emp._id);
    setIsEditing(true); // Set editing mode
  };

  const handleSearch = (e) => {
    const searchValue = e.target.value.toLowerCase();
    setSearch(searchValue);
    setFilteredEmployees(
      employees.filter((emp) =>
        emp.name.toLowerCase().includes(searchValue) ||
        emp.email.toLowerCase().includes(searchValue) ||
        emp.mobile.includes(searchValue) ||
        emp.designation.toLowerCase().includes(searchValue) ||
        emp.gender.toLowerCase().includes(searchValue) ||
        emp.course.toLowerCase().includes(searchValue)
      )
    );
  };

  const clearForm = () => {
    setEmployee({
      name: '',
      email: '',
      mobile: '',
      designation: 'hr', // Reset to default value
      gender: '', // Reset to default value
      course: [], // Reset checkboxes
    });
    setImage(null);
    setIsEditing(false);
    setEditEmployeeId(null);
  };

  const handleCourseChange = (e) => {
    const { value, checked } = e.target;
    if (checked) {
      setEmployee({ ...employee, course: [...employee.course, value] });
    } else {
      setEmployee({ ...employee, course: employee.course.filter((c) => c !== value) });
    }
  };

  return (
    <div className="p-8 bg-gray-100 min-h-screen">
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-3xl font-bold">Welcome To Admin Panel</h2>
        <div className="flex items-center space-x-4">
           {user && <span className="text-xl font-semibold">{user.userName} </span>}
          <button onClick={logout} className="bg-red-500 text-white py-2 px-4 rounded hover:bg-red-600">
            Logout
          </button>
        </div>
      </div>

      <h3 className="text-xl font-bold mb-4">{isEditing ? 'Update Employee' : 'Create Employee'}</h3>
      <form onSubmit={handleSubmit} className="bg-white p-6 rounded shadow-md space-y-4">
        <label > Name : </label>
        <input
          className="w-full p-2 border border-gray-300 rounded"
          type="text"
          value={employee.name}
          onChange={(e) => setEmployee({ ...employee, name: e.target.value })}
          placeholder="enter name"
          required
        />
        <label > Email : </label>
        <input
          className="w-full p-2 border border-gray-300 rounded"
          type="email"
          value={employee.email}
          onChange={(e) => setEmployee({ ...employee, email: e.target.value })}
          placeholder="enter email"
          required
        />
        <label > Mobile no. : </label>
        <input
          className="w-full p-2 border border-gray-300 rounded"
          type="number"
          maxLength="10"
          value={employee.mobile}
          onChange={(e) => setEmployee({ ...employee, mobile: e.target.value })}
          placeholder="Enter mobile no"
          required
        />

        {/* Dropdown for Designation */}
        <label >Designation :</label>
        <select
          className="w-full p-2 border border-gray-300 rounded"
          value={employee.designation}
          onChange={(e) => setEmployee({ ...employee, designation: e.target.value })}
        >
          <option value="hr">HR</option>
          <option value="manager">Manager</option>
          <option value="sale">Sale</option>
        </select>

        {/* Radio buttons for Gender */}
        <div className="space-x-4">
          
        <label > Gender : </label>
          <label className="inline-flex items-center">
            <input
              type="radio"
              name="gender"
              value="male"
              checked={employee.gender === 'male'}
              onChange={(e) => setEmployee({ ...employee, gender: e.target.value })}
              className="form-radio"
            />
            <span className="ml-2">Male</span>
          </label>
          <label className="inline-flex items-center">
            <input
              type="radio"
              name="gender"
              value="female"
              checked={employee.gender === 'female'}
              onChange={(e) => setEmployee({ ...employee, gender: e.target.value })}
              className="form-radio"
            />
            <span className="ml-2">Female</span>
          </label>
        </div>

        {/* Checkboxes for Course */}
        <div className="space-x-4">
        <label > Course : </label>
          <label className="inline-flex items-center">
            <input
              type="checkbox"
              value="btech"
              checked={employee.course.includes('btech')}
              onChange={handleCourseChange}
              className="form-checkbox"
            />
            <span className="ml-2">B.Tech</span>
          </label>
          <label className="inline-flex items-center">
            <input
              type="checkbox"
              value="bca"
              checked={employee.course.includes('bca')}
              onChange={handleCourseChange}
              className="form-checkbox"
            />
            <span className="ml-2">BCA</span>
          </label>
          <label className="inline-flex items-center">
            <input
              type="checkbox"
              value="mca"
              checked={employee.course.includes('mca')}
              onChange={handleCourseChange}
              className="form-checkbox"
            />
            <span className="ml-2">MCA</span>
          </label>
        </div>

        <input
          type="file"
          onChange={(e) => setImage(e.target.files[0])}
          accept=".jpg,.jpeg"
        />
        <button type="submit" className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600">
          {isEditing ? 'Update Employee' : 'Add Employee'}
        </button>
      </form>

      <h3 className="text-xl font-bold my-6">Employee List</h3>
      <p className="mt-4 text-lg">Total Employees: {filteredEmployees.length}</p>
      <input
        className="w-full p-2 mb-4 border border-gray-300 rounded"
        type="text"
        value={search}
        onChange={handleSearch}
        placeholder="Search employees by name, email, mobile, designation, etc."
      />

      <table className="w-full bg-white shadow-md rounded mb-6">
        <thead>
          <tr className="bg-gray-200 text-left">
            <th className="p-4">Image</th>
            <th className="p-4">Name</th>
            <th className="p-4">Email</th>
            <th className="p-4">Mobile</th>
            <th className="p-4">Designation</th>
            <th className="p-4">Gender</th>
            <th className="p-4">Course</th>
            <th className="p-4">Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredEmployees.map((emp) => (
            <tr key={emp._id} className="border-b">
              <td className="p-4">
                {emp.image ? (
                  <img
                    src={`http://localhost:5000/${emp.image}`}
                    alt={`${emp.name}`}
                    className="w-12 h-12 rounded-full"
                  />
                ) : (
                  <span>No Image</span>
                )}
              </td>
              <td className="p-4">{emp.name}</td>
              <td className="p-4">{emp.email}</td>
              <td className="p-4">{emp.mobile}</td>
              <td className="p-4">{emp.designation}</td>
              <td className="p-4">{emp.gender}</td>
              {/* <td className="p-4">{emp.course.join(', ')}</td> */}
              <td className="p-4 flex space-x-2">
                <button
                  onClick={() => handleEdit(emp)}
                  className="bg-green-500 text-white py-1 px-3 rounded hover:bg-green-600"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(emp._id)}
                  className="bg-red-500 text-white py-1 px-3 rounded hover:bg-red-600"
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      
    </div>
  );
};

export default Dashboard;
