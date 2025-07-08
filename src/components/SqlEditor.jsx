import React from 'react';
import CodeMirror from '@uiw/react-codemirror';
import { sql } from '@codemirror/lang-sql';
import { keymap, EditorView } from '@codemirror/view';
import { defaultKeymap } from '@codemirror/commands';
import { Prec } from '@codemirror/state';

const SqlEditor = ({ value, onChange, onExecute, height = '200px', readOnly = false, theme }) => {
  const customKeymap = Prec.high(keymap.of([
    {
      key: "Shift-Enter",
      run: () => {
        if (onExecute) {
          onExecute();
          return true;
        }
        return false;
      },
      preventDefault: true,
    }
  ]));

  return (
    <CodeMirror
      value={value}
      height={height}
      extensions={[
        sql(),
        keymap.of(defaultKeymap),
        customKeymap,
        EditorView.lineWrapping
      ]}
      theme={theme}
      onChange={onChange}
      readOnly={readOnly}
      basicSetup={{
        lineNumbers: true,
        highlightActiveLine: true,
        highlightSelectionMatches: true,
        autocompletion: true,
        bracketMatching: true,
        closeBrackets: true,
        indentOnInput: true,
        foldGutter: true,
        dropCursor: true,
        history: true,
        drawSelection: true,
        syntaxHighlighting: true,
      }}
    />
  );
};

export default SqlEditor;
