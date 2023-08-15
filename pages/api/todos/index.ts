import type { NextApiRequest, NextApiResponse } from "next";

import { ServerResponse, fail, json } from "./helpers";
import { getTodoDatabase, type Todo } from "$/lib/data";

export type TodoServerResponse = ServerResponse<Todo[] | Todo>;

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<TodoServerResponse>
) {
  const response = await handleRequest(req);

  return res.status(response.status).json(response);
}

async function handleRequest(req: NextApiRequest): Promise<TodoServerResponse> {
  if (req.method?.toUpperCase() === "GET") {
    try {
      const db = getTodoDatabase();

      const todos = db.getAll();

      return json(todos);
    } catch (err) {
      console.error(err);
      return fail(500, "Unable to load from database");
    }
  }

  if (req.method?.toUpperCase() === "PUT") {
    const title = req.body.title;

    if (typeof title !== "string") {
      return fail(400, "No title provided");
    }

    try {
      const db = getTodoDatabase();

      const todo = db.create(title);

      return json(todo);
    } catch (err) {
      console.error(err);
      return fail(500, "Unable to create todo");
    }
  }

  return fail(405, "Method not allowed");
}
