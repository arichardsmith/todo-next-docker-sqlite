import type { NextApiRequest, NextApiResponse } from "next";

import { ServerResponse, fail, json } from "./helpers";
import { getTodoDatabase, type Todo } from "$/lib/data";

export type SingleTodoServerResponse = ServerResponse<Todo | undefined>;

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<SingleTodoServerResponse>
) {
  const response = await handleRequest(req);

  return res.status(response.status).json(response);
}

async function handleRequest(
  req: NextApiRequest
): Promise<SingleTodoServerResponse> {
  const id = paramToNumber(req.query.id);

  if (Number.isNaN(id)) {
    return fail(404, "Unknown todo id");
  }

  try {
    const db = getTodoDatabase();

    if (req.method?.toUpperCase() === "PATCH") {
      const body = req.body;

      if (!isValidTodoBody(body)) {
        return fail(400, "Invalid todo");
      }

      const res = db.update({
        id,
        ...body,
      });

      // Assume the id had no matches if update doesn't change any rows
      if (!res) {
        return fail(404, "Todo not found");
      }

      return json(res);
    }

    if (req.method?.toUpperCase() === "DELETE") {
      db.delete(id);
      return json(undefined);
    }

    return fail(405, "Method not allowed");
  } catch (err) {
    console.error(err);

    return fail(500, "Unable to update database");
  }
}

function paramToNumber(input: string | string[] | undefined): number {
  if (input === undefined) {
    return Number.NaN;
  }

  if (Array.isArray(input)) {
    // Shortcut to first entry

    return parseInt(input[0]);
  }

  return parseInt(input);
}

function isValidTodoBody(
  input: any
): input is { title: string; complete: boolean } {
  return typeof input.title === "string" && typeof input.complete === "boolean";
}
