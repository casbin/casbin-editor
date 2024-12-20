export function parseABACRequest(line: string): any[] {
    let value: string | Record<string, any> = '';
    let objectToken = 0;
    let parseToObject = false;
    const request = [];
  
    for (let i = 0; i < line.length; i++) {
      if (objectToken === 0 && line[i] === ',') {
        if (parseToObject) {
          value = eval(`(${value})`);
        }
        if (typeof value === 'string') {
          value = value.trim();
        }
        // @ts-ignore
        request.push(value);
  
        value = '';
        parseToObject = false;
        continue;
      }
  
      value += line[i];
  
      if (line[i] === '{') {
        parseToObject = true;
        objectToken++;
        continue;
      }
  
      if (line[i] === '}') {
        objectToken--;
      }
    }
  
    if (objectToken !== 0) {
      throw new Error(`invalid request ${line}`);
    }
  
    if (value) {
      if (parseToObject) {
        value = eval(`(${value})`);
      }
      if (typeof value === 'string') {
        value = value.trim();
      }
      // @ts-ignore
      request.push(value);
    }
  
    return request;
  }
  