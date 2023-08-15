import {
  useState,
  type MouseEventHandler,
  ChangeEventHandler,
  FormEventHandler,
} from "react";
import {
  FontAwesomeIcon,
  FontAwesomeIconProps,
} from "@fortawesome/react-fontawesome";
import { faFloppyDisk, faXmark } from "@fortawesome/free-solid-svg-icons";
import clsx from "clsx";

import { Todo } from "$/lib/data";

type TodoItemProps = {
  todo: Todo;
  onToggle: (new_state: boolean) => Promise<void>;
  onEdit: (new_title: string) => Promise<void>;
  onDelete: () => Promise<void>;
};

export function TodoItem({ todo, onDelete, onToggle, onEdit }: TodoItemProps) {
  const [todo_value, set_todo_value] = useState(todo.title);
  const has_edit = todo.title !== todo_value;

  const [loading, do_action] = useAsyncAction();

  const handle_change: ChangeEventHandler<HTMLInputElement> = (e) => {
    set_todo_value(e.currentTarget.value);
  };

  const handle_check: ChangeEventHandler<HTMLInputElement> = async (e) => {
    do_action(() => onToggle(!todo.complete));
  };

  const handle_delete_click: MouseEventHandler<HTMLButtonElement> = (e) => {
    e.preventDefault();

    do_action(() => onDelete());
  };

  const handle_submit: FormEventHandler = (e) => {
    e.preventDefault();

    do_action(() => onEdit(todo_value));
  };

  return (
    <li
      className={clsx(
        "text-slate-900 px-3 py-2 focus-within:outline focus-within:outline-slate-900",
        "transition-opacity",
        loading && "opacity-50"
      )}
    >
      <form
        className="grid grid-cols-[auto_1fr_auto_auto] gap-4 items-center"
        onSubmit={handle_submit}
      >
        <Checkbox checked={todo.complete} onChange={handle_check} />
        <input
          type="text"
          value={todo_value}
          onChange={handle_change}
          className="py-1 border-b border-b-transparent focus:outline-none focus:border-b-slate-500"
        />
        {has_edit && <IconButon type="submit" icon={faFloppyDisk} />}
        <div className="col-start-4">
          <IconButon icon={faXmark} onClick={handle_delete_click} />
        </div>
      </form>
    </li>
  );
}

type ButtonProps = {
  icon: FontAwesomeIconProps["icon"];
  type?: "submit";
  onClick?: MouseEventHandler<HTMLButtonElement>;
};

function IconButon({ icon, onClick, type }: ButtonProps) {
  const handle_click = typeof onClick === "function" ? onClick : () => void 0;

  return (
    <button
      onClick={handle_click}
      type={type}
      className={clsx(
        "py-1 px-2 text-slate-500 border-b border-b-transparent",
        "focus:outline-none focus:border-b-slate-500"
      )}
    >
      <FontAwesomeIcon icon={icon} />
    </button>
  );
}

type CheckboxProps = {
  checked: boolean;
  onChange: ChangeEventHandler<HTMLInputElement>;
};

function Checkbox({ onChange, checked }: CheckboxProps) {
  return (
    <input
      type="checkbox"
      checked={checked}
      onChange={onChange}
      className="accent-slate-900 cursor-pointer focus:outline focus:outline-slate-500 focus:outline-offset-4"
    />
  );
}

function useAsyncAction() {
  const [loading, set_loading] = useState(false);

  async function do_action<T>(action: () => Promise<T>): Promise<T> {
    set_loading(true);
    try {
      const res = await action();
      return res;
    } finally {
      set_loading(false);
    }
  }

  return [loading, do_action] as const;
}
