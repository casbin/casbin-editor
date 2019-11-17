import exampleModel from './casbin-mode/example-model';
import examplePolicy from './casbin-mode/example-policy';
import exampleRequest from './casbin-mode/example-request';

export const DEFAULT_MODEL = 'basic';

export enum Persist {
  MODEL,
  POLICY,
  REQUEST,
  CUSTOM_FUNCTION
}

function getKey(persist: Persist, modelName: string) {
  return `${modelName.toUpperCase()}_${Persist[persist]}`;
}

export function getSelectedModel() {
  const v = window.localStorage.getItem(Persist.MODEL.toString());
  return v ? v : DEFAULT_MODEL;
}

export function setSelectedModel(value: string) {
  window.localStorage.setItem(Persist[Persist.MODEL], value);
}

export function get(persist: Persist, modelName = DEFAULT_MODEL) {
  const data = window.localStorage.getItem(getKey(persist, modelName));

  if (data) {
    return data;
  }
  switch (persist) {
    case Persist.MODEL:
      return (exampleModel as any)[modelName];
    case Persist.POLICY:
      return (examplePolicy as any)[modelName];
    case Persist.REQUEST:
      return (exampleRequest as any)[modelName];
    case Persist.CUSTOM_FUNCTION:
      return `var fns = {}`;
  }
}

export function set(persist: Persist, text: string) {
  const modelName = getSelectedModel() || DEFAULT_MODEL;
  window.localStorage.setItem(getKey(persist, modelName), text);
}

export function reset(modelName: string) {
  for (const m in Persist) {
    if (!Persist.hasOwnProperty(m)) {
      continue;
    }
    const index = parseInt(m, 10);
    if (!isNaN(index)) {
      continue;
    }
    window.localStorage.removeItem(getKey(index, modelName));
  }
}
