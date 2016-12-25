import * as React from 'react';

type CustomElementCtor = { new(...args: any[]): HTMLElement };
type ReactComponentCtor = { new(...args: any[]): React.Component<any, any> };
type Options = { React?: any, ReactDOM?: any };
export default function (CustomElementOrTagName: CustomElementCtor | string, opts: Options = {}): ReactComponentCtor;
