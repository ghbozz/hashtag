// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
const vscode = require('vscode');

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed

/**
 * @param {vscode.ExtensionContext} context
 */
function activate(context) {
  // Use the console to output diagnostic information (console.log) and errors (console.error)
  // This line of code will only be executed once when your extension is activated
  // console.log('Congratulations, your extension "hashtag" is now active!');

  vscode.commands.registerCommand('type', (args) => {
    const editor = vscode.window.activeTextEditor;

    if (shouldInterpolate(editor, args)) {
      return vscode.commands
        .executeCommand('default:type', { text: '#{}' })
        .then(() => {
          setPosition(editor);
        });
    }
    return vscode.commands.executeCommand('default:type', args);
  });

  const setPosition = (editor) => {
    const position = editor.selection.active;
    const newPosition = position.with(position.line, position.character - 1);
    editor.selection = new vscode.Selection(newPosition, newPosition);
  };

  const shouldInterpolate = (editor, args) => {
    startOfLine(editor);
    return editor.document.languageId === 'ruby' && args.text === '#';
  };

  const startOfLine = (editor) => {
    const { text } = editor.document.lineAt(editor.selection.active.line);
    const { character } = editor.selection.active;
    return true;
  };
}

// this method is called when your extension is deactivated
function deactivate() {}

module.exports = {
  activate,
  deactivate,
};
