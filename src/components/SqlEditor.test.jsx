import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { materialLight } from '@uiw/codemirror-theme-material';
import PropTypes from 'prop-types'; // Import PropTypes for the mock
import React from 'react';
import { vi } from 'vitest';

import SqlEditor from './SqlEditor';

// Mock @codemirror/state and @codemirror/view to control the structure of extensions
vi.mock('@codemirror/state', async () => {
  const actual = await vi.importActual('@codemirror/state');
  return {
    ...actual,
    Prec: {
      high: (ext) => ({
        _isPrecHighMock: true, // Custom marker for Prec.high mock
        inner: ext,
        toString: () => `MockedPrec.high(${ext.toString()})`,
      }),
      // Ensure other Prec levels are available if needed, or mock them similarly
      default: (ext) => ({ _isPrecDefaultMock: true, inner: ext }),
      low: (ext) => ({ _isPrecLowMock: true, inner: ext }),
    },
  };
});

vi.mock('@codemirror/view', async () => {
  const actual = await vi.importActual('@codemirror/view');
  return {
    ...actual, // Spread actual to keep other exports like EditorView
    keymap: {
      ...actual.keymap, // Spread actual.keymap if it has other utilities
      of: (bindings) => ({
        _isKeymapOfMock: true, // Custom marker for keymap.of mock
        bindings: bindings,
        toString: () => `MockedKeymap.of(${JSON.stringify(bindings)})`,
      }),
    },
  };
});

// Mock @uiw/react-codemirror
vi.mock('@uiw/react-codemirror', () => {
  // Define the mock component inside the factory to avoid hoisting issues
  const MockCodeMirrorComponent = ({
    value,
    onChange,
    extensions,
    theme,
    height,
    readOnly,
  }) => {
    const [internalValue, setInternalValue] = React.useState(value);

    React.useEffect(() => {
      setInternalValue(value);
    }, [value]);

    const handleChange = (event) => {
      const newValue = event.target.value;
      setInternalValue(newValue);
      if (onChange) {
        onChange(newValue, null); // Pass null for the viewUpdate, as the original does
      }
    };

    let hasExecuteKeymap = false;
    if (extensions && Array.isArray(extensions)) {
      hasExecuteKeymap = extensions.some(
        (ext) =>
          ext &&
          ext._isPrecHighMock &&
          ext.inner &&
          ext.inner._isKeymapOfMock &&
          Array.isArray(ext.inner.bindings) &&
          ext.inner.bindings.some((binding) => binding.key === 'Shift-Enter')
      );
    }

    return (
      <div
        data-testid='mock-codemirror'
        style={{ height }}
        data-theme={
          typeof theme === 'object' ? theme.constructor.name : String(theme)
        }
        data-has-execute-keymap={String(hasExecuteKeymap)}
      >
        <textarea
          value={internalValue}
          onChange={handleChange}
          readOnly={readOnly}
          data-testid='mock-editor-input'
        />
      </div>
    );
  };

  // Add PropTypes to the mock component
  MockCodeMirrorComponent.propTypes = {
    value: PropTypes.string.isRequired,
    onChange: PropTypes.func.isRequired,
    extensions: PropTypes.array, // Looser type for mock, or more specific if needed
    theme: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
    height: PropTypes.string,
    readOnly: PropTypes.bool,
  };

  MockCodeMirrorComponent.defaultProps = {
    extensions: [],
    theme: 'light',
    height: '200px',
    readOnly: false,
  };

  return {
    __esModule: true,
    default: MockCodeMirrorComponent,
  };
});

describe('SqlEditor Component', () => {
  // Reset mocks before each test to ensure clean state, especially for module-level mocks
  beforeEach(() => {
    vi.resetModules(); // Important when mocking modules like this
    // Re-import dependencies if necessary, or ensure mocks are re-applied.
    // Vitest typically handles re-application of vi.mock calls defined at top level.
  });

  it('renders with initial value', () => {
    render(<SqlEditor value='SELECT * FROM users;' onChange={() => {}} />);
    const editorInput = screen.getByTestId('mock-editor-input');
    expect(editorInput.value).toBe('SELECT * FROM users;');
  });

  it('calls onChange with the full updated value', async () => {
    const handleChange = vi.fn();
    render(<SqlEditor value='' onChange={handleChange} />);
    const editorInput = screen.getByTestId('mock-editor-input');
    await userEvent.type(editorInput, 'SELECT name');
    expect(editorInput.value).toBe('SELECT name');
    expect(handleChange).toHaveBeenCalled();
    expect(handleChange).toHaveBeenLastCalledWith('SELECT name', null);
  });

  it('respects the readOnly prop', () => {
    render(<SqlEditor value='SELECT 1;' onChange={() => {}} readOnly={true} />);
    const editorInput = screen.getByTestId('mock-editor-input');
    expect(editorInput).toHaveAttribute('readOnly');
  });

  it('applies height prop', () => {
    render(<SqlEditor value='' onChange={() => {}} height='300px' />);
    expect(screen.getByTestId('mock-codemirror')).toHaveStyle('height: 300px');
  });

  it('applies theme prop', () => {
    render(<SqlEditor value='' onChange={() => {}} theme={materialLight} />);
    expect(screen.getByTestId('mock-codemirror')).toHaveAttribute(
      'data-theme',
      materialLight.constructor.name
    );
  });

  // Since customKeymap is ALWAYS included, this test should reflect that.
  // The keymap's RUN function is conditional on onExecute, not its presence in extensions.
  it('always includes a Shift-Enter keymap configuration', () => {
    // Test with onExecute provided
    const { getByTestId, rerender } = render(
      <SqlEditor value='' onChange={() => {}} onExecute={vi.fn()} />
    );
    expect(getByTestId('mock-codemirror')).toHaveAttribute(
      'data-has-execute-keymap',
      'true'
    );

    // Test without onExecute provided
    rerender(<SqlEditor value='' onChange={() => {}} />);
    expect(getByTestId('mock-codemirror')).toHaveAttribute(
      'data-has-execute-keymap',
      'true'
    );
  });
});
