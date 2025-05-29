import nlp from "compromise";
import {
  parse,
  parseISO,
  addDays,
  setHours,
  setMinutes,
  isValid,
} from "date-fns";

export interface ParsedTaskData {
  name: string;
  assignee?: string;
  dueDate?: Date;
  priority: "P1" | "P2" | "P3" | "P4";
}

/**
 * Parse a natural language string and extract task information
 * @param input - Natural language task description
 * @returns Parsed task data
 */
export function parseNaturalLanguageTask(input: string): ParsedTaskData {
  const doc = nlp(input);

  // Extract priority
  const priority = extractPriority(input);

  // Extract assignee
  const assignee = extractAssignee(input, doc);

  // Extract due date and time
  const dueDate = extractDueDate(input);

  // Extract task name (remove assignee and date/time info)
  const taskName = extractTaskName(input, assignee, dueDate);

  return {
    name: taskName,
    assignee,
    dueDate,
    priority,
  };
}

function extractPriority(input: string): "P1" | "P2" | "P3" | "P4" {
  const priorityMatch = input.match(/\b(P[1-4])\b/i);
  if (priorityMatch) {
    return priorityMatch[1].toUpperCase() as "P1" | "P2" | "P3" | "P4";
  }
  return "P3"; // Default priority
}

function extractAssignee(input: string, doc: any): string | undefined {
  // Look for patterns like "to John", "for Mary", "assign to Alice"
  const assigneePatterns = [
    /\b(?:to|for|assign(?:ed)?\s+to)\s+([A-Z][a-z]+(?:\s+[A-Z][a-z]+)*)/i,
    /\b([A-Z][a-z]+(?:\s+[A-Z][a-z]+)*)\s+(?:should|will|must|needs?\s+to)/i,
  ];

  for (const pattern of assigneePatterns) {
    const match = input.match(pattern);
    if (match) {
      return match[1].trim();
    }
  }

  // Try to extract people using compromise
  const people = doc.people();
  if (people.json().length > 0) {
    return people.json()[0].text;
  }

  return undefined;
}

function extractDueDate(input: string): Date | undefined {
  const now = new Date();

  // Common date/time patterns
  const patterns = [
    // "tomorrow 5pm", "today 3pm"
    {
      regex:
        /\b(today|tomorrow)\s+(?:at\s+)?(\d{1,2})(?::(\d{2}))?\s*(am|pm)\b/i,
      handler: (match: RegExpMatchArray) => {
        const [, day, hour, minute = "0", ampm] = match;
        let targetDate =
          day.toLowerCase() === "tomorrow" ? addDays(now, 1) : now;
        let hour24 = parseInt(hour);

        if (ampm.toLowerCase() === "pm" && hour24 !== 12) hour24 += 12;
        if (ampm.toLowerCase() === "am" && hour24 === 12) hour24 = 0;

        targetDate = setHours(targetDate, hour24);
        targetDate = setMinutes(targetDate, parseInt(minute));
        return targetDate;
      },
    },

    // "11pm 20th June", "5pm June 20th"
    {
      regex:
        /\b(\d{1,2})(?::(\d{2}))?\s*(am|pm)\s+(?:on\s+)?(\d{1,2})(?:st|nd|rd|th)?\s+(January|February|March|April|May|June|July|August|September|October|November|December)\b/i,
      handler: (match: RegExpMatchArray) => {
        const [, hour, minute = "0", ampm, day, month] = match;
        let hour24 = parseInt(hour);

        if (ampm.toLowerCase() === "pm" && hour24 !== 12) hour24 += 12;
        if (ampm.toLowerCase() === "am" && hour24 === 12) hour24 = 0;

        const dateStr = `${now.getFullYear()}-${getMonthNumber(
          month
        )}-${day.padStart(2, "0")}T${hour24
          .toString()
          .padStart(2, "0")}:${minute.padStart(2, "0")}:00`;
        const targetDate = parseISO(dateStr);

        // If the date is in the past, assume next year
        if (targetDate < now) {
          const nextYearDate = parseISO(
            `${now.getFullYear() + 1}-${getMonthNumber(month)}-${day.padStart(
              2,
              "0"
            )}T${hour24.toString().padStart(2, "0")}:${minute.padStart(
              2,
              "0"
            )}:00`
          );
          return nextYearDate;
        }

        return targetDate;
      },
    },

    // "by 11pm", "before 5pm"
    {
      regex: /\b(?:by|before)\s+(\d{1,2})(?::(\d{2}))?\s*(am|pm)\b/i,
      handler: (match: RegExpMatchArray) => {
        const [, hour, minute = "0", ampm] = match;
        let hour24 = parseInt(hour);

        if (ampm.toLowerCase() === "pm" && hour24 !== 12) hour24 += 12;
        if (ampm.toLowerCase() === "am" && hour24 === 12) hour24 = 0;

        let targetDate = setHours(now, hour24);
        targetDate = setMinutes(targetDate, parseInt(minute));

        // If time has passed today, assume tomorrow
        if (targetDate < now) {
          targetDate = addDays(targetDate, 1);
        }

        return targetDate;
      },
    },

    // "next Monday", "this Friday"
    {
      regex:
        /\b(?:next|this)\s+(Monday|Tuesday|Wednesday|Thursday|Friday|Saturday|Sunday)\b/i,
      handler: (match: RegExpMatchArray) => {
        const [, dayName] = match;
        const daysOfWeek = [
          "Sunday",
          "Monday",
          "Tuesday",
          "Wednesday",
          "Thursday",
          "Friday",
          "Saturday",
        ];
        const targetDayIndex = daysOfWeek.indexOf(dayName);
        const currentDayIndex = now.getDay();

        let daysToAdd = targetDayIndex - currentDayIndex;
        if (daysToAdd <= 0) daysToAdd += 7; // Next occurrence

        return addDays(now, daysToAdd);
      },
    },
  ];

  for (const pattern of patterns) {
    const match = input.match(pattern.regex);
    if (match) {
      const date = pattern.handler(match);
      if (isValid(date)) {
        return date;
      }
    }
  }

  return undefined;
}

function extractTaskName(
  input: string,
  assignee?: string,
  dueDate?: Date
): string {
  let taskName = input;

  // Remove priority markers
  taskName = taskName.replace(/\bP[1-4]\b/gi, "").trim();

  // Remove assignee information
  if (assignee) {
    const assigneePatterns = [
      new RegExp(`\\b(?:to|for|assign(?:ed)?\\s+to)\\s+${assignee}\\b`, "gi"),
      new RegExp(`\\b${assignee}\\s+(?:should|will|must|needs?\\s+to)`, "gi"),
      new RegExp(`\\b${assignee}\\b`, "gi"),
    ];

    for (const pattern of assigneePatterns) {
      taskName = taskName.replace(pattern, "").trim();
    }
  }

  // Remove date/time information
  const dateTimePatterns = [
    /\b(?:by|before|at|on)\s+\d{1,2}(?::\d{2})?\s*(?:am|pm)\b/gi,
    /\b(?:today|tomorrow)\s+(?:at\s+)?\d{1,2}(?::\d{2})?\s*(?:am|pm)\b/gi,
    /\b\d{1,2}(?::\d{2})?\s*(?:am|pm)\s+(?:on\s+)?\d{1,2}(?:st|nd|rd|th)?\s+(?:January|February|March|April|May|June|July|August|September|October|November|December)\b/gi,
    /\b(?:next|this)\s+(?:Monday|Tuesday|Wednesday|Thursday|Friday|Saturday|Sunday)\b/gi,
    /\b\d{1,2}(?:st|nd|rd|th)?\s+(?:January|February|March|April|May|June|July|August|September|October|November|December)\b/gi,
  ];

  for (const pattern of dateTimePatterns) {
    taskName = taskName.replace(pattern, "").trim();
  }

  // Clean up extra whitespace and connecting words
  taskName = taskName.replace(/\s+/g, " ").trim();
  taskName = taskName.replace(/^(?:and|or|but|then)\s+/i, "").trim();

  return taskName || "Untitled Task";
}

function getMonthNumber(monthName: string): string {
  const months: { [key: string]: string } = {
    january: "01",
    february: "02",
    march: "03",
    april: "04",
    may: "05",
    june: "06",
    july: "07",
    august: "08",
    september: "09",
    october: "10",
    november: "11",
    december: "12",
  };
  return months[monthName.toLowerCase()] || "01";
}
