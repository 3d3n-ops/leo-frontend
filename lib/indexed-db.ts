// Only import idb on the client side
let idb: typeof import("idb") | null = null;

if (typeof window !== "undefined") {
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  idb = require("idb");
}

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

// Removed unused ChatDB interface

async function getDb() {
  if (typeof window === "undefined" || !idb) {
    throw new Error("IndexedDB is only available in the browser");
  }
  
  return await idb.openDB("chat-db", 2, {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    upgrade(db: any, oldVersion: number) {
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
  if (typeof window === "undefined") {
    return;
  }
  
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
  if (typeof window === "undefined") {
    return [];
  }
  
  const db = await getDb();
  return await db.getAllFromIndex("messages", "threadId", threadId);
}

export async function createThread(threadId: number, name: string, topic?: string, prompt?: string) {
  if (typeof window === "undefined") {
    return null;
  }
  
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
  if (typeof window === "undefined") {
    return [];
  }
  
  const db = await getDb();
  const threads = await db.getAll("threads");
  return threads.sort((a: ChatThread, b: ChatThread) => b.lastMessageAt.getTime() - a.lastMessageAt.getTime());
}

export async function getThread(threadId: number) {
  if (typeof window === "undefined") {
    return null;
  }
  
  const db = await getDb();
  const threads = await db.getAllFromIndex("threads", "threadId", threadId);
  return threads[0] || null;
}

export async function deleteThread(threadId: number) {
  if (typeof window === "undefined") {
    return;
  }
  
  const db = await getDb();
  
  // Find the thread by threadId and delete it
  const threads = await db.getAllFromIndex("threads", "threadId", threadId);
  if (threads.length > 0) {
    await db.delete("threads", threads[0].id);
  }
  
  // Delete all messages for this thread
  const messages = await db.getAllFromIndex("messages", "threadId", threadId);
  for (const message of messages) {
    await db.delete("messages", message.id);
  }
}

export async function updateThreadName(threadId: number, name: string) {
  if (typeof window === "undefined") {
    return;
  }
  
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