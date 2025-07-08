import React from 'react';
import CodeMirror from '@uiw/react-codemirror';
import { sql } from '@codemirror/lang-sql';
import { oneDark } from '@codemirror/theme-one-dark'; // Assuming this is the dark theme
import { basicLight } from '@codemirror/theme-basic'; // Attempting to import a light theme
import { keymap, EditorView } from '@codemirror/view';
import { defaultKeymap } from '@codemirror/commands';
import { Prec } from '@codemirror/state';

const SqlEditor = ({ value, onChange, onExecute, height = '200px', readOnly = false, theme }) => {
  const customKeymap = Prec.high(keymap.of([
    {
      key: "Shift-Enter",
      run: (view) => { // Added view argument
        if (onExecute) {
          onExecute();
          return true; // Indicate that the key event was handled
        }
        return false; // Let other keymaps handle it
      },
      preventDefault: true, // Added to be safe
    }
  ]));

  return (
    <CodeMirror
      value={value}
      height={height}
      extensions={[
        sql(),
        keymap.of(defaultKeymap), // Ensure default keymap is present
        customKeymap, // Add our custom keymap with higher precedence
        EditorView.lineWrapping
      ]}
      theme={theme} // Using a predefined dark theme
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
