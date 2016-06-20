/* @flow */
import { Animated } from 'react-native';

const AnimatedWithChildren = Animated.Value.prototype.constructor;

export class AnimatedAggregation<T> extends AnimatedWithChildren {
  _parents: AnimatedWithChildren[];
  _f: (parents: number[]) => T;

  constructor(parents: AnimatedWithChildren[], f: (parents: number[]) => T) {
    super();
    this._parents = parents;
    this._f = f;
  }
  __makeNative(): void {
    this._parents.forEach(p => p.__makeNative());
    super.__makeNative();
  }
  __attach(): void {
    this._parents.forEach(h => h.__addChild(this));
  }
  __detach(): void {
    this._parents.forEach(h => h.__removeChild(this));
    super.__detach();
  }
  __getValue(): T {
    const values = this._parents.map(p => p.__getValue());
    return this._f.call(this, values);
  }
}

export function aggregate<T>(
  parents: AnimatedWithChildren[],
  f: (parents: number[]) => T
): AnimatedAggregation<T> {
  return new AnimatedAggregation(parents, f);
}
