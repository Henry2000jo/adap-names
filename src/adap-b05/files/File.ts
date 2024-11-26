import { Node } from "./Node";
import { Directory } from "./Directory";
import { MethodFailedException } from "../common/MethodFailedException";
import { InvalidStateException } from "../common/InvalidStateException";

enum FileState {
    OPEN,
    CLOSED,
    DELETED        
};

export class File extends Node {

    protected state: FileState = FileState.CLOSED;

    constructor(baseName: string, parent: Directory) {
        super(baseName, parent);
    }

    public open(): void {
        this.assertIsInState(FileState.CLOSED);

        // do something
    }

    public read(noBytes: number): Int8Array {
        let result: Int8Array = new Int8Array(noBytes);
        // do something

        let tries: number = 0;
        for (let i: number = 0; i < noBytes; i++) {
            try {
                result[i] = this.readNextByte();
            } catch(ex) {
                tries++;
                if (ex instanceof MethodFailedException) {
                    // Oh no! What @todo?!
                }
            }
        }

        return result;
    }

    protected readNextByte(): number {
        return 0; // @todo
    }

    public close(): void {
        this.assertIsInState(FileState.OPEN);
        
        // do something
    }

    protected doGetFileState(): FileState {
        return this.state;
    }


    /* Assertion methods for preconditions */

    protected assertIsInState(state: FileState) {
        if (state != this.doGetFileState()) {
            throw new InvalidStateException("invalid file state");
        }
    }

}