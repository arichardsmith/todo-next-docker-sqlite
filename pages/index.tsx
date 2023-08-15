import { useState } from "react";
import { Roboto } from "next/font/google";

import { Todo, getTodoDatabase } from "$/lib/data";

import { AddForm } from "$/components/AddForm";
import { Seperator } from "$/components/Seperator";
import { TodoItem } from "$/components/TodoItem";
import { createTodo, deleteTodo, updateTodo } from "$/lib/data/client";

const roboto = Roboto({ weight: "400", subsets: ["latin"] });

type Props = {
  todos: Todo[];
};

export async function getServerSideProps(): Promise<{ props: Props }> {
  const db = getTodoDatabase();

  const todos = db.getAll();

  return {
    props: {
      todos,
    },
  };
}

export default function App({ todos }: Props) {
  const [todolist, update_todolist] = useState(todos);

  const handle_create = async (title: string) => {
    const new_todo = await createTodo(title);

    update_todolist((prev) => [...prev, new_todo]);
  };

  const handle_toggle = async (id: number, new_state: boolean) => {
    const current_todo = todolist.find((todo) => todo.id === id);

    if (!current_todo) {
      return;
    }

    const new_todo = {
      ...current_todo,
      complete: new_state,
    };

    await updateTodo(new_todo);

    update_todolist((prev) => {
      const idx = prev.findIndex((todo) => todo.id === new_todo.id);

      return [...prev.slice(0, idx), new_todo, ...prev.slice(idx + 1)];
    });
  };

  const handle_edit = async (id: number, new_title: string) => {
    const current_todo = todolist.find((todo) => todo.id === id);

    if (!current_todo) {
      return;
    }

    const new_todo = {
      ...current_todo,
      title: new_title,
    };

    await updateTodo(new_todo);

    update_todolist((prev) => {
      const idx = prev.findIndex((todo) => todo.id === new_todo.id);

      return [...prev.slice(0, idx), new_todo, ...prev.slice(idx + 1)];
    });
  };

  const handle_delete = async (id: number) => {
    await deleteTodo(id);

    update_todolist((prev) => prev.filter((todo) => todo.id !== id));
  };

  return (
    <main
      className={`flex min-h-screen flex-col gap-8 p-24 ${roboto.className}`}
    >
      <AddForm onCreate={handle_create} />
      <Seperator />
      <ul>
        {todolist.map((todo) => (
          <TodoItem
            key={todo.id}
            todo={todo}
            onToggle={(new_state) => handle_toggle(todo.id, new_state)}
            onEdit={(new_title) => handle_edit(todo.id, new_title)}
            onDelete={() => handle_delete(todo.id)}
          />
        ))}
      </ul>
    </main>
  );
}
