const express = require('express');
const router = express.Router();
const knowledgeService = require('../services/knowledgeService');

/**
 * GET /api/knowledge/teachers
 * Get list of all teachers or search by name/subject
 */
router.get('/teachers', async (req, res, next) => {
  try {
    const { search } = req.query;

    if (search) {
      const teachers = await knowledgeService.searchTeachers(search);
      return res.json({
        success: true,
        teachers,
        count: teachers.length
      });
    }

    const data = await knowledgeService.loadAllData();
    res.json({
      success: true,
      teachers: data.teachers,
      count: data.teachers.length
    });

  } catch (error) {
    next(error);
  }
});

/**
 * GET /api/knowledge/schedule
 * Get schedule information including rotation day
 */
router.get('/schedule', async (req, res, next) => {
  try {
    const data = await knowledgeService.loadAllData();
    const currentDay = await knowledgeService.getCurrentDay();

    res.json({
      success: true,
      schedule: data.schedule,
      currentDay
    });

  } catch (error) {
    next(error);
  }
});

/**
 * GET /api/knowledge/current-day
 * Get current rotation day
 */
router.get('/current-day', async (req, res, next) => {
  try {
    const currentDay = await knowledgeService.getCurrentDay();

    res.json({
      success: true,
      day: currentDay,
      date: new Date().toISOString().split('T')[0]
    });

  } catch (error) {
    next(error);
  }
});

/**
 * GET /api/knowledge/clubs
 * Get list of all clubs or search by name
 */
router.get('/clubs', async (req, res, next) => {
  try {
    const { search } = req.query;
    const data = await knowledgeService.loadAllData();

    let clubs = data.clubs;

    if (search) {
      const searchLower = search.toLowerCase();
      clubs = clubs.filter(club =>
        club.name.toLowerCase().includes(searchLower) ||
        club.description.toLowerCase().includes(searchLower)
      );
    }

    res.json({
      success: true,
      clubs,
      count: clubs.length
    });

  } catch (error) {
    next(error);
  }
});

/**
 * GET /api/knowledge/clubs/:clubName
 * Get specific club information
 */
router.get('/clubs/:clubName', async (req, res, next) => {
  try {
    const { clubName } = req.params;
    const club = await knowledgeService.getClubInfo(clubName);

    if (!club) {
      return res.status(404).json({
        error: 'Club not found'
      });
    }

    res.json({
      success: true,
      club
    });

  } catch (error) {
    next(error);
  }
});

/**
 * GET /api/knowledge/events
 * Get upcoming school events
 */
router.get('/events', async (req, res, next) => {
  try {
    const limit = parseInt(req.query.limit) || 10;
    const events = await knowledgeService.getUpcomingEvents(limit);

    res.json({
      success: true,
      events,
      count: events.length
    });

  } catch (error) {
    next(error);
  }
});

/**
 * GET /api/knowledge/handbook
 * Get handbook information
 */
router.get('/handbook', async (req, res, next) => {
  try {
    const data = await knowledgeService.loadAllData();

    res.json({
      success: true,
      handbook: data.handbook
    });

  } catch (error) {
    next(error);
  }
});

/**
 * GET /api/knowledge/rooms
 * Get room and building information
 */
router.get('/rooms', async (req, res, next) => {
  try {
    const data = await knowledgeService.loadAllData();

    res.json({
      success: true,
      rooms: data.rooms
    });

  } catch (error) {
    next(error);
  }
});

module.exports = router;
