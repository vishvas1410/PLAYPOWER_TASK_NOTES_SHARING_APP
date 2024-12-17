import React, { createContext, useContext, useEffect, useState } from "react";

interface Todo {
  id: string;
  todo_title: string;
  content: string;
  date: string;
  isPinned: boolean;
}

interface TodoContextType {
  todoList: Todo[];
  selectedTodo: Todo | null;
  handleAddTodo: () => void;
  handleSelectedTodo: (id: string) => void;
  handleUpdateTodo: (updatedTodo: Todo) => void;
  handleDeleteTodo: (id: string) => void;
  handlePinTodo: (id: string) => void;
  isPinned: boolean;
}

const TodoContext = createContext<TodoContextType | undefined>(undefined);

export const TodoProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [todoList, setTodoList] = useState<Todo[]>(() => {
    const storedTodos = localStorage.getItem("todoList");
    return storedTodos ? JSON.parse(storedTodos) : [];
  });
  const [selectedTodo, setSelectedTodo] = useState<Todo | null>(null);
  const [isPinned, setIsPinned] = useState<boolean>(false);
  useEffect(() => {
    localStorage.setItem("todoList", JSON.stringify(todoList));
  }, [todoList]);

  const handleAddTodo = () => {
    const newTodo = {
      id: Date.now().toString(),
      todo_title: "Untitled Note",
      content: "",
      date: new Date().toISOString().split("T")[0],
      isPinned: false,
    };
    setTodoList((prevTodo) => {
      const updatedTodoList = [newTodo, ...prevTodo];
      localStorage.setItem("todoList", JSON.stringify(updatedTodoList));
      return updatedTodoList;
    });
    setSelectedTodo(newTodo);
  };

  const handleSelectedTodo = (id: string) => {
    const todo = todoList.find((todo) => todo.id === id);
    setSelectedTodo(todo || null);
  };

  const handleUpdateTodo = (updatedTodo: Todo) => {
    setTodoList((prevTodo) =>
      prevTodo.map((todo) => (todo.id === updatedTodo.id ? updatedTodo : todo))
    );
  };

  const handleDeleteTodo = (id: string) => {
    setTodoList((prevTodo) => {
      const updatedTodoList = prevTodo.filter((todo) => todo.id !== id);
      localStorage.setItem("todoList", JSON.stringify(updatedTodoList));

      if (updatedTodoList.length > 0) {
        setSelectedTodo(updatedTodoList[0]);
      } else {
        setSelectedTodo(null);
      }

      return updatedTodoList;
    });
  };

  const handlePinTodo = (id: string) => {
    setTodoList((prev: Todo[]) => {
      const updatedTodo = prev.map((todo) =>
        todo.id === id ? { ...todo, isPinned: !todo.isPinned } : todo
      );
      localStorage.setItem("todoList", JSON.stringify(updatedTodo));
      setIsPinned(!isPinned);

      return updatedTodo;
    });
  };
  return (
    <TodoContext.Provider
      value={{
        todoList,
        selectedTodo,
        handleAddTodo,
        handleSelectedTodo,
        handleUpdateTodo,
        handleDeleteTodo,
        handlePinTodo,
        isPinned,
      }}
    >
      {children}
    </TodoContext.Provider>
  );
};

export const TodoContextApi = () => {
  const context = useContext(TodoContext);
  if (!context) {
    throw new Error("useTodo must be used within TodoProvider");
  }
  return context;
};
