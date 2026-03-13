import React from "react";
import Editor from "@monaco-editor/react";

const SQLEditor = ({ value, onChange }) => {
  return (
    <div className="sql-editor" data-testid="sql-editor-container">
      <Editor
        height="280px"
        defaultLanguage="sql"
        value={value}
        onChange={(nextValue) => onChange(nextValue || "")}
        options={{
          minimap: { enabled: false },
          fontSize: 14,
          lineNumbers: "on",
          scrollBeyondLastLine: false,
          automaticLayout: true,
        }}
      />
    </div>
  );
};

export default SQLEditor;
