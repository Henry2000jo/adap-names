import { Exception } from "./Exception";

/**
 * An InvalidStateException signals an invalid state of an object.
 * In other words, a class invariant failed.
 */
export class InvalidStateException extends Exception {
    
    static assertIsNotUndefined(o: Object, m: string = "undefined", t?: Exception): void {
        this.assert(o !== undefined, m);
    }

    public static assert(c: boolean, m: string = "invalid state", t?: Exception): void {
        if (!c) throw new InvalidStateException(m, t);
    }

    constructor(m: string, t?: Exception) {
        super(m, t);
    }
    
}
