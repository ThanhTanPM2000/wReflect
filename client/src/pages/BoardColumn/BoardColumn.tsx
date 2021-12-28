/* eslint-disable @typescript-eslint/no-unused-vars */
import React,{useState} from 'react'
import {DragDropContext, Droppable, Draggable,DropResult} from 'react-beautiful-dnd';
import InputField from "./components/InputField";
import TodoList from "./components/TodoList";
import { SmileTwoTone, HeartTwoTone, CheckCircleTwoTone } from '@ant-design/icons';
import { Todo } from "./models";

const boardColumn= ()=> {
  const [todo, setTodo] = useState<string>("");
  const [todos, setTodos] = useState<Array<Todo>>([]);
  const [CompletedTodos, setCompletedTodos] = useState<Array<Todo>>([]);
  const [action, setAction] = useState<Array<Todo>>([]);
  const [commentTodo, setCommentTodo] = useState<Array<Todo>>([]);
  const [goodTodo, setGoodTodo] = useState<Array<Todo>>([]);
  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();

    if (todo) {
      setTodos([...todos, { id: Date.now(), todo, isDone: false }]);
      setTodo("");
    }
  };

  const onDragEnd = (result: DropResult) => {
    const { destination, source } = result;
     console.log(result);
     if (!destination) { 
      return;
    }
     if (
      destination.droppableId === source.droppableId &&
      destination.index === source.index
    ) {
      return;
    }

    let add;
    const active = todos;
    const actionItem = action;
    const complete = CompletedTodos;
    const good = goodTodo;
    const comment = commentTodo;

    setCommentTodo(comment);
    setGoodTodo(good);
    setCompletedTodos(complete);
    setTodos(active);
    setAction(actionItem)
    // Source Logic
    if (source.droppableId === "TodosList") {
         add = active[source.index];
         active.splice(source.index, 1);
       } else if (source.droppableId === "TodosAction") {
         add = actionItem[source.index];
         actionItem.splice(source.index, 1);
       }else if (source.droppableId === "TodosRemove"){
         add = complete[source.index];
         complete.splice(source.index, 1);
       }else if (source.droppableId === "TodosGood"){
        add = good[source.index];
        good.splice(source.index, 1);
       }else{
        add = comment[source.index];
        comment.splice(source.index, 1);
  }
       // Destination Logic
       if (destination.droppableId === "TodosList") {
         active.splice(destination.index, 0, add);
       } else if(destination.droppableId === "TodosAction") {
         actionItem.splice(destination.index, 0, add);
       }else if(destination.droppableId === "TodosRemove") {
         complete.splice(destination.index, 0, add);
      }else if(destination.droppableId === "TodosGood") {
        good.splice(destination.index, 0, add);
      }else{
        comment.splice(destination.index, 0, add);
    }
};

  return (
      <div className="boardColumn site-layout-background" style={{minHeight:`100%`}}>
    <DragDropContext onDragEnd={onDragEnd}>
      <InputField todo={todo} setTodo={setTodo} handleAdd={handleAdd} />
        <TodoList
          todos={todos}
          setTodos={setTodos}
          action={action}
          setAction={setAction}
          CompletedTodos={CompletedTodos}
          setCompletedTodos={setCompletedTodos}
          goodTodo={goodTodo}
          setGoodTodo={setGoodTodo}
          commentTodo={commentTodo}
          setCommentTodo={setCommentTodo}
        />
        
    </DragDropContext>
      </div>
  );
};
export default boardColumn;