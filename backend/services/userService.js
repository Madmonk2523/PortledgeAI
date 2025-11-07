// User service for managing student data and preferences
// In production, this would connect to Firebase/Supabase

// In-memory storage for development (replace with database in production)
const userStore = new Map();

/**
 * Get user profile and preferences
 */
async function getUserProfile(userId) {
  if (!userId) {
    throw new Error('User ID is required');
  }

  // Return existing profile or create new one
  if (!userStore.has(userId)) {
    const newProfile = {
      userId,
      name: '',
      grade: null,
      schedule: [],
      preferences: {
        favoriteSubjects: [],
        studyMode: 'quick',
        notifications: true
      },
      todoList: [],
      notes: [],
      chatHistory: [],
      createdAt: new Date().toISOString(),
      lastActive: new Date().toISOString()
    };
    userStore.set(userId, newProfile);
  }

  const profile = userStore.get(userId);
  profile.lastActive = new Date().toISOString();
  
  return profile;
}

/**
 * Update user profile
 */
async function updateUserProfile(userId, updates) {
  if (!userId) {
    throw new Error('User ID is required');
  }

  const profile = await getUserProfile(userId);
  
  // Merge updates
  Object.assign(profile, updates);
  userStore.set(userId, profile);

  return profile;
}

/**
 * Save user's custom schedule
 */
async function saveUserSchedule(userId, schedule) {
  if (!userId || !schedule) {
    throw new Error('User ID and schedule are required');
  }

  const profile = await getUserProfile(userId);
  profile.schedule = schedule;
  userStore.set(userId, profile);

  return { success: true, schedule };
}

/**
 * Get user's schedule
 */
async function getUserSchedule(userId) {
  const profile = await getUserProfile(userId);
  return profile.schedule || [];
}

/**
 * Add item to user's to-do list
 */
async function addTodoItem(userId, item) {
  if (!userId || !item) {
    throw new Error('User ID and item are required');
  }

  const profile = await getUserProfile(userId);
  
  const todoItem = {
    id: Date.now().toString(),
    text: item.text,
    subject: item.subject || null,
    dueDate: item.dueDate || null,
    completed: false,
    createdAt: new Date().toISOString()
  };

  profile.todoList.push(todoItem);
  userStore.set(userId, profile);

  return todoItem;
}

/**
 * Update to-do item
 */
async function updateTodoItem(userId, itemId, updates) {
  const profile = await getUserProfile(userId);
  const item = profile.todoList.find(t => t.id === itemId);

  if (!item) {
    throw new Error('Todo item not found');
  }

  Object.assign(item, updates);
  userStore.set(userId, profile);

  return item;
}

/**
 * Delete to-do item
 */
async function deleteTodoItem(userId, itemId) {
  const profile = await getUserProfile(userId);
  profile.todoList = profile.todoList.filter(t => t.id !== itemId);
  userStore.set(userId, profile);

  return { success: true };
}

/**
 * Get user's to-do list
 */
async function getTodoList(userId) {
  const profile = await getUserProfile(userId);
  return profile.todoList || [];
}

/**
 * Save chat message to history
 */
async function saveChatMessage(userId, message) {
  if (!userId || !message) {
    throw new Error('User ID and message are required');
  }

  const profile = await getUserProfile(userId);
  
  const chatMessage = {
    id: Date.now().toString(),
    role: message.role, // 'user' or 'assistant'
    content: message.content,
    timestamp: new Date().toISOString()
  };

  profile.chatHistory.push(chatMessage);

  // Keep only last 100 messages
  if (profile.chatHistory.length > 100) {
    profile.chatHistory = profile.chatHistory.slice(-100);
  }

  userStore.set(userId, profile);

  return chatMessage;
}

/**
 * Get user's chat history
 */
async function getChatHistory(userId, limit = 50) {
  const profile = await getUserProfile(userId);
  return profile.chatHistory.slice(-limit) || [];
}

/**
 * Clear chat history
 */
async function clearChatHistory(userId) {
  const profile = await getUserProfile(userId);
  profile.chatHistory = [];
  userStore.set(userId, profile);

  return { success: true };
}

/**
 * Add note
 */
async function addNote(userId, note) {
  if (!userId || !note) {
    throw new Error('User ID and note are required');
  }

  const profile = await getUserProfile(userId);
  
  const newNote = {
    id: Date.now().toString(),
    title: note.title || 'Untitled',
    content: note.content,
    subject: note.subject || null,
    tags: note.tags || [],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };

  profile.notes.push(newNote);
  userStore.set(userId, profile);

  return newNote;
}

/**
 * Get all user notes
 */
async function getUserNotes(userId) {
  const profile = await getUserProfile(userId);
  return profile.notes || [];
}

/**
 * Delete note
 */
async function deleteNote(userId, noteId) {
  const profile = await getUserProfile(userId);
  profile.notes = profile.notes.filter(n => n.id !== noteId);
  userStore.set(userId, profile);

  return { success: true };
}

/**
 * Get user context for AI (preferences, schedule, recent activity)
 */
async function getUserContextForAI(userId) {
  const profile = await getUserProfile(userId);

  return {
    grade: profile.grade,
    favoriteSubjects: profile.preferences.favoriteSubjects,
    schedule: profile.schedule,
    recentTodos: profile.todoList.filter(t => !t.completed).slice(-5),
    studyMode: profile.preferences.studyMode
  };
}

module.exports = {
  getUserProfile,
  updateUserProfile,
  saveUserSchedule,
  getUserSchedule,
  addTodoItem,
  updateTodoItem,
  deleteTodoItem,
  getTodoList,
  saveChatMessage,
  getChatHistory,
  clearChatHistory,
  addNote,
  getUserNotes,
  deleteNote,
  getUserContextForAI
};
