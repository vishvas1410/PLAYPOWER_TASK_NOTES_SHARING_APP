import {
  AlignCenter,
  AlignLeft,
  AlignRight,
  Bold,
  Italic,
  Underline,
} from "lucide-react";
import React, { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { TodoContextApi } from "../../context/TodoContext";
import useApi from "../../hooks/useApi";
import tippy from "tippy.js";
import "tippy.js/dist/tippy.css";

interface FormData {
  title: string;
  content: string;
}

interface HighlightData {
  term: string;
  description: string;
  todoId: string;
}

const Editor = () => {
  const { register, setValue } = useForm<FormData>();
  const { selectedTodo, handleUpdateTodo } = TodoContextApi();
  const contentRef = useRef<HTMLDivElement>(null);
  const [contentData, setContentData] = useState<any>("");
  const { handleFetchKeyTerms, response, isLoading } = useApi();

  // Load highlights from localStorage on component mount
  useEffect(() => {
    if (selectedTodo) {
      const savedHighlights = localStorage.getItem(
        `highlights-${selectedTodo.id}`
      );
      if (savedHighlights && contentRef.current) {
        const highlights: HighlightData[] = JSON.parse(savedHighlights);
        applyHighlights(highlights);
      }
    }
  }, [selectedTodo]);

  // Apply highlights and tooltips to the content
  const applyHighlights = (highlights: HighlightData[]) => {
    if (!contentRef.current) return;

    let content = contentRef.current.innerHTML;

    highlights.forEach(({ term, description }) => {
      const regex = new RegExp(`\\b${term}\\b`, "gi");
      content = content.replace(
        regex,
        `<span class="highlighted" data-tippy-content="${description}">${term}</span>`
      );
    });

    contentRef.current.innerHTML = content;

    // Initialize tooltips
    tippy(".highlighted", {
      theme: "custom",
      placement: "top",
      arrow: true,
    });
  };

  const handleHighlightContent = () => {
    if (!selectedTodo || !response) return;

    const highlights = response.map((item: any) => ({
      term: item.term,
      description: item.description,
      todoId: selectedTodo.id,
    }));

    // Save highlights to localStorage
    localStorage.setItem(
      `highlights-${selectedTodo.id}`,
      JSON.stringify(highlights)
    );

    // Apply highlights
    applyHighlights(highlights);
  };

  const handleCommand = (command: string, value: string = "") => {
    document.execCommand(command, false, value);
  };

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newTitle = e.target.value;
    setValue("title", newTitle);
    if (selectedTodo) {
      const updatedTodo = {
        ...selectedTodo,
        todo_title: newTitle,
      };
      handleUpdateTodo(updatedTodo);
    }
  };

  const handleContentChange = () => {
    if (contentRef.current && selectedTodo) {
      const newContent = contentRef.current.innerHTML;
      const pureContent = contentRef.current.textContent;
      setContentData(pureContent);
      const updatedTodo = {
        ...selectedTodo,
        content: newContent,
        isPinned: selectedTodo.isPinned,
      };

      setValue("content", newContent);
      handleUpdateTodo(updatedTodo);
    }
  };

  useEffect(() => {
    if (selectedTodo) {
      setValue("title", selectedTodo.todo_title);
      if (contentRef.current && selectedTodo) {
        const currentContent = contentRef.current.innerHTML;
        if (currentContent !== selectedTodo.content) {
          contentRef.current.innerHTML = selectedTodo.content || "";
        }
      }
    }
  }, [selectedTodo, setValue]);

  if (selectedTodo === null) {
    return null;
  }

  return (
    <div className="editor">
      <div className="editor-header">
        <input
          type="text"
          id="title"
          placeholder="Untitled Note"
          {...register("title")}
          onChange={handleTitleChange}
        />
      </div>
      <div className="editor-button">
        <div className="style-button">
          <button onClick={() => handleCommand("bold")}>
            <Bold color="black" className="icon" />
          </button>
          <button onClick={() => handleCommand("italic")}>
            <Italic color="black" className="icon" />
          </button>
          <button onClick={() => handleCommand("underline")}>
            <Underline color="black" className="icon" />
          </button>
        </div>
        <div className="alignment-button">
          <button onClick={() => handleCommand("justifyLeft")}>
            <AlignLeft color="black" className="icon" />
          </button>
          <button onClick={() => handleCommand("justifyCenter")}>
            <AlignCenter color="black" className="icon" />
          </button>
          <button onClick={() => handleCommand("justifyRight")}>
            <AlignRight color="black" className="icon" />
          </button>
        </div>
        <div className="font-size">
          <select
            name="fontsize"
            id="fontsize"
            onChange={(e) => handleCommand("fontSize", e.target.value)}
          >
            <option value="3">Normal</option>
            <option value="5">Large</option>
            <option value="7">Huge</option>
          </select>
        </div>
      </div>
      <div className="editor-content">
        <div
          ref={contentRef}
          className="editor-content-area"
          contentEditable
          onInput={handleContentChange}
          suppressContentEditableWarning={true}
        />
      </div>
      <button
        onClick={() => {
          handleFetchKeyTerms(contentData);
          handleHighlightContent();
        }}
        className="send-button"
        disabled={isLoading}
      >
        {isLoading ? "Loading..." : "Highlight Content"}
      </button>
    </div>
  );
};

export default Editor;
