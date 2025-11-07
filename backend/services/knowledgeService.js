const fs = require('fs').promises;
const path = require('path');
const ICAL = require('ical.js');

// Paths to knowledge base files
const DATA_DIR = path.join(__dirname, '../../data/portledge');
const TEACHERS_FILE = path.join(DATA_DIR, 'teachers.json');
const SCHEDULE_FILE = path.join(DATA_DIR, 'schedule.json');
const ROOMS_FILE = path.join(DATA_DIR, 'rooms.json');
const CALENDAR_FILE = path.join(DATA_DIR, 'calendar.ics');
const HANDBOOK_FILE = path.join(DATA_DIR, 'handbook.md');
const CLUBS_FILE = path.join(DATA_DIR, 'clubs.json');

// Cache for loaded data (refresh every 5 minutes)
let dataCache = {
  teachers: null,
  schedule: null,
  rooms: null,
  calendar: null,
  handbook: null,
  clubs: null,
  lastUpdate: 0
};

const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

/**
 * Load all knowledge base data
 */
async function loadAllData() {
  const now = Date.now();
  
  // Return cached data if still valid
  if (dataCache.lastUpdate && (now - dataCache.lastUpdate) < CACHE_DURATION) {
    return dataCache;
  }

  try {
    // Load all JSON files
    const [teachers, schedule, rooms, clubs] = await Promise.all([
      fs.readFile(TEACHERS_FILE, 'utf8').then(JSON.parse),
      fs.readFile(SCHEDULE_FILE, 'utf8').then(JSON.parse),
      fs.readFile(ROOMS_FILE, 'utf8').then(JSON.parse),
      fs.readFile(CLUBS_FILE, 'utf8').then(JSON.parse)
    ]);

    // Load handbook
    const handbook = await fs.readFile(HANDBOOK_FILE, 'utf8');

    // Load and parse calendar
    const calendarData = await fs.readFile(CALENDAR_FILE, 'utf8');
    const calendar = parseICalendar(calendarData);

    // Update cache
    dataCache = {
      teachers,
      schedule,
      rooms,
      calendar,
      handbook,
      clubs,
      lastUpdate: now
    };

    console.log('✅ Knowledge base loaded successfully');
    return dataCache;
  } catch (error) {
    console.error('Error loading knowledge base:', error);
    throw error;
  }
}

/**
 * Parse ICS calendar file
 */
function parseICalendar(icsData) {
  try {
    const jcalData = ICAL.parse(icsData);
    const comp = new ICAL.Component(jcalData);
    const vevents = comp.getAllSubcomponents('vevent');

    const events = vevents.map(vevent => {
      const event = new ICAL.Event(vevent);
      return {
        summary: event.summary,
        description: event.description,
        start: event.startDate.toJSDate(),
        end: event.endDate.toJSDate(),
        location: event.location
      };
    });

    // Sort by start date
    return events.sort((a, b) => a.start - b.start);
  } catch (error) {
    console.error('Error parsing calendar:', error);
    return [];
  }
}

/**
 * Get relevant context based on user query
 */
async function getRelevantContext(query) {
  const data = await loadAllData();
  const queryLower = query.toLowerCase();

  const context = {
    teachers: [],
    schedule: null,
    clubs: [],
    events: [],
    handbook: null
  };

  // Search for relevant teachers
  if (queryLower.includes('teacher') || queryLower.includes('who teaches')) {
    data.teachers.forEach(teacher => {
      const matchesName = teacher.name.toLowerCase().includes(queryLower);
      const matchesSubject = teacher.subjects.some(s => queryLower.includes(s.toLowerCase()));
      
      if (matchesName || matchesSubject) {
        context.teachers.push(teacher);
      }
    });

    // If no specific match, include all teachers for general questions
    if (context.teachers.length === 0 && 
        (queryLower.includes('all teachers') || queryLower.includes('faculty'))) {
      context.teachers = data.teachers;
    }
  }

  // Check for schedule-related queries
  if (queryLower.includes('schedule') || queryLower.includes('day') || 
      queryLower.includes('rotation') || queryLower.includes('period')) {
    context.schedule = data.schedule;
  }

  // Search for relevant clubs
  if (queryLower.includes('club') || queryLower.includes('activity') || 
      queryLower.includes('extracurricular')) {
    data.clubs.forEach(club => {
      const matchesName = club.name.toLowerCase().includes(queryLower);
      const matchesDescription = club.description.toLowerCase().includes(queryLower);
      
      if (matchesName || matchesDescription) {
        context.clubs.push(club);
      }
    });

    // If no specific match, include all clubs for general questions
    if (context.clubs.length === 0 && queryLower.includes('all clubs')) {
      context.clubs = data.clubs;
    }
  }

  // Get upcoming events
  if (queryLower.includes('event') || queryLower.includes('calendar') || 
      queryLower.includes('what\'s happening') || queryLower.includes('coming up')) {
    const now = new Date();
    context.events = data.calendar
      .filter(event => event.start >= now)
      .slice(0, 5); // Next 5 events
  }

  // Include handbook for policy questions
  if (queryLower.includes('policy') || queryLower.includes('rule') || 
      queryLower.includes('handbook') || queryLower.includes('dress code') ||
      queryLower.includes('attendance')) {
    context.handbook = data.handbook;
  }

  return context;
}

/**
 * Get current rotation day
 */
async function getCurrentDay() {
  const data = await loadAllData();
  const today = new Date().toISOString().split('T')[0];
  
  return data.schedule.rotation_calendar[today] || 
         data.schedule.rotation.current_day;
}

/**
 * Search teachers by subject or name
 */
async function searchTeachers(searchTerm) {
  const data = await loadAllData();
  const term = searchTerm.toLowerCase();

  return data.teachers.filter(teacher => {
    return teacher.name.toLowerCase().includes(term) ||
           teacher.subjects.some(s => s.toLowerCase().includes(term)) ||
           teacher.email.toLowerCase().includes(term);
  });
}

/**
 * Get club information
 */
async function getClubInfo(clubName) {
  const data = await loadAllData();
  const name = clubName.toLowerCase();

  return data.clubs.find(club => 
    club.name.toLowerCase().includes(name)
  );
}

/**
 * Get upcoming events
 */
async function getUpcomingEvents(limit = 10) {
  const data = await loadAllData();
  const now = new Date();

  return data.calendar
    .filter(event => event.start >= now)
    .slice(0, limit);
}

module.exports = {
  loadAllData,
  getRelevantContext,
  getCurrentDay,
  searchTeachers,
  getClubInfo,
  getUpcomingEvents
};
