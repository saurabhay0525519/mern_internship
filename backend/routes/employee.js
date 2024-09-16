const express = require('express');
const multer = require('multer');
const Employee = require('../models/Employee.js');
const router = express.Router();

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + '-' + file.originalname);
  },
});

const fileFilter = (req, file, cb) => {
  if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/jpg') {
    cb(null, true);
  } else {
    cb(null, false);
  }
};

const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
});

// Create Employee
router.post('/', upload.single('image'), async (req, res) => {
  const { name, email, mobile, designation, gender, course } = req.body;
  try {
    const existingEmployee = await Employee.findOne({ email });
    if (existingEmployee) return res.status(400).json({ message: 'Email already exists' });

    const newEmployee = new Employee({
      name,
      email,
      mobile,
      designation,
      gender,
      course,
      imgUrl: req.file.path,
      
    });
    // const mobile_no = req.body.mobile;

    // Regular expression to check if it's a 10-digit number
    // const mobilePattern = /^\d{10}$/;
  
    // if (!mobilePattern.test(mobile_no)) {
    //   return res.status(400).json({ error: "Invalid mobile number. It should be exactly 10 digits." });
    // }
    await newEmployee.save();
    res.status(201).json(newEmployee);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Get All Employees
router.get('/', async (req, res) => {
  try {
    const employees = await Employee.find();
    const totalCount = await Employee.countDocuments();
    res.json({ employees, totalCount });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Update Employee
router.put('/:id', upload.single('image'), async (req, res) => {
  console.log('you enterer in update empouee')
  const { name, email, mobile, designation, gender, course } = req.body;
  try {
    let employee = await Employee.findById(req.params.id);
    if (!employee) return res.status(404).json({ message: 'Employee not found' });

    const existingEmployee = await Employee.findOne({ email });
    if (existingEmployee && existingEmployee._id.toString() !== req.params.id) {
      return res.status(400).json({ message: 'Email already exists' });
    }

    employee.name = name;
    employee.email = email;
    employee.mobile = mobile;
    employee.designation = designation;
    employee.gender = gender;
    employee.course = course;
    employee.imgUrl = req.file ? req.file.path : employee.imgUrl;

    await employee.save();
    res.json(employee);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Delete Employee
router.delete('/:id', async (req, res) => {
  console.log('entered in delete employee')
  try {
    console.log( 'the id is : ',req.params.id)
    const employee = await Employee.findById(req.params.id);
    if (!employee) return res.status(404).json({ message: 'Employee not found' });

    // await employee.remove();
    await Employee.deleteOne({ _id: req.params.id });
    res.json({ message: 'Employee deleted' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
