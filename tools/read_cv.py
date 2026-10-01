"""Extract readable text from the source CV .docx files.

A .docx is a zip archive; the body text lives in word/document.xml.
Parsed with ElementTree rather than regex so nested runs, hyperlinks and
tables come out in document order.
"""
import sys
import xml.etree.ElementTree as ET
import zipfile

W = "{http://schemas.openxmlformats.org/wordprocessingml/2006/main}"


def qn(tag):
    return f"{W}{tag}"


def para_text(p):
    """Concatenate all runs in a paragraph, honouring tabs and breaks."""
    out = []
    for node in p.iter():
        if node.tag == qn("t"):
            out.append(node.text or "")
        elif node.tag == qn("tab"):
            out.append("\t")
        elif node.tag in (qn("br"), qn("cr")):
            out.append("\n")
    return "".join(out)


def block_lines(el):
    """Render a <w:p> or <w:tbl> as a list of text lines."""
    if el.tag == qn("p"):
        text = para_text(el).strip()
        return [text] if text else []

    lines = []
    for row in el.iter(qn("tr")):
        cells = []
        for cell in row.iter(qn("tc")):
            text = " ".join(
                para_text(p).strip() for p in cell.iter(qn("p"))
            )
            text = " ".join(text.split())
            if text:
                cells.append(text)
        if cells:
            lines.append(" | ".join(cells))
    return lines


def extract(path):
    with zipfile.ZipFile(path) as z:
        root = ET.fromstring(z.read("word/document.xml"))

    body = root.find(qn("body"))
    if body is None:
        return ""

    lines = []
    for el in body:
        if el.tag in (qn("p"), qn("tbl")):
            lines.extend(block_lines(el))
    return "\n".join(lines)


if __name__ == "__main__":
    for p in sys.argv[1:]:
        print(f"\n{'=' * 72}\n{p}\n{'=' * 72}")
        print(extract(p))
