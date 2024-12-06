import { describe, it, expect } from "vitest";

import { Name } from "../../../src/adap-b06/names/Name";
import { StringName } from "../../../src/adap-b06/names/StringName";
import { StringArrayName } from "../../../src/adap-b06/names/StringArrayName";
import { IllegalArgumentException } from "../../../src/adap-b06/common/IllegalArgumentException";
import { ESCAPE_CHARACTER } from "../../../src/adap-b06/common/Printable";
import { MethodFailedException } from "../../../src/adap-b06/common/MethodFailedException";
import exp from "constants";


/* Offizielle Tests von B02 */

describe("Basic StringName function tests", () => {
  it("test insert", () => {
    let n: Name = new StringName("oss.fau.de");
    let n2 = n.insert(1, "cs");
    expect(n.asString()).toBe("oss.fau.de");
    expect(n2.asString()).toBe("oss.cs.fau.de");
  });
  it("test append", () => {
    let n: Name = new StringName("oss.cs.fau");
    let n2 = n.append("de");
    expect(n.asString()).toBe("oss.cs.fau");
    expect(n2.asString()).toBe("oss.cs.fau.de");
  });
  it("test remove", () => {
    let n: Name = new StringName("oss.cs.fau.de");
    let n2 = n.remove(0);
    expect(n.asString()).toBe("oss.cs.fau.de");
    expect(n2.asString()).toBe("cs.fau.de");
  });
});

describe("Basic StringArrayName function tests", () => {
  it("test insert", () => {
    let n: Name = new StringArrayName(["oss", "fau", "de"]);
    let n2 = n.insert(1, "cs");
    expect(n.asString()).toBe("oss.fau.de");
    expect(n2.asString()).toBe("oss.cs.fau.de");
  });
  it("test append", () => {
    let n: Name = new StringArrayName(["oss", "cs", "fau"]);
    let n2 = n.append("de");
    expect(n.asString()).toBe("oss.cs.fau");
    expect(n2.asString()).toBe("oss.cs.fau.de");
  });
  it("test remove", () => {
    let n: Name = new StringArrayName(["oss", "cs", "fau", "de"]);
    let n2 = n.remove(0);
    expect(n.asString()).toBe("oss.cs.fau.de");
    expect(n2.asString()).toBe("cs.fau.de");
  });
});

describe("Delimiter function tests", () => {
  it("test insert", () => {
    let n: Name = new StringName("oss#fau#de", '#');
    let n2 = n.insert(1, "cs");
    expect(n.asString()).toBe("oss#fau#de");
    expect(n2.asString()).toBe("oss#cs#fau#de");
  });
});

describe("Escape character extravaganza", () => {
  it("test escape and delimiter boundary conditions", () => {
    let n: Name = new StringName("oss.cs.fau.de", '#');
    expect(n.getNoComponents()).toBe(1);
    expect(n.asString()).toBe("oss.cs.fau.de");
    let n2 = n.append("people");
    expect(n.asString()).toBe("oss.cs.fau.de");
    expect(n2.asString()).toBe("oss.cs.fau.de#people");
  });
});


/* Verschiedene Tests von B02 */

describe("Tests B02", () => {
  it("1", () => {
    let n: Name = new StringName("oss.cs\\.fau.de", '#');
    expect(n.getNoComponents()).toBe(1);
    expect(n.asDataString()).toBe('{"delimiter":"#","name":"oss.cs\\\\.fau.de"}');
    let dataString = n.asDataString();
    let data = JSON.parse(dataString);
    expect(data.delimiter).toBe('#');
    expect(data.name).toBe('oss.cs\\.fau.de');
    let n2 = n.append("people");
    expect(n.asString()).toBe("oss.cs.fau.de");
    expect(n2.asString()).toBe("oss.cs.fau.de#people");
  });
  it("2", () => {
    let n: Name = new StringName("oss.cs\\.fau.de", '.');
    expect(n.getNoComponents()).toBe(3);
    expect(n.asDataString()).toBe('{"delimiter":".","name":"oss.cs\\\\.fau.de"}');
    let dataString = n.asDataString();
    let data = JSON.parse(dataString);
    expect(data.delimiter).toBe('.');
    expect(data.name).toBe('oss.cs\\.fau.de');
    let n2 = n.append("people");
    expect(n.asString()).toBe("oss.cs.fau.de");
    expect(n2.asString()).toBe("oss.cs.fau.de.people");
  });
  it("3", () => {
    let n: Name = new StringName("oss.cs\\\\.fau.de", '.');
    expect(n.getNoComponents()).toBe(4);
    expect(n.asDataString()).toBe('{"delimiter":".","name":"oss.cs\\\\\\\\.fau.de"}');
    let dataString = n.asDataString();
    let data = JSON.parse(dataString);
    expect(data.delimiter).toBe('.');
    expect(data.name).toBe('oss.cs\\\\.fau.de');
    let n2 = n.append("people");
    expect(n.asString()).toBe("oss.cs\\.fau.de");
    expect(n2.asString()).toBe("oss.cs\\.fau.de.people");
  });
  it("4", () => {
    let n: Name = new StringName("oss\\.cs\\.fau\\.de", '.');
    expect(n.getNoComponents()).toBe(1);
    //expect(n.asDataString()).toBe("oss.cs\\\\.fau.de");
    //n.append("people");
    expect(n.asString()).toBe("oss.cs.fau.de");
  });
  it("5", () => {
    let n: Name = new StringArrayName(["oss\\.cs\\.fau\\.de"], '.');
    expect(n.getNoComponents()).toBe(1);
    //expect(n.asDataString()).toBe("oss.cs\\\\.fau.de");
    //n.append("people");
    expect(n.asString()).toBe("oss.cs.fau.de");
  });
});


/* neue Tests B03 */

describe("Clone", () => {
  it("clone StringArrayName", () => {
    let n: StringArrayName = new StringArrayName(["oss", "cs", "fau", "de"]);
    let n2 = n.insert(4, "test");
    let clone = n2.clone();
    let n3 = clone.append("test2");
    expect(clone.asString()).toBe("oss.cs.fau.de.test");
    expect(clone.getNoComponents()).toBe(5);
    expect(clone.constructor.name).toBe(StringArrayName.name);
    expect(n.asString()).toBe("oss.cs.fau.de");
    expect(n2.asString()).toBe("oss.cs.fau.de.test");
    expect(n3.asString()).toBe("oss.cs.fau.de.test.test2");
  });
  it("clone StringName", () => {
    let n: StringName = new StringName("oss.cs.fau.de");
    let n2 = n.insert(4, "test");
    let clone = n2.clone();
    let n3 = clone.append("test2");
    expect(clone.asString()).toBe("oss.cs.fau.de.test");
    expect(clone.getNoComponents()).toBe(5);
    expect(clone.constructor.name).toBe(StringName.name);
    expect(n.asString()).toBe("oss.cs.fau.de");
    expect(n2.asString()).toBe("oss.cs.fau.de.test");
    expect(n3.asString()).toBe("oss.cs.fau.de.test.test2");
  });
});

describe("isEqual", () => {
  it("equal StringArrayName", () => {
    let n: StringArrayName = new StringArrayName(["oss", "cs", "fau", "de"]);
    let n2: StringArrayName = new StringArrayName(["oss", "cs", "fau", "de"]);
    expect(n.isEqual(n2)).toBe(true);
    expect(n.getHashCode()).toBe(n2.getHashCode());
    let n3 = n2.append("test");
    expect(n.isEqual(n2)).toBe(true);
    expect(n.getHashCode()).toBe(n2.getHashCode());
    expect(n.isEqual(n3)).toBe(false);
    expect(n.getHashCode()).not.toBe(n3.getHashCode());
  });
  it("equal StringName", () => {
    let n: StringName = new StringName("oss.cs.fau.de");
    let n2: StringName = new StringName("oss.cs.fau.de");
    expect(n.isEqual(n2)).toBe(true);
    expect(n.getHashCode()).toBe(n2.getHashCode());
    let n3 = n2.append("test");
    expect(n.isEqual(n2)).toBe(true);
    expect(n.getHashCode()).toBe(n2.getHashCode());
    expect(n.isEqual(n3)).toBe(false);
    expect(n.getHashCode()).not.toBe(n3.getHashCode());
  });
  it("equal StringName and StringArrayName", () => {
    let n: StringName = new StringName("oss.cs.fau.de");
    let n2: StringArrayName = new StringArrayName(["oss", "cs", "fau", "de"]);
    expect(n.isEqual(n2)).toBe(true);
    expect(n.getHashCode()).toBe(n2.getHashCode());
    let n3 = n2.append("test");
    expect(n.isEqual(n2)).toBe(true);
    expect(n.getHashCode()).toBe(n2.getHashCode());
    expect(n.isEqual(n3)).toBe(false);
    expect(n.getHashCode()).not.toBe(n3.getHashCode());
  });
  it("different delimiter", () => {
    let n: StringArrayName = new StringArrayName(["oss", "cs", "fau", "de"], ",");
    let n2: StringArrayName = new StringArrayName(["oss", "cs", "fau", "de"]);
    expect(n.isEqual(n2)).toBe(false);
    expect(n.getHashCode()).not.toBe(n2.getHashCode());
  });
  it("different delimiter 2 but same String", () => {
    let n: StringName = new StringName("oss.cs.fau.de", ",");
    let n2: StringName = new StringName("oss.cs.fau.de");
    expect(n.isEqual(n2)).toBe(false);
    expect(n.getHashCode()).not.toBe(n2.getHashCode());
  });
  
});


/* neue Tests B04 für Preconditions */

describe("StringName constructor delimiter", () => {
  it("delimiter is correct", () => {
    expect(() => new StringName("oss.cs.fau.de", 'q')).not.toThrowError(IllegalArgumentException);
    expect(() => new StringName("oss.cs.fau.de", 'q')).not.toThrowError(MethodFailedException);
  });
  // kein Error weil delimiter default hat
  it("delimiter is undefined", () => {
    expect(() => new StringName("oss.cs.fau.de", undefined)).not.toThrowError(IllegalArgumentException);
    expect(() => new StringName("oss.cs.fau.de", undefined)).not.toThrowError(MethodFailedException);
  });
  it("delimiter is empty", () => {
    expect(() => new StringName("oss.cs.fau.de", '')).toThrowError(IllegalArgumentException);
    expect(() => new StringName("oss.cs.fau.de", '')).not.toThrowError(MethodFailedException);
  });
  it("delimiter is not a character", () => {
    expect(() => new StringName("oss.cs.fau.de", 'ab')).toThrowError(IllegalArgumentException);
    expect(() => new StringName("oss.cs.fau.de", 'ab')).not.toThrowError(MethodFailedException);
  });
  it("delimiter is escape character", () => {
    expect(() => new StringName("oss.cs.fau.de", ESCAPE_CHARACTER)).toThrowError(IllegalArgumentException);
    expect(() => new StringName("oss.cs.fau.de", ESCAPE_CHARACTER)).not.toThrowError(MethodFailedException);
  });
});

describe("StringArrayName constructor delimiter", () => {
  it("delimiter is correct", () => {
    expect(() => new StringArrayName(["oss", "cs", "fau", "de"], '-')).not.toThrowError(IllegalArgumentException);
    expect(() => new StringArrayName(["oss", "cs", "fau", "de"], '-')).not.toThrowError(MethodFailedException);
  });
  // kein Error weil delimiter default hat
  it("delimiter is undefined", () => {
    expect(() => new StringArrayName(["oss", "cs", "fau", "de"], undefined)).not.toThrowError(IllegalArgumentException);
    expect(() => new StringArrayName(["oss", "cs", "fau", "de"], undefined)).not.toThrowError(MethodFailedException);
  });
  it("delimiter is empty", () => {
    expect(() => new StringArrayName(["oss", "cs", "fau", "de"], '')).toThrowError(IllegalArgumentException);
    expect(() => new StringArrayName(["oss", "cs", "fau", "de"], '')).not.toThrowError(MethodFailedException);
  });
  it("delimiter is not a character", () => {
    expect(() => new StringArrayName(["oss", "cs", "fau", "de"], '.,')).toThrowError(IllegalArgumentException);
    expect(() => new StringArrayName(["oss", "cs", "fau", "de"], '.,')).not.toThrowError(MethodFailedException);
  });
  it("delimiter is escape character", () => {
    expect(() => new StringArrayName(["oss", "cs", "fau", "de"], ESCAPE_CHARACTER)).toThrowError(IllegalArgumentException);
    expect(() => new StringArrayName(["oss", "cs", "fau", "de"], ESCAPE_CHARACTER)).not.toThrowError(MethodFailedException);
  });
});

describe("StringName asString delimiter", () => {
  it("delimiter is correct", () => {
    let n: Name = new StringName("oss.cs.fau.de", '.');
    expect(() => n.asString(',')).not.toThrowError(IllegalArgumentException);
    expect(() => n.asString(',')).not.toThrowError(MethodFailedException);
  });
  // kein Error weil delimiter default hat
  it("delimiter is undefined", () => {
    let n: Name = new StringName("oss.cs.fau.de", '.');
    expect(() => n.asString(undefined)).not.toThrowError(IllegalArgumentException);
    expect(() => n.asString(undefined)).not.toThrowError(MethodFailedException);
  });
  it("delimiter is empty", () => {
    let n: Name = new StringName("oss.cs.fau.de", '.');
    expect(() => n.asString('')).toThrowError(IllegalArgumentException);
    expect(() => n.asString('')).not.toThrowError(MethodFailedException);
  });
  it("delimiter is not a character", () => {
    let n: Name = new StringName("oss.cs.fau.de", '.');
    expect(() => n.asString('e.')).toThrowError(IllegalArgumentException);
    expect(() => n.asString('e.')).not.toThrowError(MethodFailedException);
  });
  it("delimiter is escape character", () => {
    let n: Name = new StringName("oss.cs.fau.de", '.');
    expect(() => n.asString(ESCAPE_CHARACTER)).toThrowError(IllegalArgumentException);
    expect(() => n.asString(ESCAPE_CHARACTER)).not.toThrowError(MethodFailedException);
  });
});

describe("StringArrayName asString delimiter", () => {
  it("delimiter is correct", () => {
    let n: Name = new StringArrayName(["oss", "cs", "fau", "de"], '-');
    expect(() => n.asString('-')).not.toThrowError(IllegalArgumentException);
    expect(() => n.asString('-')).not.toThrowError(MethodFailedException);
  });
  // kein Error weil delimiter default hat
  it("delimiter is undefined", () => {
    let n: Name = new StringArrayName(["oss", "cs", "fau", "de"], '-');
    expect(() => n.asString(undefined)).not.toThrowError(IllegalArgumentException);
    expect(() => n.asString(undefined)).not.toThrowError(MethodFailedException);
  });
  it("delimiter is empty", () => {
    let n: Name = new StringArrayName(["oss", "cs", "fau", "de"], '-');
    expect(() => n.asString('')).toThrowError(IllegalArgumentException);
    expect(() => n.asString('')).not.toThrowError(MethodFailedException);
  });
  it("delimiter is not a character", () => {
    let n: Name = new StringArrayName(["oss", "cs", "fau", "de"], '-');
    expect(() => n.asString('öä')).toThrowError(IllegalArgumentException);
    expect(() => n.asString('öä')).not.toThrowError(MethodFailedException);
  });
  it("delimiter is escape character", () => {
    let n: Name = new StringArrayName(["oss", "cs", "fau", "de"], '-');
    expect(() => n.asString(ESCAPE_CHARACTER)).toThrowError(IllegalArgumentException);
    expect(() => n.asString(ESCAPE_CHARACTER)).not.toThrowError(MethodFailedException);
  });
});

describe("StringName isEqual other", () => {
  it("other is correct", () => {
    let n: Name = new StringName("oss.cs.fau.de");
    let n2: Name = new StringName("oss.cs.fau.deeeeee");
    expect(() => n.isEqual(n2)).not.toThrowError(IllegalArgumentException);
    expect(() => n.isEqual(n2)).not.toThrowError(MethodFailedException);
  });
  it("other is undefined", () => {
    let n: Name = new StringName("oss.cs.fau.de");
    let n2: Name;
    expect(() => n.isEqual(n2)).toThrowError(IllegalArgumentException);
    expect(() => n.isEqual(n2)).not.toThrowError(MethodFailedException);
  });
});

describe("StringArrayName isEqual other", () => {
  it("other is correct", () => {
    let n: Name = new StringArrayName(["oss", "cs", "fau", "de"]);
    let n2: Name = new StringArrayName(["oss", "cs", "fau", "deeee"]);
    expect(() => n.isEqual(n2)).not.toThrowError(IllegalArgumentException);
    expect(() => n.isEqual(n2)).not.toThrowError(MethodFailedException);
  });
  it("other is undefined", () => {
    let n: Name = new StringArrayName(["oss", "cs", "fau", "de"]);
    let n2: Name;
    expect(() => n.isEqual(n2)).toThrowError(IllegalArgumentException);
    expect(() => n.isEqual(n2)).not.toThrowError(MethodFailedException);
  });
});

describe("StringName concat other", () => {
  it("other is correct", () => {
    let n: Name = new StringName("oss.cs.fau.de", '.');
    let n2: Name = new StringName("oss.cs.fau.deeeeee", '.');
    expect(() => n.concat(n2)).not.toThrowError(IllegalArgumentException);
    expect(() => n.concat(n2)).not.toThrowError(MethodFailedException);
  });
  it("other is undefined", () => {
    let n: Name = new StringName("oss.cs.fau.de");
    let n2: Name;
    expect(() => n.concat(n2)).toThrowError(IllegalArgumentException);
    expect(() => n.concat(n2)).not.toThrowError(MethodFailedException);
  });
});

describe("StringArrayName concat other", () => {
  it("other is correct", () => {
    let n: Name = new StringArrayName(["oss", "cs", "fau", "de"]);
    let n2: Name = new StringArrayName(["oss", "cs", "fau", "deeee"]);
    expect(() => n.concat(n2)).not.toThrowError(IllegalArgumentException);
    expect(() => n.concat(n2)).not.toThrowError(MethodFailedException);
  });
  it("other is undefined", () => {
    let n: Name = new StringArrayName(["oss", "cs", "fau", "de"]);
    let n2: Name;
    expect(() => n.concat(n2)).toThrowError(IllegalArgumentException);
    expect(() => n.concat(n2)).not.toThrowError(MethodFailedException);
  });
});

describe("StringName constructor other", () => {
  it("other is correct", () => {
    expect(() => new StringName("oss.cs.fau.de", '.')).not.toThrowError(IllegalArgumentException);
    expect(() => new StringName("oss.cs.fau.de", '.')).not.toThrowError(MethodFailedException);
  });
  it("other is undefined", () => {
    let other: string;
    expect(() => new StringName(other)).toThrowError(IllegalArgumentException);
    expect(() => new StringName(other)).not.toThrowError(MethodFailedException);
  });
  it("other component empty", () => {
    expect(() => new StringName(".l")).not.toThrowError(IllegalArgumentException);
    expect(() => new StringName(".l")).not.toThrowError(MethodFailedException);
  });
});

describe("StringArrayName constructor other", () => {
  it("other is correct", () => {
    expect(() => new StringArrayName(["oss", "cs", "fau", "de"], '.')).not.toThrowError(IllegalArgumentException);
    expect(() => new StringArrayName(["oss", "cs", "fau", "de"], '.')).not.toThrowError(MethodFailedException);
  });
  it("other is undefined", () => {
    let other: string[];
    expect(() => new StringArrayName(other)).toThrowError(IllegalArgumentException);
    expect(() => new StringArrayName(other)).not.toThrowError(MethodFailedException);
  });
  it("other component empty", () => {
    expect(() => new StringArrayName(["", "cs", "fau", "de"])).not.toThrowError(IllegalArgumentException);
    expect(() => new StringArrayName(["", "cs", "fau", "de"])).not.toThrowError(MethodFailedException);
  });
  it("other component not masked", () => {
    expect(() => new StringArrayName(["oss", "cs", "fau", "de."])).toThrowError(IllegalArgumentException);
    expect(() => new StringArrayName(["oss", "cs", "fau", "de."])).not.toThrowError(MethodFailedException);
  });
});

describe("StringName getComponent i", () => {
  it("i is correct", () => {
    let n: Name = new StringName("oss.cs.fau.de");
    expect(() => n.getComponent(0)).not.toThrowError(IllegalArgumentException);
    expect(() => n.getComponent(0)).not.toThrowError(MethodFailedException);
    expect(() => n.getComponent(3)).not.toThrowError(IllegalArgumentException);
    expect(() => n.getComponent(3)).not.toThrowError(MethodFailedException);
  });
  it("i is undefined", () => {
    let n: Name = new StringName("oss.cs.fau.de");
    let i: number;
    expect(() => n.getComponent(i)).toThrowError(IllegalArgumentException);
    expect(() => n.getComponent(i)).not.toThrowError(MethodFailedException);
  });
  it("i is negative", () => {
    let n: Name = new StringName("oss.cs.fau.de");
    expect(() => n.getComponent(-1)).toThrowError(IllegalArgumentException);
    expect(() => n.getComponent(-1)).not.toThrowError(MethodFailedException);
  });
  it("i is too large", () => {
    let n: Name = new StringName("oss.cs.fau.de");
    expect(() => n.getComponent(4)).toThrowError(IllegalArgumentException);
    expect(() => n.getComponent(4)).not.toThrowError(MethodFailedException);
  });
});

describe("StringArrayName getComponent i", () => {
  it("i is correct", () => {
    let n: Name = new StringArrayName(["oss", "cs", "fau", "de"]);
    expect(() => n.getComponent(0)).not.toThrowError(IllegalArgumentException);
    expect(() => n.getComponent(0)).not.toThrowError(MethodFailedException);
    expect(() => n.getComponent(3)).not.toThrowError(IllegalArgumentException);
    expect(() => n.getComponent(3)).not.toThrowError(MethodFailedException);
  });
  it("i is undefined", () => {
    let n: Name = new StringArrayName(["oss", "cs", "fau", "de"]);
    let i: number;
    expect(() => n.getComponent(i)).toThrowError(IllegalArgumentException);
    expect(() => n.getComponent(i)).not.toThrowError(MethodFailedException);
  });
  it("i is negative", () => {
    let n: Name = new StringArrayName(["oss", "cs", "fau", "de"]);
    expect(() => n.getComponent(-1)).toThrowError(IllegalArgumentException);
    expect(() => n.getComponent(-1)).not.toThrowError(MethodFailedException);
  });
  it("i is too large", () => {
    let n: Name = new StringArrayName(["oss", "cs", "fau", "de"]);
    expect(() => n.getComponent(4)).toThrowError(IllegalArgumentException);
    expect(() => n.getComponent(4)).not.toThrowError(MethodFailedException);
  });
});

describe("StringName setComponent i", () => {
  it("i is correct", () => {
    let n: Name = new StringName("oss.cs.fau.de");
    expect(() => n.setComponent(0, "test")).not.toThrowError(IllegalArgumentException);
    expect(() => n.setComponent(0, "test")).not.toThrowError(MethodFailedException);
    expect(() => n.setComponent(4, "test")).not.toThrowError(IllegalArgumentException);
    expect(() => n.setComponent(4, "test")).not.toThrowError(MethodFailedException);
  });
  it("i is undefined", () => {
    let n: Name = new StringName("oss.cs.fau.de");
    let i: number;
    expect(() => n.setComponent(i, "test")).toThrowError(IllegalArgumentException);
    expect(() => n.setComponent(i, "test")).not.toThrowError(MethodFailedException);
  });
  it("i is negative", () => {
    let n: Name = new StringName("oss.cs.fau.de");
    expect(() => n.setComponent(-1, "test")).toThrowError(IllegalArgumentException);
    expect(() => n.setComponent(-1, "test")).not.toThrowError(MethodFailedException);
  });
  it("i is too large", () => {
    let n: Name = new StringName("oss.cs.fau.de");
    expect(() => n.setComponent(5, "test")).toThrowError(IllegalArgumentException);
    expect(() => n.setComponent(5, "test")).not.toThrowError(MethodFailedException);
  });
});

describe("StringName setComponent c", () => {
  it("c is correct", () => {
    let n: Name = new StringName("oss.cs.fau.de");
    expect(() => n.setComponent(0, "test")).not.toThrowError(IllegalArgumentException);
    expect(() => n.setComponent(0, "test")).not.toThrowError(MethodFailedException);
  });
  it("c is undefined", () => {
    let n: Name = new StringName("oss.cs.fau.de");
    let c: string;
    expect(() => n.setComponent(0, c)).toThrowError(IllegalArgumentException);
    expect(() => n.setComponent(0, c)).not.toThrowError(MethodFailedException);
  });
  it("c is empty", () => {
    let n: Name = new StringName("oss.cs.fau.de");
    expect(() => n.setComponent(0, "")).not.toThrowError(IllegalArgumentException);
    expect(() => n.setComponent(0, "")).not.toThrowError(MethodFailedException);
  });
  it("c is not masked", () => {
    let n: Name = new StringName("oss.cs.fau.de");
    expect(() => n.setComponent(0, "test.")).toThrowError(IllegalArgumentException);
    expect(() => n.setComponent(0, "test.")).not.toThrowError(MethodFailedException);
  });
});

describe("StringArrayName setComponent i", () => {
  it("i is correct", () => {
    let n: Name = new StringArrayName(["oss", "cs", "fau", "de"]);
    expect(() => n.setComponent(0, "test")).not.toThrowError(IllegalArgumentException);
    expect(() => n.setComponent(0, "test")).not.toThrowError(MethodFailedException);
    expect(() => n.setComponent(4, "test")).not.toThrowError(IllegalArgumentException);
    expect(() => n.setComponent(4, "test")).not.toThrowError(MethodFailedException);
  });
  it("i is undefined", () => {
    let n: Name = new StringArrayName(["oss", "cs", "fau", "de"]);
    let i: number;
    expect(() => n.setComponent(i, "test")).toThrowError(IllegalArgumentException);
    expect(() => n.setComponent(i, "test")).not.toThrowError(MethodFailedException);
  });
  it("i is negative", () => {
    let n: Name = new StringArrayName(["oss", "cs", "fau", "de"]);
    expect(() => n.setComponent(-1, "test")).toThrowError(IllegalArgumentException);
    expect(() => n.setComponent(-1, "test")).not.toThrowError(MethodFailedException);
  });
  it("i is too large", () => {
    let n: Name = new StringArrayName(["oss", "cs", "fau", "de"]);
    expect(() => n.setComponent(5, "test")).toThrowError(IllegalArgumentException);
    expect(() => n.setComponent(5, "test")).not.toThrowError(MethodFailedException);
  });
});

describe("StringArrayName setComponent c", () => {
  it("c is correct", () => {
    let n: Name = new StringArrayName(["oss", "cs", "fau", "de"]);
    expect(() => n.setComponent(0, "test")).not.toThrowError(IllegalArgumentException);
    expect(() => n.setComponent(0, "test")).not.toThrowError(MethodFailedException);
  });
  it("c is undefined", () => {
    let n: Name = new StringArrayName(["oss", "cs", "fau", "de"]);
    let c: string;
    expect(() => n.setComponent(0, c)).toThrowError(IllegalArgumentException);
    expect(() => n.setComponent(0, c)).not.toThrowError(MethodFailedException);
  });
  it("c is empty", () => {
    let n: Name = new StringArrayName(["oss", "cs", "fau", "de"]);
    expect(() => n.setComponent(0, "")).not.toThrowError(IllegalArgumentException);
    expect(() => n.setComponent(0, "")).not.toThrowError(MethodFailedException);
  });
  it("c is not masked", () => {
    let n: Name = new StringArrayName(["oss", "cs", "fau", "de"]);
    expect(() => n.setComponent(0, "test.")).toThrowError(IllegalArgumentException);
    expect(() => n.setComponent(0, "test.")).not.toThrowError(MethodFailedException);
  });
});

describe("StringName insert i", () => {
  it("i is correct", () => {
    let n: Name = new StringName("oss.cs.fau.de");
    let n2: Name = new StringName("oss.cs.fau.de");
    expect(() => n.insert(0, "test")).not.toThrowError(IllegalArgumentException);
    expect(() => n.insert(0, "test")).not.toThrowError(MethodFailedException);
    expect(() => n2.insert(4, "test")).not.toThrowError(IllegalArgumentException);
    expect(() => n2.insert(4, "test")).not.toThrowError(MethodFailedException);
  });
  it("i is undefined", () => {
    let n: Name = new StringName("oss.cs.fau.de");
    let i: number;
    expect(() => n.insert(i, "test")).toThrowError(IllegalArgumentException);
    expect(() => n.insert(i, "test")).not.toThrowError(MethodFailedException);
  });
  it("i is negative", () => {
    let n: Name = new StringName("oss.cs.fau.de");
    expect(() => n.insert(-1, "test")).toThrowError(IllegalArgumentException);
    expect(() => n.insert(-1, "test")).not.toThrowError(MethodFailedException);
  });
  it("i is too large", () => {
    let n: Name = new StringName("oss.cs.fau.de");
    expect(() => n.insert(5, "test")).toThrowError(IllegalArgumentException);
    expect(() => n.insert(5, "test")).not.toThrowError(MethodFailedException);
  });
});

describe("StringName insert c", () => {
  it("c is correct", () => {
    let n: Name = new StringName("oss.cs.fau.de");
    expect(() => n.insert(0, "test")).not.toThrowError(IllegalArgumentException);
    expect(() => n.insert(0, "test")).not.toThrowError(MethodFailedException);
  });
  it("c is undefined", () => {
    let n: Name = new StringName("oss.cs.fau.de");
    let c: string;
    expect(() => n.insert(0, c)).toThrowError(IllegalArgumentException);
    expect(() => n.insert(0, c)).not.toThrowError(MethodFailedException);
  });
  it("c is empty", () => {
    let n: Name = new StringName("oss.cs.fau.de");
    expect(() => n.insert(0, "")).not.toThrowError(IllegalArgumentException);
    expect(() => n.insert(0, "")).not.toThrowError(MethodFailedException);
  });
  it("c is not masked", () => {
    let n: Name = new StringName("oss.cs.fau.de");
    expect(() => n.insert(0, "test.")).toThrowError(IllegalArgumentException);
    expect(() => n.insert(0, "test.")).not.toThrowError(MethodFailedException);
  });
});

describe("StringArrayName insert i", () => {
  it("i is correct", () => {
    let n: Name = new StringArrayName(["oss", "cs", "fau", "de"]);
    let n2: Name = new StringArrayName(["oss", "cs", "fau", "de"]);
    expect(() => n.insert(0, "test")).not.toThrowError(IllegalArgumentException);
    expect(() => n.insert(0, "test")).not.toThrowError(MethodFailedException);
    expect(() => n2.insert(4, "test")).not.toThrowError(IllegalArgumentException);
    expect(() => n2.insert(4, "test")).not.toThrowError(MethodFailedException);
  });
  it("i is undefined", () => {
    let n: Name = new StringArrayName(["oss", "cs", "fau", "de"]);
    let i: number;
    expect(() => n.insert(i, "test")).toThrowError(IllegalArgumentException);
    expect(() => n.insert(i, "test")).not.toThrowError(MethodFailedException);
  });
  it("i is negative", () => {
    let n: Name = new StringArrayName(["oss", "cs", "fau", "de"]);
    expect(() => n.insert(-1, "test")).toThrowError(IllegalArgumentException);
    expect(() => n.insert(-1, "test")).not.toThrowError(MethodFailedException);
  });
  it("i is too large", () => {
    let n: Name = new StringArrayName(["oss", "cs", "fau", "de"]);
    expect(() => n.insert(5, "test")).toThrowError(IllegalArgumentException);
    expect(() => n.insert(5, "test")).not.toThrowError(MethodFailedException);
  });
});

describe("StringArrayName insert c", () => {
  it("c is correct", () => {
    let n: Name = new StringArrayName(["oss", "cs", "fau", "de"]);
    expect(() => n.insert(0, "test")).not.toThrowError(IllegalArgumentException);
    expect(() => n.insert(0, "test")).not.toThrowError(MethodFailedException);
  });
  it("c is undefined", () => {
    let n: Name = new StringArrayName(["oss", "cs", "fau", "de"]);
    let c: string;
    expect(() => n.insert(0, c)).toThrowError(IllegalArgumentException);
    expect(() => n.insert(0, c)).not.toThrowError(MethodFailedException);
  });
  it("c is empty", () => {
    let n: Name = new StringArrayName(["oss", "cs", "fau", "de"]);
    expect(() => n.insert(0, "")).not.toThrowError(IllegalArgumentException);
    expect(() => n.insert(0, "")).not.toThrowError(MethodFailedException);
  });
  it("c is not masked", () => {
    let n: Name = new StringArrayName(["oss", "cs", "fau", "de"]);
    expect(() => n.insert(0, "test.")).toThrowError(IllegalArgumentException);
    expect(() => n.insert(0, "test.")).not.toThrowError(MethodFailedException);
  });
});

describe("StringName append c", () => {
  it("c is correct", () => {
    let n: Name = new StringName("oss.cs.fau.de");
    expect(() => n.append("test")).not.toThrowError(IllegalArgumentException);
    expect(() => n.append("test")).not.toThrowError(MethodFailedException);
  });
  it("c is undefined", () => {
    let n: Name = new StringName("oss.cs.fau.de");
    let c: string;
    expect(() => n.append(c)).toThrowError(IllegalArgumentException);
    expect(() => n.append(c)).not.toThrowError(MethodFailedException);
  });
  it("c is empty", () => {
    let n: Name = new StringName("oss.cs.fau.de");
    expect(() => n.append("")).not.toThrowError(IllegalArgumentException);
    expect(() => n.append("")).not.toThrowError(MethodFailedException);
  });
  it("c is not masked", () => {
    let n: Name = new StringName("oss.cs.fau.de");
    expect(() => n.append("test.")).toThrowError(IllegalArgumentException);
    expect(() => n.append("test.")).not.toThrowError(MethodFailedException);
  });
});

describe("StringArrayName append c", () => {
  it("c is correct", () => {
    let n: Name = new StringArrayName(["oss", "cs", "fau", "de"]);
    expect(() => n.append("test")).not.toThrowError(IllegalArgumentException);
    expect(() => n.append("test")).not.toThrowError(MethodFailedException);
  });
  it("c is undefined", () => {
    let n: Name = new StringArrayName(["oss", "cs", "fau", "de"]);
    let c: string;
    expect(() => n.append(c)).toThrowError(IllegalArgumentException);
    expect(() => n.append(c)).not.toThrowError(MethodFailedException);
  });
  it("c is empty", () => {
    let n: Name = new StringArrayName(["oss", "cs", "fau", "de"]);
    expect(() => n.append("")).not.toThrowError(IllegalArgumentException);
    expect(() => n.append("")).not.toThrowError(MethodFailedException);
  });
  it("c is not masked", () => {
    let n: Name = new StringArrayName(["oss", "cs", "fau", "de"]);
    expect(() => n.append("test.")).toThrowError(IllegalArgumentException);
    expect(() => n.append("test.")).not.toThrowError(MethodFailedException);
  });
});

describe("StringName remove i", () => {
  it("i is correct", () => {
    let n: Name = new StringName("oss.cs.fau.de");
    let n2: Name = new StringName("oss.cs.fau.de");
    expect(() => n.remove(0)).not.toThrowError(IllegalArgumentException);
    expect(() => n.remove(0)).not.toThrowError(MethodFailedException);
    expect(() => n2.remove(3)).not.toThrowError(IllegalArgumentException);
    expect(() => n2.remove(3)).not.toThrowError(MethodFailedException);
  });
  it("i is undefined", () => {
    let n: Name = new StringName("oss.cs.fau.de");
    let i: number;
    expect(() => n.remove(i)).toThrowError(IllegalArgumentException);
    expect(() => n.remove(i)).not.toThrowError(MethodFailedException);
  });
  it("i is negative", () => {
    let n: Name = new StringName("oss.cs.fau.de");
    expect(() => n.remove(-1)).toThrowError(IllegalArgumentException);
    expect(() => n.remove(-1)).not.toThrowError(MethodFailedException);
  });
  it("i is too large", () => {
    let n: Name = new StringName("oss.cs.fau.de");
    expect(() => n.remove(4)).toThrowError(IllegalArgumentException);
    expect(() => n.remove(4)).not.toThrowError(MethodFailedException);
  });
});

describe("StringArrayName remove i", () => {
  it("i is correct", () => {
    let n: Name = new StringArrayName(["oss", "cs", "fau", "de"]);
    let n2: Name = new StringArrayName(["oss", "cs", "fau", "de"]);
    expect(() => n.remove(0)).not.toThrowError(IllegalArgumentException);
    expect(() => n.remove(0)).not.toThrowError(MethodFailedException);
    expect(() => n2.remove(3)).not.toThrowError(IllegalArgumentException);
    expect(() => n2.remove(3)).not.toThrowError(MethodFailedException);
  });
  it("i is undefined", () => {
    let n: Name = new StringArrayName(["oss", "cs", "fau", "de"]);
    let i: number;
    expect(() => n.remove(i)).toThrowError(IllegalArgumentException);
    expect(() => n.remove(i)).not.toThrowError(MethodFailedException);
  });
  it("i is negative", () => {
    let n: Name = new StringArrayName(["oss", "cs", "fau", "de"]);
    expect(() => n.remove(-1)).toThrowError(IllegalArgumentException);
    expect(() => n.remove(-1)).not.toThrowError(MethodFailedException);
  });
  it("i is too large", () => {
    let n: Name = new StringArrayName(["oss", "cs", "fau", "de"]);
    expect(() => n.remove(4)).toThrowError(IllegalArgumentException);
    expect(() => n.remove(4)).not.toThrowError(MethodFailedException);
  });
});
