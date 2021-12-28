import React, { useRef } from "react";
import "./styles.css";

interface Props {
  todo: string;
  setTodo: (value:string) => void;
  handleAdd: (e: React.FormEvent) => void;
}

const InputField = ({ todo, setTodo, handleAdd }:Props) => {
  const inputRef = useRef<HTMLInputElement>(null);

  return (
    <form
      className="input"
      onSubmit={(e) => {
        handleAdd(e);
        inputRef.current?.blur();
      }}
    >
      <input
        type="text"
        placeholder="Type your comment here"
        value={todo}
        ref={inputRef}
        onChange={(e) => setTodo(e.target.value)}
        className="input__box"
      />
      <button type="submit" className="input_submit">
        Add
      </button>
    </form>
  );
};

export default InputField;