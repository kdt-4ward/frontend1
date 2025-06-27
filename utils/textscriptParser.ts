// utils/textscriptParser.ts

export function parseTextscript(message: string): string {
    return message
      .replace(/\[bold\](.*?)\[\/bold\]/g, '**$1**')
      .replace(/\[italic\](.*?)\[\/italic\]/g, '*$1*');
  }
  