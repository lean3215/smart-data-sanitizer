import type { ParsedAddress } from "../types/record";

function escapeCsvField(value: string): string {
  // Wrap in quotes if the value contains a comma, double-quote, or newline
  if (/[",\n]/.test(value)) {
    return `"${value.replace(/"/g, '""')}"`;
  }
  return value;
}

export function exportAddressesToCsv(
  records: ParsedAddress[],
  filename = "sanitized-addresses.csv"
): void {
  const headers = ["Status", "Street", "Postcode", "State", "Issues", "Raw"];

  const rows = records.map((item) => [
    item.status.toUpperCase(),
    item.street,
    item.postcode ?? "",
    item.state ?? "",
    item.issues.join("; "),
    item.raw,
  ]);

  const csvLines = [headers, ...rows].map((row) =>
    row.map(escapeCsvField).join(",")
  );

  const csvContent = csvLines.join("\n");
  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);

  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();

  // Clean up the temporary DOM element and memory URL
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}