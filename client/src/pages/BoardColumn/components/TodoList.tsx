import React from "react";
import { Todo } from '../models';
import SingleTodo from "./SingleTodo";
import { Droppable } from "react-beautiful-dnd";

type Props={
  todos: Todo[];
  setTodos: (value:Todo[]) => void;
  setCompletedTodos: (value:Todo[]) => void;
  CompletedTodos: Todo[];
  action:Todo[];
  setAction:(value:Todo[]) => void;
  commentTodo:Todo[];
  setCommentTodo:(value:Todo[]) => void;
  goodTodo:Todo[];
  setGoodTodo:(value:Todo[]) => void;
}

const TodoList= ({
  goodTodo,
  setGoodTodo,
  todos,
  setTodos,
  CompletedTodos,
  setCompletedTodos,
  action,
  setAction,
  setCommentTodo,
  commentTodo,
}:Props) => {
  return (
    <div className="container">
      <Droppable droppableId="TodosList">
        {(provided, snapshot) => (
          <div
            className={`todos ${snapshot.isDraggingOver ? "dragactive" : ""}`}
            ref={provided.innerRef}
            {...provided.droppableProps}
          >
            <span style={{textAlign:'center'}} className="todos__heading">Went well</span>
            {todos?.map((todo, index) => (
              <SingleTodo
                index={index}
                todos={todos}
                todo={todo}
                key={todo.id}
                setTodos={setTodos}
              />
            ))}
            {provided.placeholder}
          </div>
        )}
      </Droppable>
      <Droppable droppableId="TodosRemove">
        {(provided, snapshot) => (
          <div
            ref={provided.innerRef}
            {...provided.droppableProps}
            className={`todos  ${
              snapshot.isDraggingOver ? "dragcomplete" : "remove"
            }`}
          >
            <span style={{textAlign:'center'}} className="todos__heading">To Improve</span>
            {CompletedTodos?.map((todo, index) => (
              <SingleTodo
                index={index}
                todos={CompletedTodos}
                todo={todo}
                key={todo.id}
                setTodos={setCompletedTodos}
              />
            ))}
            {provided.placeholder}
          </div>
        )}
      </Droppable>
      <Droppable droppableId="TodosAction">
        {(provided, snapshot) => (
          <div
            ref={provided.innerRef}
            {...provided.droppableProps}
            className={`todos  ${
              snapshot.isDraggingOver ? "dragAction" : "action"
            }`}
          >
            <span style={{textAlign:'center'}} className="todos__heading">Action items</span>
            {action?.map((todo, index) => (
              <SingleTodo
                index={index}
                todos={action}
                todo={todo}
                key={todo.id}
                setTodos={setAction}
              />
            ))}
            {provided.placeholder}
          </div>
        )}
      </Droppable>
      <Droppable droppableId="TodosComment">
        {(provided, snapshot) => (
          <div
            ref={provided.innerRef}
            {...provided.droppableProps}
            className={`todos  ${
              snapshot.isDraggingOver ? "dragComment" : "comment"
            }`}
          >
            <span style={{textAlign:'center'}} className="todos__heading">Comment items</span>
            {commentTodo?.map((todo, index) => (
              <SingleTodo
                index={index}
                todos={commentTodo}
                todo={todo}
                key={todo.id}
                setTodos={setCommentTodo}
              />
            ))}
            {provided.placeholder}
          </div>
        )}
      </Droppable>
      <Droppable droppableId="TodosGood">
        {(provided, snapshot) => (
          <div
            ref={provided.innerRef}
            {...provided.droppableProps}
            className={`todos  ${
              snapshot.isDraggingOver ? "dragGood" : "good"
            }`}
          >
            <span style={{textAlign:'center'}} className="todos__heading">Good items</span>
            {goodTodo?.map((todo, index) => (
              <SingleTodo
                index={index}
                todos={goodTodo}
                todo={todo}
                key={todo.id}
                setTodos={setGoodTodo}
              />
            ))}
            {provided.placeholder}
          </div>
        )}
      </Droppable>
    </div>
  );
};

export default TodoList;