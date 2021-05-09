// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
const { idText } = require('typescript');
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

    ruby = editor.document.languageId === 'ruby';
    hashtag = args.text === '#';

    if (ruby && hashtag) {
      return vscode.commands.executeCommand('default:type', args).then(() => {
        if (isInString(editor)) autocomplete(editor, args);
      });
    }
    return vscode.commands.executeCommand('default:type', args);
  });

  const isInString = (editor) => {
    const { text } = editor.document.lineAt(editor.selection.active.line);
    const { character } = editor.selection.active;

    const line = [
      text.substring(0, character),
      text.substring(character, text.length),
    ];

    const quotes = line.map(
      (string) => string.split('').filter((c) => c === '"').length
    );

    return quotes[0] % 2 === 1 && quotes[1] % 2 === 1;
  };

  const autocomplete = (editor, args) => {
    // console.log(editor.edit);
    editor.edit((builder) => {
      builder.replace(editor.selection, '{}');
    });

    cursor(editor);
  };

  const cursor = (editor) => {
    const position = editor.selection.active;
    const offset = position.with(position.line, position.character + 1);
    editor.selection = new vscode.Selection(offset, offset);
  };
}

// this method is called when your extension is deactivated
function deactivate() {}

module.exports = {
  activate,
  deactivate,
};
