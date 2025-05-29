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
