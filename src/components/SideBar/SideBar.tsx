import { File, Pin, PinOff, PlusCircle, Trash2 } from "lucide-react";
import { TodoContextApi } from "../../context/TodoContext";

const SideBar = () => {
  const {
    handleAddTodo,
    todoList,
    selectedTodo,
    handleSelectedTodo,
    handleDeleteTodo,
    handlePinTodo,
  } = TodoContextApi();

  return (
    <div className="sidebar">
      <div className="sidebar-header">
        <button className="add-button" onClick={handleAddTodo}>
          <PlusCircle />
          <span>Add Todo</span>
        </button>
      </div>

      <div className="todo-container">
        {todoList.some((item) => item.isPinned) ? (
          <>
            <h2 className="todo-section-title">Pinned Todo</h2>
            <div className="todo-list">
              {todoList
                .filter((item) => item.isPinned)
                .map((item) => (
                  <div
                    className={`todo-card ${
                      selectedTodo?.id === item.id ? "selected" : ""
                    }`}
                    key={item.id}
                    onClick={() => handleSelectedTodo(item.id)}
                  >
                    <div className={`todo-card-header`}>
                      <File size={20} color="blue" />
                      <h3>{item.todo_title}</h3>
                      <Trash2
                        color="red"
                        onClick={() => handleDeleteTodo(item.id)}
                      />
                      {item.isPinned ? (
                        <PinOff
                          onClick={() => handlePinTodo(item.id)}
                          className={`${item.isPinned ? "active" : "inactive"}`}
                        />
                      ) : (
                        <Pin
                          onClick={() => handlePinTodo(item.id)}
                          className={`${item.isPinned ? "active" : "inactive"}`}
                        />
                      )}
                    </div>
                    <p className="todo-card-description">{item.date}</p>
                  </div>
                ))}
            </div>
          </>
        ) : (
          <div style={{ textAlign: "center" }}>
            <p>
              {todoList.some((item) => item.isPinned) &&
                "No Pinned Notes found"}
            </p>
          </div>
        )}

        <h2 className="todo-section-title">All Notes</h2>

        <div className="todo-list">
          {todoList.some((item) => !item.isPinned) ? (
            <>
              <div className="todo-list">
                {todoList
                  .filter((item) => !item.isPinned)
                  .map((item) => (
                    <div
                      className={`todo-card ${
                        selectedTodo?.id === item.id ? "selected" : ""
                      }`}
                      key={item.id}
                      onClick={() => handleSelectedTodo(item.id)}
                    >
                      <div className={`todo-card-header`}>
                        <File size={20} color="blue" />
                        <h3>{item.todo_title}</h3>
                        <Trash2
                          color="red"
                          onClick={() => handleDeleteTodo(item.id)}
                        />
                        <Pin onClick={() => handlePinTodo(item.id)} />
                      </div>
                      <p className="todo-card-description">{item.date}</p>
                    </div>
                  ))}
              </div>
            </>
          ) : (
            <div style={{ textAlign: "center" }}>
              <p>No Notes found</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SideBar;
