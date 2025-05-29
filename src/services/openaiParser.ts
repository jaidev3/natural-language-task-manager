import OpenAI from "openai";

export interface ParsedTaskData {
  name: string;
  assignee?: string;
  dueDate?: Date;
  priority: "P1" | "P2" | "P3" | "P4";
}

const systemPrompt = `
You are a helpful assistant that parses natural language tasks.
You will be given a task in natural language.
You will need to parse the task into a JSON object with the following fields:
- name: The name of the task
- assignee: The assignee of the task
- dueDate: The due date of the task
- priority: The priority of the task (P1, P2, P3, P4), P3 is the default
`;

export async function parseNaturalLanguageTaskAi(
  input: string,
  apiKey: string
): Promise<ParsedTaskData> {
  const openai = new OpenAI({
    apiKey: apiKey,
    dangerouslyAllowBrowser: true,
  });

  const response = await openai.chat.completions.create({
    model: "gpt-4o",
    response_format: { type: "json_object" },
    messages: [
      {
        role: "system",
        content: systemPrompt,
      },
      {
        role: "user",
        content: input,
      },
    ],
  });

  const parsedTask = response.choices[0].message.content;
  return JSON.parse(parsedTask) as ParsedTaskData;
}

export async function parseMeetingTranscript(
  transcript: string,
  apiKey: string
): Promise<ParsedTaskData[]> {
  const openai = new OpenAI({
    apiKey: apiKey,
    dangerouslyAllowBrowser: true,
  });

  const meetingSystemPrompt = `
You are a helpful assistant that extracts tasks from meeting transcripts.
You will be given a meeting transcript and need to identify all actionable tasks.
Extract each task as a JSON object with the following fields:
- name: The task description/what needs to be done
- assignee: The person assigned to the task (if mentioned)
- dueDate: The due date/deadline (if mentioned, parse to ISO string format)
- priority: The priority level (P1, P2, P3, P4). Default to P3 unless urgency is indicated.

Return a JSON object with a "tasks" array containing all extracted tasks. Look for patterns like:
- "[Person] you take [task] by [deadline]"
- "[Person] please [action] by [time]"
- "[Task] needs to be done by [person] [deadline]"
- Any other actionable items with clear assignments

If no tasks are found, return {"tasks": []}.

Example format:
{
  "tasks": [
    {
      "name": "Finish landing page",
      "assignee": "Aman",
      "dueDate": "2024-01-20T22:00:00.000Z",
      "priority": "P3"
    }
  ]
}
`;

  const response = await openai.chat.completions.create({
    model: "gpt-4o",
    response_format: { type: "json_object" },
    messages: [
      {
        role: "system",
        content: meetingSystemPrompt,
      },
      {
        role: "user",
        content: `Extract all tasks from this meeting transcript: ${transcript}`,
      },
    ],
  });

  const result = response.choices[0].message.content;
  const parsed = JSON.parse(result);

  // Handle both array format and object with tasks array
  if (Array.isArray(parsed)) {
    return parsed as ParsedTaskData[];
  } else if (parsed.tasks && Array.isArray(parsed.tasks)) {
    return parsed.tasks as ParsedTaskData[];
  } else {
    return [];
  }
}
