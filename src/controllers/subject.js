const express = require('express');
const mongoose = require('mongoose');
const router = express.Router();

const Subject = require('../models/Subject');
const checkAuth = require('../middleware/auth');
const User = require('../models/User');
const { SubjectSchema } = require('../validations/SubjectValidation');
const { validateInput } = require('../utils/common-functions');

router.post('/', checkAuth, async (req, res) => {
    try {
        const AuthUserData = await User.findById(req.user.userId);

        if (!AuthUserData.role === 'admin') {
            return res.sendStatus(401);
        }

        const validInput = validateInput(SubjectSchema, req.body);
        if (!validInput.value) {
            return res.status(403).json(validInput);
        }

        const { subjectName, description, stream } = validInput.value;

        const foundSubject = await Subject.findOne({
            subjectName: new RegExp(`^${subjectName}$`, 'i'),
        });

        if (foundSubject) {
            return res.status(422).json('Subject already exists');
        }

        const newSubject = new Subject({
            subjectName,
            description,
            stream,
            createdBy: mongoose.Types.ObjectId(AuthUserData.id),
        });

        await newSubject.save();
        return res.sendStatus(200);
    } catch (error) {
      console.log("error", error);
        return res.sendStatus(500);
    }
});


router.put('/status', checkAuth, async (req, res) => {
  try {
    const AuthUserData = await User.findById(req.user.userId);

    if (!AuthUserData.role === 'admin') {
      return res.sendStatus(401);
    }

    await Subject.findByIdAndUpdate(req.body.id, {
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

    const validInput = validateInput(SubjectSchema, req.body);
    if (!validInput.value) {
      return res.status(403).json(validInput);
    }

    const { subjectName, description, stream } = validInput.value;

    const update = {
      subjectName,
      description,
      stream,
    };

    await Subject.findByIdAndUpdate(req.params.id, update);
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

    const data = await Subject.findOne({ _id: req.params.id });
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

    const data = await Subject.find();
    return res.status(200).json(data);
  } catch (error) {
    return res.sendStatus(500);
  }
});


module.exports = router;
