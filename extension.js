// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
const vscode = require('vscode');

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed

/**
 * @param {vscode.ExtensionContext} context
 */
function activate(context) {
  console.log('hashtag-ruby enabled');
  // Use the console to output diagnostic information (console.log) and errors (console.error)
  // This line of code will only be executed once when your extension is activated
  // console.log('Congratulations, your extension "hashtag" is now active!');

  vscode.commands.registerCommand('type', (args) => {
    const editor = vscode.window.activeTextEditor;

    const ruby = editor.document.languageId === 'ruby';
    const erb = editor.document.languageId === 'erb';
    const hashtag = args.text === '#';

    if ((ruby || erb) && hashtag) {
      const selection = getSelection(editor);

      return vscode.commands.executeCommand('default:type', args).then(() => {
        if (isInString(editor)) autocomplete(editor, selection);
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

  const getSelection = (editor) => {
    const { text } = editor.document.lineAt(editor.selection.active.line);
    const start = editor.selection.start.character;
    const end = editor.selection.end.character;

    return text.substring(start, end);
  };

  const autocomplete = (editor, selection) => {
    editor.edit((builder) => {
      builder.replace(editor.selection, `{${selection}}`);
    });

    cursor(editor, selection.length);
  };

  const cursor = (editor, offset = 0) => {
    const position = editor.selection.active;
    const move = position.with(
      position.line,
      position.character + (offset + 1)
    );

    editor.selection = new vscode.Selection(move, move);
  };
}

// this method is called when your extension is deactivated
function deactivate() {}

module.exports = {
  activate,
  deactivate,
};
