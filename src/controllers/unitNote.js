const express = require('express');
const mongoose = require('mongoose');
const router = express.Router();

const UniteNote = require('../models/UnitNote');
const checkAuth = require('../middleware/auth');
const User = require('../models/User');
const { UnitNoteSchema } = require('../validations/UnitNoteValidation');
const { validateInput } = require('../utils/common-functions');

router.post('/', checkAuth, async (req, res) => {
    try {
        const AuthUserData = await User.findById(req.user.userId);

        if (!AuthUserData.role === 'admin') {
            return res.sendStatus(401);
        }

        const validInput = validateInput(UnitNoteSchema, req.body);
        if (!validInput.value) {
            return res.status(403).json(validInput);
        }

        const { subjectName, description, stream, note, noteNum } = validInput.value;

        const foundUnit = await UniteNote.findOne({
            noteNum: new RegExp(`^${noteNum}$`, 'i'),
        });

        if (foundUnit) {
            return res.status(422).json('Subject unit already exists');
        }

        const newUniteNote = new UniteNote({
            subjectName,
            description,
            stream,
            note,
            noteNum,
            createdBy: mongoose.Types.ObjectId(AuthUserData.id),
        });

        await newUniteNote.save();
        return res.sendStatus(200);
    } catch (error) {
        console.log("error2",error);
        return res.sendStatus(500);
    }
});


router.put('/status', checkAuth, async (req, res) => {
  try {
    const AuthUserData = await User.findById(req.user.userId);

    if (!AuthUserData.role === 'admin') {
      return res.sendStatus(401);
    }

    await UniteNote.findByIdAndUpdate(req.body.id, {
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

    const validInput = validateInput(UnitNoteSchema, req.body);
    if (!validInput.value) {
      return res.status(403).json(validInput);
    }

    const { subjectName, description, stream, note, noteNum } = validInput.value;

    const update = {
      subjectName,
      description,
      stream,
      note,
      noteNum
    };

    await UniteNote.findByIdAndUpdate(req.params.id, update);
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

    const data = await UniteNote.findOne({ _id: req.params.id });
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

    const data = await UniteNote.find();
    return res.status(200).json(data);
  } catch (error) {
    return res.sendStatus(500);
  }
});


module.exports = router;
