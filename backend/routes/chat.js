const express = require('express');
const router = express.Router();
const aiService = require('../services/aiService');
const userService = require('../services/userService');

/**
 * POST /api/chat
 * Main chat endpoint - sends message to AI and returns response
 */
router.post('/', async (req, res, next) => {
  try {
    const { message, mode = 'quick', conversationId = null } = req.body;
    const userId = req.user.uid;

    // Validation
    if (!message || message.trim().length === 0) {
      return res.status(400).json({ 
        error: 'Message is required' 
      });
    }

    if (message.length > 2000) {
      return res.status(400).json({ 
        error: 'Message too long (max 2000 characters)' 
      });
    }

    // Get user context and chat history
    const userContext = await userService.getUserContextForAI(userId);
    const chatHistory = await userService.getChatHistory(userId, 10);

    // Convert chat history to OpenAI format
    const conversationHistory = chatHistory.map(msg => ({
      role: msg.role,
      content: msg.content
    }));

    // Generate AI response
    const result = await aiService.generateResponse(
      message,
      conversationHistory,
      {
        mode,
        userId,
        userContext
      }
    );

    // Save messages to history
    await userService.saveChatMessage(userId, {
      role: 'user',
      content: message
    });

    await userService.saveChatMessage(userId, {
      role: 'assistant',
      content: result.message
    });

    // Generate suggested follow-up questions
    const suggestions = await aiService.generateSuggestions([
      ...conversationHistory,
      { role: 'user', content: message },
      { role: 'assistant', content: result.message }
    ]);

    res.json({
      success: true,
      message: result.message,
      suggestions,
      metadata: {
        mode,
        context_used: result.context_used,
        tokens_used: result.tokens_used
      }
    });

  } catch (error) {
    next(error);
  }
});

/**
 * GET /api/chat/history
 * Get user's chat history
 */
router.get('/history', async (req, res, next) => {
  try {
    const userId = req.user.uid;
    const limit = parseInt(req.query.limit) || 50;

    const history = await userService.getChatHistory(userId, limit);

    res.json({
      success: true,
      history,
      count: history.length
    });

  } catch (error) {
    next(error);
  }
});

/**
 * DELETE /api/chat/history
 * Clear user's chat history
 */
router.delete('/history', async (req, res, next) => {
  try {
    const userId = req.user.uid;

    await userService.clearChatHistory(userId);

    res.json({
      success: true,
      message: 'Chat history cleared'
    });

  } catch (error) {
    next(error);
  }
});

/**
 * POST /api/chat/feedback
 * Submit feedback on AI response
 */
router.post('/feedback', async (req, res, next) => {
  try {
    const { messageId, rating, comment } = req.body;
    const userId = req.user.uid;

    // TODO: Implement feedback storage for improving AI
    console.log('Feedback received:', { userId, messageId, rating, comment });

    res.json({
      success: true,
      message: 'Thank you for your feedback!'
    });

  } catch (error) {
    next(error);
  }
});

module.exports = router;
