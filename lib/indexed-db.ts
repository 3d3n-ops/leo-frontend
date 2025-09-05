import { DBSchema, openDB } from "idb";

interface ChatMessage {
  id: number;
  threadId: number;
  role: "user" | "assistant";
  content: string;
}

export interface ChatThread {
  id: number;
  threadId: number;
  name: string;
  topic?: string;
  prompt?: string;
  createdAt: Date;
  lastMessageAt: Date;
}

interface ChatDB extends DBSchema {
  messages: {
    key: number;
    value: ChatMessage;
    indexes: { "threadId": number };
  };
  threads: {
    key: number;
    value: ChatThread;
    indexes: { "threadId": number };
  };
}

async function getDb() {
  return await openDB<ChatDB>("chat-db", 2, {
    upgrade(db, oldVersion) {
      if (oldVersion < 1) {
        const messagesStore = db.createObjectStore("messages", {
          keyPath: "id",
          autoIncrement: true,
        });
        messagesStore.createIndex("threadId", "threadId");
      }
      
      if (oldVersion < 2) {
        const threadsStore = db.createObjectStore("threads", {
          keyPath: "id",
          autoIncrement: true,
        });
        threadsStore.createIndex("threadId", "threadId");
      }
    },
  });
}

export async function addMessage(message: Omit<ChatMessage, "id">) {
  const db = await getDb();
  await db.add("messages", message as ChatMessage);
  
  // Update thread's lastMessageAt
  const threads = await db.getAllFromIndex("threads", "threadId", message.threadId);
  if (threads.length > 0) {
    const thread = threads[0];
    await db.put("threads", {
      ...thread,
      lastMessageAt: new Date(),
    });
  }
}

export async function getMessages(threadId: number) {
  const db = await getDb();
  return await db.getAllFromIndex("messages", "threadId", threadId);
}

export async function createThread(threadId: number, name: string, topic?: string, prompt?: string) {
  const db = await getDb();
  const now = new Date();
  
  // Check if thread already exists
  const existingThreads = await db.getAllFromIndex("threads", "threadId", threadId);
  if (existingThreads.length > 0) {
    return existingThreads[0];
  }
  
  const thread: Omit<ChatThread, "id"> = {
    threadId,
    name,
    topic,
    prompt,
    createdAt: now,
    lastMessageAt: now,
  };
  
  return await db.add("threads", thread as ChatThread);
}

export async function getThreads() {
  const db = await getDb();
  const threads = await db.getAll("threads");
  return threads.sort((a, b) => b.lastMessageAt.getTime() - a.lastMessageAt.getTime());
}

export async function getThread(threadId: number) {
  const db = await getDb();
  const threads = await db.getAllFromIndex("threads", "threadId", threadId);
  return threads[0] || null;
}

export async function updateThreadName(threadId: number, name: string) {
  const db = await getDb();
  const threads = await db.getAllFromIndex("threads", "threadId", threadId);
  if (threads.length > 0) {
    const thread = threads[0];
    await db.put("threads", {
      ...thread,
      name,
    });
  }
}