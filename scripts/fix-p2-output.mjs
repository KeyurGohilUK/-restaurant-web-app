import { readFileSync, writeFileSync } from 'node:fs';

const path = 'src/main.ts';
let source = readFileSync(path, 'utf8');

const helper = `type ElementOptions = {
  className?: string;
  text?: string;
  attributes?: Record<string, string>;
};

const createElement = <K extends keyof HTMLElementTagNameMap>(tagName: K, options: ElementOptions = {}) => {
  const element = document.createElement(tagName);
  if (options.className) element.className = options.className;
  if (options.text !== undefined) element.textContent = options.text;
  Object.entries(options.attributes ?? {}).forEach(([name, value]) => element.setAttribute(name, value));
  return element;
};`;

const duplicated = `${helper}\n\n${helper}`;
if (!source.includes(duplicated)) {
  throw new Error('Expected duplicated DOM helper was not found');
}
source = source.replace(duplicated, helper);

if (source.includes('innerHTML')) {
  throw new Error('Unsafe innerHTML remains in src/main.ts');
}

writeFileSync(path, source);
