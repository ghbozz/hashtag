// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
const vscode = require('vscode');

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed

/**
 * @param {vscode.ExtensionContext} context
 */
function activate(context) {
  vscode.commands.registerCommand('type', (args) => {
    if (args.text === '#') {
      return vscode.commands
        .executeCommand('default:type', { text: '#{}' })
        .then(() => {
          setPosition();
        });
    }
    return vscode.commands.executeCommand('default:type', args);
  });

  const setPosition = () => {
    const editor = vscode.window.activeTextEditor;
    const position = editor.selection.active;
    const newPosition = position.with(position.line, position.character - 1);
    editor.selection = new vscode.Selection(newPosition, newPosition);
  };
}

// this method is called when your extension is deactivated
function deactivate() {}

module.exports = {
  activate,
  deactivate,
};
