import React from 'react';
import CodeMirror from '@uiw/react-codemirror';
import { sql } from '@codemirror/lang-sql';
import { oneDark } from '@codemirror/theme-one-dark';

const SqlEditor = ({ value, onChange, height = '200px', readOnly = false }) => {
  return (
    <CodeMirror
      value={value}
      height={height}
      extensions={[sql()]}
      theme={oneDark} // Using a predefined dark theme
      onChange={onChange}
      readOnly={readOnly}
      options={{
        lint: true, // Enable linting for SQL (basic syntax checking)
      }}
      basicSetup={{
        foldGutter: true,
        dropCursor: true,
        allowMultipleSelections: true,
        indentOnInput: true,
        syntaxHighlighting: true,
        autocompletion: true, // Enable basic autocompletion
        bracketMatching: true,
        closeBrackets: true,
        highlightActiveLine: true,
        highlightSelectionMatches: true,
        history: true,
        lineNumbers: true,
        drawSelection: true,
      }}
    />
  );
};

export default SqlEditor;
