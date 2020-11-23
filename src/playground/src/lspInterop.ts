import { editor, languages } from 'monaco-editor/esm/vs/editor/editor.api';

let interop;

export function initializeInterop(self): Promise<boolean> {
  return new Promise<boolean>((resolve, reject) => {
    self['BicepInitialize'] = (newInterop) => {
      interop = newInterop;
      resolve(true);
    }
  
    const test = require('../../Bicep.Wasm/bin/Release/net5.0/wwwroot/_framework/blazor.webassembly.js');  
  });
}

export function getSemanticTokensLegend(): languages.SemanticTokensLegend {
  return interop.invokeMethod('GetSemanticTokensLegend');
}

export function getSemanticTokens(content: string): languages.SemanticTokens {
  return interop.invokeMethod('GetSemanticTokens', content);
}

export async function sendLspData(jsonRpcRequest: string) {
  return await interop.invokeMethodAsync('SendLspDataAsync', jsonRpcRequest);
}

export function onLspData(callback: (data: string | Buffer) => void) {
  self['ReceiveLspData'] = callback;
}

export function compile(content: string): string {
  return interop.invokeMethod('Compile', content);
}

export function decompile(jsonContent: string): string {
  const { bicepFile, error } = interop.invokeMethod('Decompile', jsonContent);

  if (error) {
    throw error;
  }

  return bicepFile;
}