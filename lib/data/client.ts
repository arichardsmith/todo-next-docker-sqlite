import { Todo } from ".";
import { isTodo } from "./types";

export async function createTodo(title: string): Promise<Todo> {
  const res = await jsonRequest("/api/todos", {
    method: "PUT",
    ...jsonRequestInit({ title }),
  });

  assertIsTodo(res.data);

  return res.data;
}

export async function updateTodo(new_todo: Todo): Promise<Todo> {
  const res = await jsonRequest(`/api/todos/${new_todo.id}`, {
    method: "PATCH",
    ...jsonRequestInit(new_todo),
  });

  assertIsTodo(res.data);

  return res.data;
}

export async function deleteTodo(id: number) {
  await jsonRequest(`/api/todos/${id}`, {
    method: "DELETE",
  });
}

async function jsonRequest(target: string, init: RequestInit): Promise<any> {
  const res = await fetch(target, {
    ...init,
    headers: {
      ...(init.headers ?? {}),
      accept: "application/json",
    },
  });

  if (!res.ok) {
    const data = safeParseJSON(await res.text());

    throw new APIError(res.status, data?.errors?.join(", ") ?? res.statusText);
  }

  return await res.json();
}

class APIError extends Error {
  status: number;

  constructor(status: number, message: string) {
    super(message);
    this.status = status;
  }
}

/**
 * Parse JSON, but return undefined if the parse fails instead of erroring
 */
function safeParseJSON(content: string): any | undefined {
  try {
    return JSON.parse(content);
  } catch (e) {
    return undefined;
  }
}

function jsonRequestInit(data: any) {
  return {
    headers: {
      "content-type": "application/json",
    },
    body: JSON.stringify(data),
  };
}

function assertIsTodo(maybeTodo: any): asserts maybeTodo is Todo {
  if (!isTodo(maybeTodo)) {
    throw new Error("Malformed todo");
  }
}
