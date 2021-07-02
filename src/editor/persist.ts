import { defaultCustomConfig, example, ModelKind } from './casbin-mode/example';

export const DEFAULT_MODEL: ModelKind = 'basic';

export enum Persist {
  MODEL,
  POLICY,
  REQUEST,
  CUSTOM_FUNCTION
}

function getKey(persist: Persist, modelName: string) {
  return `${modelName.toUpperCase()}_${Persist[persist]}`;
}

export function getSelectedModel(): ModelKind {
  const v = window.localStorage.getItem(Persist[Persist.MODEL].toString());
  return (v ? v : DEFAULT_MODEL) as ModelKind;
}

export function setSelectedModel(value: string) {
  window.localStorage.setItem(Persist[Persist.MODEL], value);
}

export function get(persist: Persist, modelName: ModelKind = DEFAULT_MODEL) {
  const data = window.localStorage.getItem(getKey(persist, modelName));

  if (data) {
    return data;
  }

  const m = example[modelName];
  switch (persist) {
    case Persist.MODEL:
      return m.model;
    case Persist.POLICY:
      return m.policy;
    case Persist.REQUEST:
      return m.request;
    case Persist.CUSTOM_FUNCTION:
      return m.customConfig ? m.customConfig : defaultCustomConfig;
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
    window.localStorage.removeItem(getKey(index, modelName));
  }
}
