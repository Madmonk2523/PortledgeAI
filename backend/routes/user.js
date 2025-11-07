const express = require('express');
const router = express.Router();
const userService = require('../services/userService');

/**
 * GET /api/user/profile
 * Get user profile and preferences
 */
router.get('/profile', async (req, res, next) => {
  try {
    const userId = req.user.uid;
    const profile = await userService.getUserProfile(userId);

    res.json({
      success: true,
      profile
    });

  } catch (error) {
    next(error);
  }
});

/**
 * PUT /api/user/profile
 * Update user profile
 */
router.put('/profile', async (req, res, next) => {
  try {
    const userId = req.user.uid;
    const updates = req.body;

    const profile = await userService.updateUserProfile(userId, updates);

    res.json({
      success: true,
      profile,
      message: 'Profile updated successfully'
    });

  } catch (error) {
    next(error);
  }
});

/**
 * GET /api/user/schedule
 * Get user's custom schedule
 */
router.get('/schedule', async (req, res, next) => {
  try {
    const userId = req.user.uid;
    const schedule = await userService.getUserSchedule(userId);

    res.json({
      success: true,
      schedule
    });

  } catch (error) {
    next(error);
  }
});

/**
 * POST /api/user/schedule
 * Save user's custom schedule
 */
router.post('/schedule', async (req, res, next) => {
  try {
    const userId = req.user.uid;
    const { schedule } = req.body;

    if (!schedule || !Array.isArray(schedule)) {
      return res.status(400).json({
        error: 'Valid schedule array is required'
      });
    }

    const result = await userService.saveUserSchedule(userId, schedule);

    res.json({
      success: true,
      ...result,
      message: 'Schedule saved successfully'
    });

  } catch (error) {
    next(error);
  }
});

/**
 * GET /api/user/todos
 * Get user's to-do list
 */
router.get('/todos', async (req, res, next) => {
  try {
    const userId = req.user.uid;
    const todos = await userService.getTodoList(userId);

    res.json({
      success: true,
      todos,
      count: todos.length
    });

  } catch (error) {
    next(error);
  }
});

/**
 * POST /api/user/todos
 * Add item to to-do list
 */
router.post('/todos', async (req, res, next) => {
  try {
    const userId = req.user.uid;
    const item = req.body;

    if (!item.text) {
      return res.status(400).json({
        error: 'Todo text is required'
      });
    }

    const todo = await userService.addTodoItem(userId, item);

    res.json({
      success: true,
      todo,
      message: 'Todo added successfully'
    });

  } catch (error) {
    next(error);
  }
});

/**
 * PUT /api/user/todos/:id
 * Update to-do item
 */
router.put('/todos/:id', async (req, res, next) => {
  try {
    const userId = req.user.uid;
    const { id } = req.params;
    const updates = req.body;

    const todo = await userService.updateTodoItem(userId, id, updates);

    res.json({
      success: true,
      todo,
      message: 'Todo updated successfully'
    });

  } catch (error) {
    next(error);
  }
});

/**
 * DELETE /api/user/todos/:id
 * Delete to-do item
 */
router.delete('/todos/:id', async (req, res, next) => {
  try {
    const userId = req.user.uid;
    const { id } = req.params;

    await userService.deleteTodoItem(userId, id);

    res.json({
      success: true,
      message: 'Todo deleted successfully'
    });

  } catch (error) {
    next(error);
  }
});

/**
 * GET /api/user/notes
 * Get user's notes
 */
router.get('/notes', async (req, res, next) => {
  try {
    const userId = req.user.uid;
    const notes = await userService.getUserNotes(userId);

    res.json({
      success: true,
      notes,
      count: notes.length
    });

  } catch (error) {
    next(error);
  }
});

/**
 * POST /api/user/notes
 * Add a new note
 */
router.post('/notes', async (req, res, next) => {
  try {
    const userId = req.user.uid;
    const note = req.body;

    if (!note.content) {
      return res.status(400).json({
        error: 'Note content is required'
      });
    }

    const newNote = await userService.addNote(userId, note);

    res.json({
      success: true,
      note: newNote,
      message: 'Note added successfully'
    });

  } catch (error) {
    next(error);
  }
});

/**
 * DELETE /api/user/notes/:id
 * Delete a note
 */
router.delete('/notes/:id', async (req, res, next) => {
  try {
    const userId = req.user.uid;
    const { id } = req.params;

    await userService.deleteNote(userId, id);

    res.json({
      success: true,
      message: 'Note deleted successfully'
    });

  } catch (error) {
    next(error);
  }
});

module.exports = router;
