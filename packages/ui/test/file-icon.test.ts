import { describe, it, expect } from "vitest"
import { fileKind, fileBadge } from "../src/components/file-icon"

describe("fileKind", () => {
  it("reads the extension first", () => {
    expect(fileKind("ລາຍງານ.PDF")).toBe("pdf")
    expect(fileKind("a.xlsx")).toBe("sheet")
    expect(fileKind("a.docx")).toBe("doc")
    expect(fileKind("a.pptx")).toBe("slide")
    expect(fileKind("photo.HEIC")).toBe("image")
    expect(fileKind("a.mp4")).toBe("video")
    expect(fileKind("a.m4a")).toBe("audio")
    expect(fileKind("a.7z")).toBe("archive")
  })
  it("falls back to the mime type", () => {
    expect(fileKind("blob", "application/pdf")).toBe("pdf")
    expect(fileKind("", "image/jpeg")).toBe("image")
    expect(fileKind("x", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet")).toBe("sheet")
    expect(fileKind("x", "application/vnd.openxmlformats-officedocument.presentationml.presentation")).toBe("slide")
    expect(fileKind("x", "application/vnd.openxmlformats-officedocument.wordprocessingml.document")).toBe("doc")
  })
  it("unknown is other", () => {
    expect(fileKind("data.bin")).toBe("other")
    expect(fileKind()).toBe("other")
  })
})

describe("fileBadge", () => {
  it("uses the short real extension", () => {
    expect(fileBadge("a.xlsx")).toBe("XLSX")
    expect(fileBadge("a.pdf")).toBe("PDF")
  })
  it("falls back to the family label", () => {
    expect(fileBadge("blob", "image/png")).toBe("IMG")
    expect(fileBadge("noext")).toBe("FILE")
  })
})
