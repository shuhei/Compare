import type { Middleware, Store, Action } from 'redux';
import { Observable, Operator } from 'rxjs';
// import { Observable } from 'rxjs/Observable';
// import { Operator } from 'rxjs/Operator';

declare module 'redux-observable' {
  declare type Processor =
    (action$: ActionsObservable, store: Store) => Observable<Action>;

  declare function reduxObservable(processor?: Processor): Middleware;

  // FIXME: ActionsObservable's methods are not checked properly...
  // FIXME: <T: Action> doesn't work somehow.
  declare class ActionsObservable<T: Object> extends Observable<T> {
    constructor(actionsSubject: Observable<T>): void;

    lift(operator: Operator<Action, T>): ActionsObservable<Action>;

    ofType(...key: any[]): ActionsObservable<T>;
  }
}
