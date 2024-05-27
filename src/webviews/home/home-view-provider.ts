import * as vscode from "vscode";
import { getNonce, replaceWebviewHtmlTokens } from "../utils";

const utf8TextDecoder = new TextDecoder("utf8");
const utf8TextEncoder = new TextEncoder();

export class HomeViewProvider implements vscode.WebviewViewProvider {
  public static readonly viewType = "publicdev.homeView";

  private _view?: vscode.WebviewView;

  constructor(private readonly extensionUri: vscode.Uri) {}

  public async resolveWebviewView(
    webviewView: vscode.WebviewView,
    context: vscode.WebviewViewResolveContext,
    _token: vscode.CancellationToken
  ) {
    this._view = webviewView;

    webviewView.webview.options = {
      // Allow scripts in the webview
      enableScripts: true,

      localResourceRoots: [this.getRootUri()],
    };

    webviewView.webview.html = await this.getHtmlForWebview(
      webviewView.webview
    );

    webviewView.webview.onDidReceiveMessage((data) => {
      switch (data.type) {
      }
    });
  }

  private getRootUri() {
    return this.extensionUri;
  }

  private async getHtmlForWebview(webview: vscode.Webview) {
    console.log(this.getRootUri());
    const uri = vscode.Uri.joinPath(
      this.getRootUri(),
      "dist/webviews/home/home.html"
    );

    const [bytes] = await Promise.all([vscode.workspace.fs.readFile(uri)]);
    const html = replaceWebviewHtmlTokens(utf8TextDecoder.decode(bytes), {
      cspSource: webview.cspSource,
      cspNonce: getNonce(),
    });

    return html;
  }
}
