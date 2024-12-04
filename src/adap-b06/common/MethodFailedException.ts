import { Exception } from "./Exception";

/**
 * A MethodFailedException signals that the method failed to provide its service.
 * In other words, a postcondition failed.
 */
export class MethodFailedException extends Exception {
    
    static assertIsNotUndefined(o: Object, m: string = "undefined", t?: Exception): void {
        this.assert(o !== undefined, m);
    }

    public static assert(c: boolean, m: string = "method failed", t?: Exception): void {
        if (!c) throw new MethodFailedException(m, t);
    }

    constructor(m: string, t?: Exception) {
        super(m, t);
    }
    
}
