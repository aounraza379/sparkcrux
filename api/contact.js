const fs = require('fs');
const path = require('path');
const validator = require('validator');

function sanitizeInput(input) {
  if (typeof input !== 'string') return input;

  return input
    .trim()
    .replace(/[<>]/g, '')
    .replace(/javascript:/gi, '')
    .replace(/on\w+=/gi, '')
    .substring(0, 1000);
}

function validateContactSubmission(data) {
  const errors = [];

  if (!data.name || !data.name.trim()) {
    errors.push('Name is required');
  } else if (data.name.length > 100) {
    errors.push('Name must be less than 100 characters');
  }

  if (!data.email || !data.email.trim()) {
    errors.push('Email is required');
  } else if (!validator.isEmail(data.email)) {
    errors.push('Please enter a valid email address');
  }

  if (!data.service || !data.service.trim()) {
    errors.push('Service selection is required');
  }

  if (!data.message || !data.message.trim()) {
    errors.push('Message is required');
  } else if (data.message.length > 2000) {
    errors.push('Message must be less than 2000 characters');
  }

  if (data.website && data.website.trim() && !validator.isURL(data.website)) {
    errors.push('Please enter a valid website URL');
  }

  return errors;
}

function getStoragePath() {
  return path.resolve('/tmp', 'sparkcrux-forms.json');
}

function readStorage() {
  try {
    const file = fs.readFileSync(getStoragePath(), 'utf8');
    return JSON.parse(file);
  } catch (error) {
    return { contact: [], audit: [] };
  }
}

function writeStorage(data) {
  const dir = path.dirname(getStoragePath());
  fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(getStoragePath(), JSON.stringify(data, null, 2));
}

function parseBody(req) {
  return new Promise((resolve, reject) => {
    if (req.body) {
      return resolve(req.body);
    }

    let body = '';
    req.on('data', (chunk) => {
      body += chunk.toString();
    });
    req.on('end', () => {
      if (!body) return resolve({});
      try {
        resolve(JSON.parse(body));
      } catch (error) {
        try {
          const params = new URLSearchParams(body);
          resolve(Object.fromEntries(params.entries()));
        } catch (parseError) {
          reject(parseError);
        }
      }
    });
    req.on('error', reject);
  });
}

module.exports = async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const data = await parseBody(req);
    const errors = validateContactSubmission(data);

    if (errors.length > 0) {
      return res.status(400).json({ error: errors.join(', ') });
    }

    const state = readStorage();
    state.contact.push({
      id: Date.now(),
      name: sanitizeInput(data.name),
      email: sanitizeInput(data.email),
      website: sanitizeInput(data.website),
      service: sanitizeInput(data.service),
      budget: sanitizeInput(data.budget),
      message: sanitizeInput(data.message),
      source: sanitizeInput(data.source),
      created_at: new Date().toISOString()
    });
    writeStorage(state);

    return res.status(200).json({ success: true, message: 'Contact form submitted successfully' });
  } catch (error) {
    console.error('Contact submission error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
};
