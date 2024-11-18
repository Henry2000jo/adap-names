import { describe, it, expect } from "vitest";

import { Name } from "../../../src/adap-b03/names/Name";
import { StringName } from "../../../src/adap-b03/names/StringName";
import { StringArrayName } from "../../../src/adap-b03/names/StringArrayName";


/* Offizielle Tests von B02 */
describe("Basic StringName function tests", () => {
  it("test insert", () => {
    let n: Name = new StringName("oss.fau.de");
    n.insert(1, "cs");
    expect(n.asString()).toBe("oss.cs.fau.de");
  });
  it("test append", () => {
    let n: Name = new StringName("oss.cs.fau");
    n.append("de");
    expect(n.asString()).toBe("oss.cs.fau.de");
  });
  it("test remove", () => {
    let n: Name = new StringName("oss.cs.fau.de");
    n.remove(0);
    expect(n.asString()).toBe("cs.fau.de");
  });
});

describe("Basic StringArrayName function tests", () => {
  it("test insert", () => {
    let n: Name = new StringArrayName(["oss", "fau", "de"]);
    n.insert(1, "cs");
    expect(n.asString()).toBe("oss.cs.fau.de");
  });
  it("test append", () => {
    let n: Name = new StringArrayName(["oss", "cs", "fau"]);
    n.append("de");
    expect(n.asString()).toBe("oss.cs.fau.de");
  });
  it("test remove", () => {
    let n: Name = new StringArrayName(["oss", "cs", "fau", "de"]);
    n.remove(0);
    expect(n.asString()).toBe("cs.fau.de");
  });
});

describe("Delimiter function tests", () => {
  it("test insert", () => {
    let n: Name = new StringName("oss#fau#de", '#');
    n.insert(1, "cs");
    expect(n.asString()).toBe("oss#cs#fau#de");
  });
});

describe("Escape character extravaganza", () => {
  it("test escape and delimiter boundary conditions", () => {
    let n: Name = new StringName("oss.cs.fau.de", '#');
    expect(n.getNoComponents()).toBe(1);
    expect(n.asString()).toBe("oss.cs.fau.de");
    n.append("people");
    expect(n.asString()).toBe("oss.cs.fau.de#people");
  });
});


/* Verschiedene Tests von B02 (Beschreibungen passen nicht) */
describe("Tests B02", () => {
  it("1", () => {
    let n: Name = new StringName("oss.cs\\.fau.de", '#');
    expect(n.getNoComponents()).toBe(1);
    expect(n.asDataString()).toBe('{"delimiter":"#","name":"oss.cs\\\\.fau.de"}');
    let dataString = n.asDataString();
    let data = JSON.parse(dataString);
    expect(data.delimiter).toBe('#');
    expect(data.name).toBe('oss.cs\\.fau.de');
    n.append("people");
    expect(n.asString()).toBe("oss.cs\\.fau.de#people");
  });
  it("2", () => {
    let n: Name = new StringName("oss.cs\\.fau.de", '.');
    expect(n.getNoComponents()).toBe(3);
    expect(n.asDataString()).toBe('{"delimiter":".","name":"oss.cs\\\\.fau.de"}');
    let dataString = n.asDataString();
    let data = JSON.parse(dataString);
    expect(data.delimiter).toBe('.');
    expect(data.name).toBe('oss.cs\\.fau.de');
    n.append("people");
    expect(n.asString()).toBe("oss.cs.fau.de.people");
  });
  it("3", () => {
    let n: Name = new StringName("oss.cs\\\\.fau.de", '.');
    expect(n.getNoComponents()).toBe(3);
    expect(n.asDataString()).toBe('{"delimiter":".","name":"oss.cs\\\\\\\\.fau.de"}');
    let dataString = n.asDataString();
    let data = JSON.parse(dataString);
    expect(data.delimiter).toBe('.');
    expect(data.name).toBe('oss.cs\\\\.fau.de');
    n.append("people");
    expect(n.asString()).toBe("oss.cs\\.fau.de.people");
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
    n.insert(4, "test");
    let clone = n.clone();
    expect(clone.asString()).toBe("oss.cs.fau.de.test");
    expect(clone.getNoComponents()).toBe(5);
    expect(clone.constructor.name).toBe(StringArrayName.name);
    clone.append("test2");
    expect(clone.asString()).toBe("oss.cs.fau.de.test.test2");
    expect(n.asString()).toBe("oss.cs.fau.de.test.test2");
  });
  it("clone StringName", () => {
    let n: StringName = new StringName("oss.cs.fau.de");
    n.insert(4, "test");
    let clone = n.clone();
    expect(clone.asString()).toBe("oss.cs.fau.de.test");
    expect(clone.getNoComponents()).toBe(5);
    expect(clone.constructor.name).toBe(StringName.name);
    clone.append("test2");
    expect(clone.asString()).toBe("oss.cs.fau.de.test.test2");
    expect(n.asString()).toBe("oss.cs.fau.de.test");
  });
});

describe("isEqual", () => {
  it("equal StringArrayName", () => {
    let n: StringArrayName = new StringArrayName(["oss", "cs", "fau", "de"]);
    let n2: StringArrayName = new StringArrayName(["oss", "cs", "fau", "de"]);
    expect(n.isEqual(n2)).toBe(true);
    expect(n.getHashCode()).toBe(n2.getHashCode());
    n2.append("test");
    expect(n.isEqual(n2)).toBe(false);
    expect(n.getHashCode()).not.toBe(n2.getHashCode());
  });
  it("equal StringName", () => {
    let n: StringName = new StringName("oss.cs.fau.de");
    let n2: StringName = new StringName("oss.cs.fau.de");
    expect(n.isEqual(n2)).toBe(true);
    expect(n.getHashCode()).toBe(n2.getHashCode());
    n2.append("test");
    expect(n.isEqual(n2)).toBe(false);
    expect(n.getHashCode()).not.toBe(n2.getHashCode());
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