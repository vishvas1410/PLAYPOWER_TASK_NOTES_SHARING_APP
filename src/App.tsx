import Editor from "./components/Editor/Editor";
import SideBar from "./components/SideBar/SideBar";
import { TodoProvider } from "./context/TodoContext";
function App() {
  return (
    <TodoProvider>
      <div className="app">
        <SideBar />
        <Editor />
      </div>
    </TodoProvider>
  );
}

export default App;
