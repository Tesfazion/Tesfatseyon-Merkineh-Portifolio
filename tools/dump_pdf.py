"""Dump the text of a PDF next to its .docx source so the two can be diffed.

The video CV is served to visitors as a PDF exported by hand, while the
authoritative copy lives in src/assets as a .docx. Nothing enforced that
those two agree, so they drifted. This prints both, normalised, so the
difference is obvious.

Usage:  python tools/dump_pdf.py public/CV_Tesfatseyon_VideoEditor.pdf
"""
import re
import sys
import zipfile
import xml.etree.ElementTree as ET

from pypdf import PdfReader

sys.path.insert(0, __file__.rsplit("\\", 1)[0].rsplit("/", 1)[0])
from read_cv import extract as docx_text  # noqa: E402

W = "{http://schemas.openxmlformats.org/wordprocessingml/2006/main}"


def norm(s):
    """Collapse whitespace and unify the separator characters Word/PDF emit."""
    s = s.replace("\u2022", "\n").replace("\u2013", "-").replace("\u2014", "-")
    s = s.replace("\uf0b7", "\n").replace("\xa0", " ")
    lines = [re.sub(r"[ \t]+", " ", ln).strip() for ln in s.splitlines()]
    return [ln for ln in lines if ln]


def main(path):
    pdf = "\n".join(p.extract_text() for p in PdfReader(path).pages)
    # The .docx sources live in src/assets, not beside the served PDF.
    root = path.rsplit("\\", 1)[0].rsplit("/", 1)[0].rsplit("public", 1)[0]
    src = root + "src/assets/" + path.rsplit("\\", 1)[-1].rsplit("/", 1)[-1]
    src = src.rsplit(".", 1)[0] + ".docx"
    for label, text in (("PDF (served)", pdf), ("DOCX (source)", docx_text(src))):
        out = norm(text)
        print(f"\n{'=' * 70}\n{label}  ->  {len(out)} lines\n{'=' * 70}")
        for ln in out:
            print(ln)

    # Also show the contact line specifically: it is the part most likely to
    # be wrong, and a wrong email address is the worst possible bug here.
    print(f"\n{'=' * 70}\nContact details found\n{'=' * 70}")
    for label, text in (("PDF", pdf), ("DOCX", docx_text(src))):
        hits = re.findall(r"[\w.+-]+@[\w-]+\.[\w.]+", text)
        hits += re.findall(r"linkedin\.com/[^\s,;]+", text)
        hits += re.findall(r"\+251[\d\s]+", text)
        print(f"  {label}:")
        for h in dict.fromkeys(hits):
            print(f"    {h}")


if __name__ == "__main__":
    main(sys.argv[1])
