import { defaultKeymap } from '@codemirror/commands';
import { sql } from '@codemirror/lang-sql';
import { Prec } from '@codemirror/state';
import { keymap, EditorView } from '@codemirror/view';
import CodeMirror from '@uiw/react-codemirror';
import PropTypes from 'prop-types'; // Import PropTypes

/**
 * @typedef {import('@codemirror/state').Extension} CodeMirrorExtension
 * @typedef {import('@uiw/react-codemirror').ReactCodeMirrorProps['theme']} CodeMirrorTheme
 */

/**
 * A React component that wraps CodeMirror for SQL editing.
 * It provides syntax highlighting for SQL, custom keymaps (Shift-Enter to execute),
 * and integrates with a theme.
 *
 * @param {object} props - The component's props.
 * @param {string} props.value - The current SQL query string.
 * @param {(value: string, viewUpdate: import('@codemirror/view').ViewUpdate) => void} props.onChange - Callback function triggered when the editor content changes.
 * @param {() => void} [props.onExecute] - Optional callback function triggered when Shift+Enter is pressed.
 * @param {string} [props.height='200px'] - The height of the editor.
 * @param {boolean} [props.readOnly=false] - Whether the editor is read-only.
 * @param {CodeMirrorTheme} [props.theme='light'] - The CodeMirror theme to use (e.g., 'light', 'dark', or a theme object).
 * @param {string} [props.'aria-label'] - ARIA label for accessibility.
 * @param {string} [props.'aria-labelledby'] - ARIA labelledby for accessibility.
 * @returns {JSX.Element} The SQL editor component.
 */
const SqlEditor = ({
  value,
  onChange,
  onExecute,
  height = '200px',
  readOnly = false,
  theme,
  'aria-label': ariaLabel,
  'aria-labelledby': ariaLabelledby, // Add aria-labelledby prop
}) => {
  const customKeymap = Prec.high(
    keymap.of([
      {
        key: 'Shift-Enter',
        run: () => {
          if (onExecute) {
            onExecute();
            return true;
          }
          return false;
        },
        preventDefault: true,
      },
    ])
  );

  return (
    <CodeMirror
      value={value}
      height={height}
      extensions={[
        sql(),
        keymap.of(defaultKeymap),
        customKeymap,
        EditorView.lineWrapping,
      ]}
      theme={theme}
      onChange={onChange}
      readOnly={readOnly}
      aria-label={ariaLabel}
      aria-labelledby={ariaLabelledby} // Pass aria-labelledby to CodeMirror
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

SqlEditor.propTypes = {
  value: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
  onExecute: PropTypes.func,
  height: PropTypes.string,
  readOnly: PropTypes.bool,
  theme: PropTypes.oneOfType([PropTypes.string, PropTypes.object]), // Theme can be a string or an editor theme object
  'aria-label': PropTypes.string,
  'aria-labelledby': PropTypes.string, // Add prop type for aria-labelledby
};

SqlEditor.defaultProps = {
  onExecute: null,
  height: '200px',
  readOnly: false,
  theme: 'light', // Or your preferred default theme
  'aria-label': undefined,
  'aria-labelledby': undefined, // Default aria-labelledby to undefined
};

export default SqlEditor;
