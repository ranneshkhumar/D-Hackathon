export class CsvParserService {
  /**
   * Parses raw CSV text string content into a tabular 2D string grid.
   * Properly handles quoted values, escaped commas, and trims whitespaces.
   */
  static parse(csvContent: string): string[][] {
    const rows: string[][] = [];
    const lines = csvContent.split(/\r?\n/);

    for (const line of lines) {
      if (!line.trim()) continue;

      const row: string[] = [];
      let currentCell = '';
      let insideQuotes = false;

      for (let i = 0; i < line.length; i++) {
        const char = line[i];

        if (char === '"') {
          insideQuotes = !insideQuotes;
        } else if (char === ',' && !insideQuotes) {
          row.push(currentCell.trim().replace(/^["']|["']$/g, ''));
          currentCell = '';
        } else {
          currentCell += char;
        }
      }
      // Add the final cell
      row.push(currentCell.trim().replace(/^["']|["']$/g, ''));

      // Filter out completely blank lines
      if (row.some(cell => cell !== '')) {
        rows.push(row);
      }
    }

    return rows;
  }
}
