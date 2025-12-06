import React, { forwardRef, useEffect, useLayoutEffect, useRef } from "react";
import Quill from "quill";
import "quill/dist/quill.snow.css";

const Editor = forwardRef(
  ({ readOnly, value, defaultValue, onTextChange, onSelectionChange }, ref) => {
    const containerRef = useRef(null);
    const quillRef = useRef(null);

    const onTextChangeRef = useRef(onTextChange);
    const onSelectionChangeRef = useRef(onSelectionChange);

    useLayoutEffect(() => {
      onTextChangeRef.current = onTextChange;
      onSelectionChangeRef.current = onSelectionChange;
    });

    // initialize quill
    useEffect(() => {
      const container = containerRef.current;
      const editorContainer = container.appendChild(
        container.ownerDocument.createElement("div")
      );

      const quill = new Quill(editorContainer, {
        theme: "snow",
      });

      quillRef.current = quill;
      if (ref) ref.current = quill;

      // Set initial value
      if (defaultValue) {
        if (typeof defaultValue === "string") {
          quill.clipboard.dangerouslyPasteHTML(defaultValue);
        } else {
          quill.setContents(defaultValue);
        }
      }

      quill.on("text-change", (...args) => {
        const html = quill.root.innerHTML;
        onTextChangeRef.current?.(html, ...args);
      });

      quill.on("selection-change", (...args) => {
        onSelectionChangeRef.current?.(...args);
      });

      return () => {
        if (ref) ref.current = null;
        quillRef.current = null;
        container.innerHTML = "";
      };
    }, [ref]);

    // sync external value into editor
    useEffect(() => {
      const quill = quillRef.current;
      if (quill && value !== undefined && value !== quill.root.innerHTML) {
        const selection = quill.getSelection(); 
        quill.clipboard.dangerouslyPasteHTML(value || "");
        if (selection) quill.setSelection(selection);
      }
    }, [value]);

    // handle readonly state
    useEffect(() => {
      quillRef.current?.enable(!readOnly);
    }, [readOnly]);

    return <div ref={containerRef} className="h-90"></div>;
  }
);

Editor.displayName = "Editor";

export default Editor;
