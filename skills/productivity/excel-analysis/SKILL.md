---
name: excel-analysis
description: >
  Safe analysis and editing of Excel workbooks with Python/openpyxl — reading values and
  formulas, categorizing rows, computing summaries, and making targeted edits without
  destroying formulas or formatting. Use whenever asked to review, analyze, summarize,
  categorize, or update a .xlsx/.xlsm spreadsheet. Trigger on: "expense sheet", "spreadsheet",
  "workbook", "Excel", ".xlsx", "categorize these rows", "update the sheet".
---

Excel workbooks are live documents the user keeps using — treat them as production data, not
scratch files.

## Before touching anything

Use the bundled `xlsx-tool.py` (next to this skill) instead of writing ad-hoc survey scripts:

```bash
python <skill dir>/xlsx-tool.py backup <workbook.xlsx>        # timestamped copy, prints path
python <skill dir>/xlsx-tool.py survey <workbook.xlsx>        # structure JSON: sheets, headers,
                                                              # formula cells, merged/named ranges
python <skill dir>/xlsx-tool.py values <wb.xlsx> <Sheet> 200  # cached values as TSV, capped
```

1. **Back up first** (`backup`) before any write.
2. **Survey the structure** (`survey`) — it flags exactly which cells hold formulas, so you
   know what must not be overwritten.
3. **Load twice when you need both views:** `load_workbook(path)` preserves formulas;
   `load_workbook(path, data_only=True)` gives computed values (only if Excel saved a cache).
   Never edit the `data_only=True` copy — saving it replaces every formula with its cached
   value. For plain reads, prefer `values` over hand-written loader scripts.

## Editing rules

- **Never overwrite a formula cell with a computed value** unless explicitly asked. If a
  formula needs new numbers, edit the formula text.
- **Preserve what exists:** for `.xlsm` use `keep_vba=True`; don't reorder sheets, rename
  headers, or reformat columns as a side effect.
- **Respect the existing taxonomy.** Fit new rows into the categories/columns already there.
  Never invent new categories, columns, or sheets without asking — if something doesn't fit,
  put it in the existing catch-all (misc/other) and flag it.
- **Distinguish one-time vs recurring.** When classifying transactions or line items, ask (or
  check prior months) before treating an unusual charge as a new recurring pattern.
- **Targeted writes.** Edit specific cells; don't regenerate whole sheets from a DataFrame
  round-trip, which silently drops formatting, validation, and formulas.

## Analysis output

Summaries go to the user as short tables (top categories, month-over-month deltas, outliers,
unclassified rows needing a decision) — not dumped into new sheets unless asked. When you
change the workbook, end with a precise change list: sheet, cell/range, old → new.
