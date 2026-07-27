# wordfreq

Print the most frequent words in a text file as a terminal bar chart.

```bash
node wordfreq.mjs <file.txt> [topN]
```

Skips stopwords and words shorter than three characters. Defaults to the top 8.
Zero dependencies — just Node.

## Why

Reading a long document to figure out what it's actually about is slow. A frequency
chart gives you the shape of a text in one glance, before you commit to reading it.
