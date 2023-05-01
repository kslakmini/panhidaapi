const express = require('express');
const mongoose = require('mongoose');
const router = express.Router();

const Assignment = require('../models/Assignment');
const checkAuth = require('../middleware/auth');
const User = require('../models/User');
const { AssignmentSchema } = require('../validations/AssignmentValidation');
const { validateInput } = require('../utils/common-functions');

router.post('/', checkAuth, async (req, res) => {
    try {
        const AuthUserData = await User.findById(req.user.userId);

        if (!AuthUserData.role === 'admin') {
            return res.sendStatus(401);
        }

        const validInput = validateInput(AssignmentSchema, req.body);
        if (!validInput.value) {
            return res.status(403).json(validInput);
        }

        const { subjectName, description, stream, assignment, assignmentNum } = validInput.value;

        const foundAss = await Assignment.findOne({
            assignmentNum: new RegExp(`^${assignmentNum}$`, 'i'),
        });

        if (foundAss) {
            return res.status(422).json('Assignment already exists');
        }

        const newAssignment = new Assignment({
            subjectName,
            description,
            stream,
            assignment,
            assignmentNum,
            createdBy: mongoose.Types.ObjectId(AuthUserData.id),
        });

        await newAssignment.save();
        return res.sendStatus(200);
    } catch (error) {
        console.log("error",error);
        return res.sendStatus(500);
    }
});


router.put('/status', checkAuth, async (req, res) => {
  try {
    const AuthUserData = await User.findById(req.user.userId);

    if (!AuthUserData.role === 'admin') {
      return res.sendStatus(401);
    }

    await Assignment.findByIdAndUpdate(req.body.id, {
      status: req.body.status,
    });
    return res.sendStatus(200);
  } catch (error) {
    return res.sendStatus(500);
  }
});

router.put('/:id', checkAuth , async (req, res) => {
  try {
    const AuthUserData = await User.findById(req.user.userId);

    if (!AuthUserData.role === 'admin') {
      return res.sendStatus(401);
    }

    const validInput = validateInput(AssignmentSchema, req.body);
    if (!validInput.value) {
      return res.status(403).json(validInput);
    }

    const { subjectName, description, stream, assignment, assignmentNum } = validInput.value;

    const update = {
      subjectName,
      description,
      stream,
      assignment,
      assignmentNum,
    };

    await Assignment.findByIdAndUpdate(req.params.id, update);
    return res.sendStatus(200);
  } catch (error) {
    console.log("error",error);
    return res.sendStatus(500);
  }
});

router.get('/:id', checkAuth , async (req, res) => {
  try {
    const AuthUserData = await User.findById(req.user.userId);

    if (!AuthUserData.role === 'admin') {
      return res.sendStatus(401);
    }

    const data = await Assignment.findOne({ _id: req.params.id });
    return res.status(200).json(data);
  } catch (error) {
    return res.sendStatus(500);
  }
});

router.get('/', checkAuth , async (req, res) => {
  try {
    const AuthUserData = await User.findById(req.user.userId);

    if (!AuthUserData.role === 'admin') {
      return res.sendStatus(401);
    }

    const data = await Assignment.find();
    return res.status(200).json(data);
  } catch (error) {
    return res.sendStatus(500);
  }
});


module.exports = router;
