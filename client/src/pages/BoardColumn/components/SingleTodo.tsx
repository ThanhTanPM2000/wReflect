import React, { useEffect, useState } from "react";
import { useRef } from "react";
import { EditOutlined,DeleteOutlined,CheckOutlined} from '@ant-design/icons';
import { Todo } from "../models";
import {Draggable} from "react-beautiful-dnd";

type Props = {
    index: number;  
  todo: Todo;
  todos: Todo[];
  setTodos: (value:Todo[]) => void ;
  };

  const SingleTodo =({ index, todo, todos, setTodos }:Props) => {
  
  const [edit, setEdit] = useState(false);
  const [editTodo, setEditTodo] = useState(todo.todo);

  const inputRef = useRef<HTMLInputElement>(null);
  useEffect(() => {
    inputRef.current?.focus();
  }, [edit]);

  const handleEdit = (e: React.FormEvent, id: number) => {
    e.preventDefault();
    setTodos(
      todos.map((todo) => (todo.id === id ? { ...todo, todo: editTodo } : todo))
    );
    setEdit(false);
  };

  const handleDelete = (id: number) => {
    setTodos(todos.filter((todo) => todo.id !== id));
  };

 

  return (
    <Draggable draggableId={todo.id.toString()} index={index}>
      {(provided, snapshot) => (
        <form
          onSubmit={(e) => handleEdit(e, todo.id)}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          ref={provided.innerRef}
          className={`todos__single ${snapshot.isDragging ? "drag" : ""}`}
        >
          {edit ? (
            <input
              value={editTodo}
              onChange={(e) => setEditTodo(e.target.value)}
              className="todos__single--text"
              ref={inputRef}
            />
          ) : todo.isDone ? (
            <s className="todos__single--text">{todo.todo}</s>
          ) : (
            <span className="todos__single--text">{todo.todo}</span>
          )}
          <div>
            <span
              className="icon"
              onClick={() => {
                if (!edit && !todo.isDone) {
                  setEdit(!edit);
                }
              }}
            >
              <EditOutlined />
            </span>
            <span className="icon" onClick={() => handleDelete(todo.id)}>
            <DeleteOutlined />
            </span>
           
          </div>
        </form>
      )}
    </Draggable>
  );
};

export default SingleTodo;