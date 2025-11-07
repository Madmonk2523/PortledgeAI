const OpenAI = require('openai');
const knowledgeService = require('./knowledgeService');

// Initialize OpenAI client
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

/**
 * System prompt that defines PortledgeAI's personality and behavior
 */
const SYSTEM_PROMPT = `You are PortledgeAI, a professional and knowledgeable AI assistant specifically designed for Portledge School community members - primarily teachers, parents, and staff, with students seeking specific school information.

Your role:
- Provide accurate, factual information about Portledge School (teachers, schedules, rooms, clubs, events, policies)
- Answer questions about school operations, faculty, facilities, and calendar
- Help teachers and parents find specific information quickly
- Assist with understanding school policies and procedures
- Be a reliable source of truth for school-related queries

Your personality:
- Professional, clear, and efficient
- Respectful and courteous to all community members
- Direct and informative without being overly casual
- Embody "Portledge Blue" pride in the school community
- Never pretend to know something you don't

Important guidelines:
- ALWAYS use the provided Portledge context to answer school-specific questions
- If you don't have information, say so clearly and suggest who to contact
- Be concise and factual - teachers and parents appreciate brevity
- For policy questions, refer to the handbook and provide exact information
- Respect privacy - never share personal student information
- When students ask academic questions, provide factual information but suggest speaking with their teacher for learning support

Audience priorities:
1. Teachers & Staff - looking for quick school information
2. Parents - seeking information about their child's school environment
3. Students - wanting specific facts about classes, clubs, schedules, or teachers

Today's date is ${new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}.`;

/**
 * Chat mode prompts for different interaction styles
 */
const MODE_PROMPTS = {
  info: `You are now in INFORMATION MODE. Focus on:
- Providing clear, factual answers about Portledge School
- Citing specific teachers, rooms, times, and policies
- Being direct and efficient
- Offering relevant contact information when appropriate
- Answering "who, what, when, where" questions precisely`,

  guide: `You are now in GUIDANCE MODE. Focus on:
- Helping navigate school resources and procedures
- Explaining school policies and programs
- Suggesting appropriate next steps or contacts
- Providing context for school operations
- Being thorough but organized in responses`,

  quick: `You are now in QUICK ANSWER MODE. Focus on:
- Providing direct, concise answers
- Answering factual questions quickly
- Keeping responses brief but accurate
- No lengthy explanations unless asked`
};

/**
 * Generate AI response with Portledge context
 */
async function generateResponse(userMessage, conversationHistory = [], options = {}) {
  try {
    const { mode = 'quick', userId = null, userContext = null } = options;

    // Gather relevant Portledge context
    const context = await knowledgeService.getRelevantContext(userMessage);
    
    // Build context string
    let contextString = '\n\n--- PORTLEDGE SCHOOL CONTEXT ---\n';
    
    if (context.teachers.length > 0) {
      contextString += '\nTeachers:\n' + JSON.stringify(context.teachers, null, 2);
    }
    
    if (context.schedule) {
      contextString += '\n\nSchedule Info:\n' + JSON.stringify(context.schedule, null, 2);
    }
    
    if (context.clubs.length > 0) {
      contextString += '\n\nClubs:\n' + JSON.stringify(context.clubs, null, 2);
    }
    
    if (context.events.length > 0) {
      contextString += '\n\nUpcoming Events:\n' + JSON.stringify(context.events, null, 2);
    }
    
    if (context.handbook) {
      contextString += '\n\nHandbook Info:\n' + context.handbook;
    }

    // Add user's personal context if available
    if (userContext) {
      contextString += '\n\n--- STUDENT PERSONAL INFO ---\n';
      contextString += JSON.stringify(userContext, null, 2);
    }

    contextString += '\n--- END CONTEXT ---\n\n';

    // Build messages for OpenAI
    const messages = [
      {
        role: 'system',
        content: SYSTEM_PROMPT + '\n\n' + (MODE_PROMPTS[mode] || MODE_PROMPTS.quick) + contextString
      }
    ];

    // Add conversation history (last 10 messages)
    const recentHistory = conversationHistory.slice(-10);
    messages.push(...recentHistory);

    // Add current user message
    messages.push({
      role: 'user',
      content: userMessage
    });

    // Call OpenAI API
    const response = await openai.chat.completions.create({
      model: process.env.OPENAI_MODEL || 'gpt-4-turbo-preview',
      messages: messages,
      temperature: 0.7,
      max_tokens: 1000,
      presence_penalty: 0.6,
      frequency_penalty: 0.3
    });

    const aiMessage = response.choices[0].message.content;

    return {
      success: true,
      message: aiMessage,
      context_used: {
        teachers_count: context.teachers.length,
        clubs_count: context.clubs.length,
        events_count: context.events.length,
        has_schedule: !!context.schedule,
        has_handbook: !!context.handbook
      },
      tokens_used: response.usage.total_tokens
    };

  } catch (error) {
    console.error('AI Service Error:', error);
    
    if (error.status === 401) {
      throw new Error('OpenAI API authentication failed. Check your API key.');
    } else if (error.status === 429) {
      throw new Error('Rate limit exceeded. Please try again in a moment.');
    } else if (error.status === 503) {
      throw new Error('OpenAI service is temporarily unavailable. Please try again later.');
    }
    
    throw new Error('Failed to generate AI response: ' + error.message);
  }
}

/**
 * Generate suggestions for follow-up questions
 */
async function generateSuggestions(conversationContext) {
  try {
    const prompt = `Based on this conversation context, suggest 3 brief follow-up questions a Portledge student might ask. Return ONLY a JSON array of strings.

Context: ${JSON.stringify(conversationContext.slice(-3))}

Format: ["Question 1?", "Question 2?", "Question 3?"]`;

    const response = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [{ role: 'user', content: prompt }],
      temperature: 0.8,
      max_tokens: 150
    });

    const suggestions = JSON.parse(response.choices[0].message.content);
    return suggestions;
  } catch (error) {
    console.error('Error generating suggestions:', error);
    return [
      "What else can you help me with?",
      "Tell me about school events",
      "Who teaches my classes?"
    ];
  }
}

module.exports = {
  generateResponse,
  generateSuggestions
};
