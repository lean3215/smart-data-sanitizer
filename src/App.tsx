import { useState } from "react";
import { parseAddressBatch } from "./utils/parser";
import type { ParsedAddress, RecordStatus } from "./types/record";
import { StatusBadge } from "./components/StatusBadge";
import { exportAddressesToCsv } from "./utils/exportCsv";

type FilterOption = "all" | RecordStatus;

const FILTER_OPTIONS: FilterOption[] = ["all", "valid", "warning", "error"];

const SAMPLE_INPUT = `No 12, Jalan Bukit Bintang, 55100 Kuala Lumpur
45 Jalan Ampang Selangor
Lot 8, Lorong 3, 40000 Shah Alam, Selangor
Bad address line`;

function App() {
  const [rawInput, setRawInput] = useState<string>(SAMPLE_INPUT);
  const [results, setResults] = useState<ParsedAddress[]>([]);
  const [activeFilter, setActiveFilter] = useState<FilterOption>("all");

  const handleSanitize = () => {
    const parsed = parseAddressBatch(rawInput);
    setResults(parsed);
    setActiveFilter("all");
  };

  const handleClear = () => {
    setRawInput("");
    setResults([]);
    setActiveFilter("all");
  };

  const filteredResults =
    activeFilter === "all"
      ? results
      : results.filter((item) => item.status === activeFilter);

  const getCount = (option: FilterOption): number => {
    if (option === "all") return results.length;
    return results.filter((item) => item.status === option).length;
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <div className="mx-auto max-w-5xl px-4 py-10 sm:px-6">
        <header className="mb-8">
          <h1 className="text-3xl font-bold tracking-tight text-white">
            Smart Data Sanitizer
          </h1>
          <p className="mt-1 text-sm text-slate-400">
            Parse, validate, and export Malaysian addresses into structured CSV
            data.
          </p>
        </header>

        <section className="rounded-xl border border-slate-800 bg-slate-900 p-5 shadow-lg">
          <label
            htmlFor="address-input"
            className="mb-2 block text-sm font-medium text-slate-300"
          >
            Raw Addresses (one per line)
          </label>
          <textarea
            id="address-input"
            rows={5}
            value={rawInput}
            onChange={(e) => setRawInput(e.target.value)}
            placeholder="Paste messy addresses here..."
            className="w-full rounded-lg border border-slate-700 bg-slate-950 p-3 font-mono text-sm text-slate-100 placeholder-slate-500 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/40"
          />

          <div className="mt-4 flex flex-wrap items-center gap-3">
            <button
              onClick={handleSanitize}
              disabled={rawInput.trim().length === 0}
              className="cursor-pointer rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-500 disabled:cursor-not-allowed disabled:opacity-50"
            >
              Sanitize Addresses
            </button>

            <button
              onClick={handleClear}
              className="cursor-pointer rounded-lg border border-slate-700 bg-slate-800 px-4 py-2.5 text-sm font-medium text-slate-300 transition hover:bg-slate-700 hover:text-white"
            >
              Clear
            </button>
          </div>
        </section>

        {results.length > 0 && (
          <section className="mt-8">
            <div className="mb-4 flex flex-wrap items-center gap-2">
              {FILTER_OPTIONS.map((option) => {
                const isActive = activeFilter === option;
                return (
                  <button
                    key={option}
                    onClick={() => setActiveFilter(option)}
                    className={`cursor-pointer rounded-lg border px-3.5 py-1.5 text-sm font-medium capitalize transition ${
                      isActive
                        ? "border-blue-500 bg-blue-600/20 text-blue-300"
                        : "border-slate-800 bg-slate-900 text-slate-400 hover:border-slate-700 hover:text-slate-200"
                    }`}
                  >
                    {option}{" "}
                    <span className="ml-1 text-xs opacity-75">
                      ({getCount(option)})
                    </span>
                  </button>
                );
              })}

              <button
                onClick={() =>
                  exportAddressesToCsv(
                    filteredResults,
                    `addresses-${activeFilter}.csv`
                  )
                }
                disabled={filteredResults.length === 0}
                className="ml-auto cursor-pointer rounded-lg bg-emerald-600 px-4 py-1.5 text-sm font-semibold text-white transition hover:bg-emerald-500 disabled:cursor-not-allowed disabled:opacity-50"
              >
                Export CSV ({filteredResults.length})
              </button>
            </div>

            <div className="overflow-x-auto rounded-xl border border-slate-800 bg-slate-900 shadow-lg">
              <table className="w-full border-collapse text-left text-sm">
                <thead className="border-b border-slate-800 bg-slate-950/60 text-xs font-semibold uppercase tracking-wider text-slate-400">
                  <tr>
                    <th className="px-4 py-3">Status</th>
                    <th className="px-4 py-3">Street</th>
                    <th className="px-4 py-3">Postcode</th>
                    <th className="px-4 py-3">State</th>
                    <th className="px-4 py-3">Issues</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800">
                  {filteredResults.length === 0 ? (
                    <tr>
                      <td
                        colSpan={5}
                        className="px-4 py-8 text-center text-slate-400"
                      >
                        No records match the &ldquo;{activeFilter}&rdquo; filter.
                      </td>
                    </tr>
                  ) : (
                    filteredResults.map((item) => (
                      <tr
                        key={item.id}
                        className="transition-colors hover:bg-slate-800/50"
                      >
                        <td className="whitespace-nowrap px-4 py-3">
                          <StatusBadge status={item.status} />
                        </td>
                        <td className="px-4 py-3 font-medium text-slate-100">
                          {item.street}
                        </td>
                        <td className="whitespace-nowrap px-4 py-3 font-mono text-slate-300">
                          {item.postcode ?? "—"}
                        </td>
                        <td className="whitespace-nowrap px-4 py-3 text-slate-300">
                          {item.state ?? "—"}
                        </td>
                        <td className="px-4 py-3 text-slate-400">
                          {item.issues.length > 0
                            ? item.issues.join(", ")
                            : "None"}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </section>
        )}
      </div>
    </div>
  );
}

export default App;