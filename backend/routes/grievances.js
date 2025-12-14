const express = require('express');
const router = express.Router();

// Grievance Model
const Grievance = require('../models/Grievance');
// @route   GET api/grievances
// @desc    Get All Grievances
// @access  Public
router.get('/', (req, res) => {
  Grievance.find()
    .sort({ date: -1 })
    .then(grievances => res.json(grievances));
});

// @route   POST api/grievances
// @desc    Create A Grievance
// @access  Public
router.post('/', (req, res) => {
  const newGrievance = new Grievance({
    title: req.body.title,
    description: req.body.description,
    category: req.body.category,
    aiPriority: req.body.aiPriority,
    summary: req.body.summary,
    submitterUserId: req.body.submitterUserId,
    location: req.body.location
  });

  newGrievance.save().then(grievance => res.json(grievance));
});

// @route   DELETE api/grievances/:id
// @desc    Delete A Grievance
// @access  Public
router.delete('/:id', (req, res) => {
  Grievance.findById(req.params.id)
    .then(grievance => grievance.remove().then(() => res.json({ success: true })))
    .catch(err => res.status(404).json({ success: false }));
});

// @route   PUT api/grievances/:id
// @desc    Update A Grievance
// @access  Public
router.put('/:id', (req, res) => {
    Grievance.findByIdAndUpdate(req.params.id, req.body, { new: true })
        .then(grievance => res.json(grievance))
        .catch(err => res.status(404).json({ success: false }));
});


module.exports = router;
