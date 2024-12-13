import mongoose from "mongoose";
import express from 'express';
import Student from "../models/student.model.js";

export const createStudent = async (req, res, next) => {
  try {
    const { name, age, email, phone, address } = req.body;

    if (!name || typeof name !== 'string' || name.length < 3 || name.length > 200) {
      return res.status(400).send('Invalid name provided');
    }


    const student = new Student({
      name,
      age,
      email,
      phone,
      address,
    });

    const savedStudent = await student.save();
    res.status(201).json(savedStudent);
  } catch (error) {
    res.status(500).send('Internal Server Error');
  }
};



export const getAllStudents = async (req, res, next) => {
  try {
    // Fetch all student records from the database
    const students = await Student.find();

    // Return the array of student records in the response
    res.status(200).json(students);
  } catch (error) {
    // Handle any errors that occur during the process
    res.status(500).send('Internal Server Error');
  }
};


export const getStudentById = async (req, res, next) => {
  try {
    const studentId = req.params.studentId;

    if (!mongoose.Types.ObjectId.isValid(studentId)) {
      return res.status(400).send('Invalid student ID');
    }

    const student = await Student.findById(studentId);

    if (!student) {
      return res.status(404).send('Student not found');
    }

    res.status(200).json(student);
  } catch (error) {
    res.status(500).send('Internal Server Error');
  }
};


export const updateStudent = async (req, res, next) => {
  try {
    const studentId = req.params.studentId;
    const { name, age, email, phone, address } = req.body;

    if (!mongoose.Types.ObjectId.isValid(studentId)) {
      return res.status(400).send('Invalid student ID');
    }

    const studentToUpdate = await Student.findById(studentId);

    if (!studentToUpdate) {
      return res.status(404).send('Student not found');
    }

    // Update the fields with the new values
    if (name) studentToUpdate.name = name;
    if (age) studentToUpdate.age = age;
    if (email) studentToUpdate.email = email;
    if (phone) studentToUpdate.phone = phone;
    if (address) studentToUpdate.address = address;

    const updatedStudent = await studentToUpdate.save();
    res.status(200).json(updatedStudent);
  } catch (error) {
    res.status(500).send('Internal Server Error');
  }
};


export const deleteStudent = async (req, res, next) => {
  try {
    const studentId = req.params.studentId;

    // Find the student by ID and delete
    const deletedStudent = await Student.findByIdAndDelete(studentId);

    if (!deletedStudent) {
      return res.status(404).json({ message: 'Student not found' });
    }

    res.status(200).json({ message: 'Student deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Internal Server Error' });
  }
};
