export type Todo = {
  id: number;
  title: string;
  complete: boolean;
};

export function isTodo(maybeTodo: any): maybeTodo is Todo {
  return (
    typeof maybeTodo.id === "number" &&
    typeof maybeTodo.title === "string" &&
    typeof maybeTodo.complete === "boolean"
  );
}
