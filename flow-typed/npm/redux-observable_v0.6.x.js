import type { Middleware, MiddlewareAPI, Action } from 'redux';
import { Observable, Operator } from 'rxjs';
// import { Observable } from 'rxjs/Observable';
// import { Operator } from 'rxjs/Operator';

declare module 'redux-observable' {
  declare type Epic<S, A> =
    (action$: ActionsObservable<A>, store: MiddlewareAPI<S, A>) => Observable<A>;

  declare function createEpicMiddleware<S, A>(epic?: Epic<S, A>): Middleware<S, A>;

  // FIXME: ActionsObservable's methods are not checked properly...
  // FIXME: <T: Action> doesn't work somehow.
  declare class ActionsObservable<A> extends Observable<A> {
    constructor(actionsSubject: Observable<A>): void;

    lift(operator: Operator<any, A>): ActionsObservable<A>;

    ofType(...key: any[]): ActionsObservable<A>;
  }
}
