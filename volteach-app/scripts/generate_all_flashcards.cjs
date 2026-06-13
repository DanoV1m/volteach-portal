const fs = require('fs');
const path = require('path');

const coursesPath = path.join(__dirname, '../src/data/courses.ts');
const enrichmentPath = path.join(__dirname, '../src/data/enrichment.ts');

function sanitizeJsonString(str) {
  let clean = str.replace(/```json/gi, '').replace(/```/g, '').trim();
  let result = '';
  let inString = false;
  
  for (let i = 0; i < clean.length; i++) {
    let char = clean[i];
    
    if (char === '"' && clean[i - 1] !== '\\') {
      inString = !inString;
      result += char;
      continue;
    }
    
    if (inString) {
      if (char === '\\') {
        let next = clean[i + 1] || '';
        let isValidEscape = false;
        if (['"', '\\', '/'].includes(next)) {
          isValidEscape = true;
        } else if (['b', 'f', 'n', 'r', 't'].includes(next)) {
          let afterNext = clean[i + 2] || '';
          let isNextLetter = /[a-zA-Z]/.test(afterNext);
          if (!isNextLetter) {
            isValidEscape = true;
          }
        } else if (next === 'u') {
          let hex = clean.substring(i + 2, i + 6);
          if (/^[0-9a-fA-F]{4}$/.test(hex)) {
            isValidEscape = true;
          }
        }
        
        if (isValidEscape) {
          result += '\\' + next;
          i++;
        } else {
          result += '\\\\';
        }
      } else if (char === '\n') {
        result += '\\n';
      } else if (char === '\r') {
        result += '\\r';
      } else if (char === '\t') {
        result += '\\t';
      } else if (char.charCodeAt(0) < 32) {
        result += '\\u' + char.charCodeAt(0).toString(16).padStart(4, '0');
      } else {
        result += char;
      }
    } else {
      result += char;
    }
  }
  
  return result;
}

function regexParseJSON(str) {
  let text = str.trim();
  const keys = ['course', 'explain', 'formula', 'example', 'quizQuestion', 'quizAnswer'];
  const result = {};
  
  for (let i = 0; i < keys.length; i++) {
    const currentKey = keys[i];
    const keyPattern = new RegExp(`"${currentKey}"\\s*:\\s*"`);
    const match = text.match(keyPattern);
    if (!match) continue;
    
    const valStart = match.index + match[0].length;
    let minNextIndex = text.length;
    
    for (let j = 0; j < keys.length; j++) {
      if (j === i) continue;
      const nextKey = keys[j];
      const nextKeyPattern = new RegExp(`,\\s*"${nextKey}"\\s*:`);
      const nextMatch = text.match(nextKeyPattern);
      if (nextMatch && nextMatch.index > valStart && nextMatch.index < minNextIndex) {
        minNextIndex = nextMatch.index;
      }
    }
    
    if (minNextIndex === text.length) {
      const lastBrace = text.lastIndexOf('}');
      if (lastBrace > valStart) {
        minNextIndex = lastBrace;
      }
    }
    
    let rawVal = text.substring(valStart, minNextIndex).trim();
    if (rawVal.endsWith('"')) {
      rawVal = rawVal.slice(0, -1);
    } else if (rawVal.endsWith('",')) {
      rawVal = rawVal.slice(0, -2);
    } else if (rawVal.endsWith(',')) {
      rawVal = rawVal.trim().slice(0, -1).trim();
      if (rawVal.endsWith('"')) {
        rawVal = rawVal.slice(0, -1);
      }
    }
    
    result[currentKey] = rawVal;
  }
  
  return result;
}

async function main() {
  let apiKey = process.env.NVIDIA_API_KEY || process.env.OPENROUTER_API_KEY;
  let apiUrl = 'https://openrouter.ai/api/v1/chat/completions';
  let targetModel = process.env.OPENROUTER_MODEL || "google/gemini-2.5-flash:free";

  if (process.env.NVIDIA_API_KEY) {
    console.log('Using NVIDIA NIM API...');
    apiUrl = 'https://integrate.api.nvidia.com/v1/chat/completions';
    targetModel = process.env.NVIDIA_MODEL || 'meta/llama-3.3-70b-instruct';
  } else {
    console.log('Using OpenRouter API...');
  }

  if (!apiKey) {
    console.error('Error: Neither NVIDIA_API_KEY nor OPENROUTER_API_KEY environment variable is set!');
    process.exit(1);
  }

  console.log(`Selected Model: ${targetModel}\n`);

  console.log('Starting flashcard generation (Resuming from where it stopped)...');
  
  const coursesContent = fs.readFileSync(coursesPath, 'utf8');
  const coursesRegex = /\{\s*\"icon\":.*?\"title\":\s*\"(.*?)\".*?\"topics\":\s*\[(.*?)\]\s*\}/g;
  
  const allTopicsMap = new Map();
  let match;
  while ((match = coursesRegex.exec(coursesContent)) !== null) {
    const courseTitle = match[1];
    const topicsRaw = match[2];
    const topics = topicsRaw.split(',').map(s => s.replace(/\"/g, '').trim()).filter(Boolean);
    for (const t of topics) {
      if (!allTopicsMap.has(t)) allTopicsMap.set(t, courseTitle);
    }
  }
  
  let enrichmentContent = fs.readFileSync(enrichmentPath, 'utf8');
  const existingTopics = new Set();
  const existingMatches = [...enrichmentContent.matchAll(/\"(.*?)\"\s*:\s*\{/g)];
  for (const m of existingMatches) {
    existingTopics.add(m[1]);
  }
  
  const missingTopics = [];
  for (const [topic, course] of allTopicsMap.entries()) {
    if (!existingTopics.has(topic)) missingTopics.push({ topic, course });
  }
  
  console.log(`Found ${missingTopics.length} missing topics to generate.`);

  if (missingTopics.length === 0) {
    console.log('All topics are already populated! Exiting.');
    return;
  }

  let successCount = 0;
  for (let i = 0; i < missingTopics.length; i++) {
    const { topic, course } = missingTopics[i];
    console.log(`\n[${i+1}/${missingTopics.length}] Generating for topic: "${topic}" (Course: ${course}) using ${targetModel}...`);
    
    let retries = 3;
    let success = false;
    
    while (retries > 0 && !success) {
      try {
        const prompt = `אתה מרצה בכיר באוניברסיטה. צור הסבר מקיף, אקדמי ומבוסס לנושא "${topic}" מתוך הקורס "${course}".
        בכל פעם שאתה משתמש בפקודות LaTeX כמו \\frac, חובה להשתמש בלוכסן כפול (\\\\frac) כדי שה-JSON יהיה תקין. 
        החזר אך ורק אובייקט JSON חוקי עם המפתחות: course, explain, formula, example, quizQuestion, quizAnswer. ללא שום טקסט נוסף מחוץ ל-JSON.`;

        const res = await fetch(apiUrl, {
          method: 'POST',
          headers: { 
            'Content-Type': 'application/json', 
            'Authorization': `Bearer ${apiKey}`
          },
          body: JSON.stringify({
            model: targetModel,
            messages: [
              { role: "user", content: prompt }
            ],
            response_format: { type: "json_object" },
            max_tokens: 4000
          })
        });

        const data = await res.json();

        if (!res.ok) {
          if (data.error) throw new Error(`${data.error.code || res.status} - ${data.error.message}`);
          throw new Error(`HTTP ${res.status}`);
        }

        const rawText = data.choices?.[0]?.message?.content;
        if (!rawText) throw new Error(`Received empty response from OpenRouter`);

        const sanitized = sanitizeJsonString(rawText);
        let parsed;
        try {
          parsed = JSON.parse(sanitized);
        } catch (jsonErr) {
          console.log(`  -> JSON parsing failed, attempting Regex recovery...`);
          parsed = regexParseJSON(rawText);
          if (!parsed.course || !parsed.explain || !parsed.quizQuestion) {
            throw jsonErr;
          }
        }

        const newEntryCode = `  "${topic}": {
    course: "${parsed.course || course}",
    explain: ${JSON.stringify(parsed.explain)},
    formula: ${JSON.stringify(parsed.formula)},
    example: ${JSON.stringify(parsed.example)},
    quizQuestion: ${JSON.stringify(parsed.quizQuestion)},
    quizAnswer: ${JSON.stringify(parsed.quizAnswer)}
  },`;

        const anchor = 'export const topicKnowledge: Record<string, TopicKnowledge> = {';
        if (enrichmentContent.includes(anchor)) {
          enrichmentContent = enrichmentContent.replace(anchor, anchor + '\n' + newEntryCode);
          fs.writeFileSync(enrichmentPath, enrichmentContent, 'utf8');
          successCount++;
          console.log(`  -> Successfully saved: ${topic}`);
          success = true;
        } else {
          console.error('  -> Could not find the anchor point in enrichment.ts');
          process.exit(1);
        }

      } catch (err) {
        console.error(`  -> Attempt failed: ${err.message || err}`);
        retries--;
        if (retries > 0) {
          console.log(`  -> Retrying in 10 seconds... (${retries} retries left)`);
          await new Promise(r => setTimeout(r, 10000));
        } else {
          console.error(`  -> Max retries reached for "${topic}". Skipping to next.`);
        }
      }
    }
    
    // Wait 3 seconds between requests for OpenRouter limits
    await new Promise(r => setTimeout(r, 3000));
  }

  console.log(`\nGeneration complete. Successfully added ${successCount} flashcards.`);
}

main().catch(console.error);
