import {
  ChangeEventHandler,
  FormEventHandler,
  useCallback,
  useState,
} from "react";
import clsx from "clsx";

type AddFormProps = {
  onCreate: (title: string) => Promise<void>;
};

export function AddForm({ onCreate }: AddFormProps) {
  const [title, setTitle] = useState("");
  const [loading, setLoading] = useState(false);

  const handle_change: ChangeEventHandler<HTMLInputElement> = useCallback(
    (e) => {
      setTitle(e.currentTarget.value);
    },
    [],
  );

  const handle_submit: FormEventHandler = async (e) => {
    e.preventDefault();

    setLoading(true);
    await onCreate(title);
    setLoading(false);
    setTitle("");
  };

  return (
    <form
      onSubmit={handle_submit}
      className="grid grid-cols-[1fr_auto] border border-slate-900 focus-within:shadow"
    >
      <label htmlFor="todo_title" className="sr-only">
        What do you need to do?
      </label>
      <div className="py-2 px-3 grid justify-stretch">
        <input
          id="todo_title"
          name="title"
          placeholder="What do you need to do?"
          value={title}
          onChange={handle_change}
          disabled={loading}
          className={clsx(
            "py-1 border-b border-transparent text-slate-900",
            "focus-visible:outline-none focus:border-slate-500",
            loading && "text-slate-700 bg-transparent",
          )}
        />
      </div>
      <button
        disabled={loading}
        className={clsx(
          "py-2 px-6 bg-slate-900 text-white",
          "focus-visible:outline-none group",
          loading && "bg-slate-700",
        )}
      >
        <span className="py-1 border-b border-transparent group-focus:border-slate-300">
          Add Task
        </span>
      </button>
    </form>
  );
}
