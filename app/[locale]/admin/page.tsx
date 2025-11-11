"use client";

import { useState, useEffect } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

// Table tabs configuration
const TABLES = [
  { id: "banks", label: "Banks", icon: "🏦" },
  { id: "vehicles", label: "Vehicles", icon: "🚗" },
  { id: "organizations", label: "Organizations", icon: "🏢" },
  { id: "vehicle_pricing", label: "Pricing", icon: "💰" },
  { id: "vehicle_specifications", label: "Specifications", icon: "📊" },
  { id: "vehicle_images", label: "Images", icon: "🖼️" },
] as const;

type TableId = (typeof TABLES)[number]["id"];

type AdminRow = Record<string, unknown>;

export default function AdminDashboard() {
  const [activeTable, setActiveTable] = useState<TableId>("banks");
  const [data, setData] = useState<AdminRow[]>([]);
  const [filteredData, setFilteredData] = useState<AdminRow[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editedData, setEditedData] = useState<AdminRow>({});
  const [searchTerm, setSearchTerm] = useState("");
  const [expandedJson, setExpandedJson] = useState<Set<string>>(new Set());

  // Fetch data when active table changes
  useEffect(() => {
    fetchData();
    setSearchTerm("");
  }, [activeTable]);

  // Filter data when search term changes
  useEffect(() => {
    if (!searchTerm) {
      setFilteredData(data);
      return;
    }

    const filtered = data.filter((row) =>
      Object.values(row).some((value) =>
        String(value).toLowerCase().includes(searchTerm.toLowerCase())
      )
    );
    setFilteredData(filtered);
  }, [searchTerm, data]);

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`/api/admin/${activeTable}`);
      if (!response.ok) throw new Error("Failed to fetch data");
      const result = await response.json();
      setData(result);
      setFilteredData(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (row: AdminRow) => {
    const { id } = row as { id?: unknown };
    if (!id) {
      console.warn("[AdminDashboard.handleEdit()] Missing row.id", { row });
      setError("Cannot edit this row because it has no ID.");
      return;
    }

    const stringId = String(id);
    console.log("[AdminDashboard.handleEdit()] Enter edit mode", {
      activeTable,
      id: stringId,
      row,
    });

    setEditingId(stringId);
    setEditedData({ ...row });
  };

  const handleSave = async () => {
    if (!editingId) {
      console.error("[AdminDashboard.handleSave()] No editingId set");
      setError("No record selected for saving.");
      return;
    }

    try {
      console.log("[AdminDashboard.handleSave()] Sending update", {
        activeTable,
        editingId,
        payload: editedData,
      });

      const response = await fetch(`/api/admin/${activeTable}/${editingId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editedData),
      });

      if (!response.ok) {
        const text = await response.text().catch(() => "");
        console.error(
          "[AdminDashboard.handleSave()] Update failed",
          response.status,
          text
        );
        throw new Error(`Failed to update (status ${response.status})`);
      }

      console.log("[AdminDashboard.handleSave()] Update success, refetching");
      await fetchData();
      setEditingId(null);
      setEditedData({});
      setError(null);
    } catch (err) {
      console.error("[AdminDashboard.handleSave()] Error", err);
      setError(
        err instanceof Error ? err.message : "Failed to save changes"
      );
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this item?")) return;

    try {
      const response = await fetch(`/api/admin/${activeTable}/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) throw new Error("Failed to delete");
      await fetchData();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to delete");
    }
  };

  const handleCancel = () => {
    setEditingId(null);
    setEditedData({});
  };

  const handleFieldChange = (field: string, value: unknown) => {
    setEditedData((prev) => ({ ...prev, [field]: value }));
  };

  const toggleJsonExpand = (id: string) => {
    setExpandedJson((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(id)) {
        newSet.delete(id);
      } else {
        newSet.add(id);
      }
      return newSet;
    });
  };

  const renderCell = (row: AdminRow, key: string) => {
    const value = row[key];
    const { id } = row as { id?: unknown };
    const isEditing = !!id && editingId === String(id);
    const cellId = `${id}-${key}`;

    // Handle different data types
    if (value === null || value === undefined) {
      return <span className="text-[hsl(var(--muted-foreground))]">—</span>;
    }

    if (typeof value === "boolean") {
      if (isEditing) {
        const boolVal =
          typeof editedData[key] === "boolean"
            ? (editedData[key] as boolean)
            : value;
        return (
          <input
            type="checkbox"
            checked={boolVal}
            onChange={(e) => handleFieldChange(key, e.target.checked)}
            className="h-4 w-4 rounded border-[hsl(var(--border))] text-[hsl(var(--accent))] focus:ring-[hsl(var(--ring))]"
          />
        );
      }
      return (
        <span className={value ? "text-green-600 dark:text-green-400" : "text-red-600 dark:text-red-400"}>
          {value ? "✓" : "✗"}
        </span>
      );
    }

    if (typeof value === "object") {
      const isExpanded = expandedJson.has(cellId);
      return (
        <div className="max-w-md">
          <button
            onClick={() => toggleJsonExpand(cellId)}
            className="mb-1 text-xs text-[hsl(var(--accent))] hover:underline"
          >
            {isExpanded ? "Collapse ▼" : "Expand ▶"}
          </button>
          <pre className={`overflow-x-auto rounded bg-[hsl(var(--muted)/0.3)] p-2 text-xs ${isExpanded ? "" : "max-h-20 overflow-hidden"}`}>
            {JSON.stringify(value, null, 2)}
          </pre>
        </div>
      );
    }

    // Handle timestamps
    if (key.includes("At") && typeof value === "string") {
      try {
        const date = new Date(value);
        return (
          <span className="text-xs text-[hsl(var(--muted-foreground))]">
            {date.toLocaleDateString()} {date.toLocaleTimeString()}
          </span>
        );
      } catch {
        // Fall through to default handling
      }
    }

    if (isEditing) {
      const current =
        typeof editedData[key] === "string" ||
        typeof editedData[key] === "number"
          ? (editedData[key] as string | number)
          : value;
      return (
        <input
          type="text"
          value={current as string | number}
          onChange={(e) => handleFieldChange(key, e.target.value)}
          className="w-full rounded-lg border border-[hsl(var(--border))] bg-[hsl(var(--input))] px-3 py-1.5 text-sm text-[hsl(var(--foreground))] focus:outline-none focus:ring-2 focus:ring-[hsl(var(--ring))]"
        />
      );
    }

    // Truncate long text
    const stringValue = String(value);
    return (
      <span title={stringValue}>
        {stringValue.length > 50 ? `${stringValue.substring(0, 50)}...` : stringValue}
      </span>
    );
  };

  const columns = data.length > 0 ? Object.keys(data[0]).filter((key) => key !== "id") : [];

  return (
    <div className="min-h-screen bg-background p-4 sm:p-6">
      <div className="mx-auto max-w-[1800px] space-y-4">
        {/* Header */}
        <div className="card-container mb-2 sm:mb-4">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="space-y-1.5">
              <div className="flex items-center gap-2">
                <h1 className="text-2xl font-semibold tracking-tight text-[hsl(var(--title-blue))] sm:text-3xl">
                  ⚡ Admin Dashboard
                </h1>
                <Badge
                  variant="outline"
                  className="text-[10px] uppercase tracking-wide border-[hsl(var(--border))] text-[hsl(var(--muted-foreground))]"
                >
                  Internal
                </Badge>
              </div>
              <p className="text-xs sm:text-sm text-[hsl(var(--muted-foreground))]">
                Manage banks, vehicles, organizations and related data. Changes are applied immediately.
              </p>
            </div>

            {/* Search Bar */}
            <div className="flex flex-col gap-1.5 sm:items-end">
              <div className="relative w-full sm:w-80">
                <input
                  type="text"
                  placeholder="Search across all visible fields..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full rounded-lg border border-[hsl(var(--border))] bg-[hsl(var(--input))] px-4 py-2.5 pl-9 text-xs sm:text-sm text-[hsl(var(--foreground))] placeholder:text-[hsl(var(--muted-foreground))] focus:outline-none focus:ring-2 focus:ring-[hsl(var(--ring))]"
                />
                <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-[hsl(var(--muted-foreground))] text-sm">
                  🔍
                </span>
              </div>
              <div className="flex items-center gap-2 text-[9px] text-[hsl(var(--muted-foreground))]">
                <span className="inline-flex h-2 w-2 rounded-full bg-[hsl(var(--accent))]" />
                Live filter · Use Refresh if data changes externally
              </div>
            </div>
          </div>
        </div>

        {/* Table Tabs */}
        <div className="flex items-center justify-between gap-2">
          <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
            {TABLES.map((table) => (
              <button
                key={table.id}
                onClick={() => setActiveTable(table.id)}
                className={`flex shrink-0 items-center gap-2 rounded-full px-3.5 py-2 text-[11px] sm:text-xs font-medium transition-all border ${
                  activeTable === table.id
                    ? "bg-[hsl(var(--accent))] text-[hsl(var(--accent-foreground))] border-transparent shadow-sm"
                    : "bg-[hsl(var(--card))] text-[hsl(var(--muted-foreground))] border-[hsl(var(--border))] hover:bg-[hsl(var(--muted))] hover:text-[hsl(var(--foreground))]"
                }`}
              >
                <span className="text-base">{table.icon}</span>
                <span>{table.label}</span>
              </button>
            ))}
          </div>
          <div className="hidden sm:flex items-center gap-2 text-[9px] text-[hsl(var(--muted-foreground))]">
            <span className="inline-flex h-1.5 w-1.5 rounded-full bg-emerald-500" />
            Inline editing: Edit → modify → Save / Cancel
          </div>
        </div>

        {/* Error / Status */}
        {error && (
          <div className="mt-2 flex items-start gap-2 rounded-lg border border-[hsl(var(--destructive))] bg-[hsl(var(--destructive)/0.06)] px-3 py-2 text-[10px] sm:text-xs text-[hsl(var(--destructive))]">
            <span className="mt-0.5 text-base">⚠️</span>
            <div className="space-y-0.5">
              <div className="font-semibold">Action failed</div>
              <div>{error}</div>
            </div>
          </div>
        )}

        {/* Data Table */}
        <div className="card-container overflow-hidden" data-slot="card">
          {loading ? (
            <div className="flex h-64 flex-col items-center justify-center gap-4">
              <div className="h-12 w-12 animate-spin rounded-full border-4 border-[hsl(var(--accent))] border-t-transparent"></div>
              <p className="text-sm text-[hsl(var(--muted-foreground))]">Loading data...</p>
            </div>
          ) : filteredData.length === 0 ? (
            <div className="flex h-64 flex-col items-center justify-center gap-4 text-[hsl(var(--muted-foreground))]">
              <span className="text-6xl">📭</span>
              <div className="text-center">
                <p className="text-lg font-medium">No data found</p>
                <p className="text-sm">{searchTerm ? "Try a different search term" : "This table is empty"}</p>
              </div>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full border-collapse text-xs sm:text-sm">
                <thead className="bg-[hsl(var(--muted)/0.4)]">
                  <tr className="border-b border-[hsl(var(--border))]">
                    <th className="px-3 py-2 text-left text-[9px] sm:text-[10px] font-semibold uppercase tracking-wide text-[hsl(var(--muted-foreground))]">
                      ID
                    </th>
                    {columns.map((col) => (
                      <th
                        key={col}
                        className="px-3 py-2 text-left text-[9px] sm:text-[10px] font-semibold uppercase tracking-wide text-[hsl(var(--muted-foreground))]"
                      >
                        {col.replace(/([A-Z])/g, " $1").replace(/_/g, " ").trim()}
                      </th>
                    ))}
                    <th className="px-3 py-2 text-right text-[9px] sm:text-[10px] font-semibold uppercase tracking-wide text-[hsl(var(--muted-foreground))]">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[hsl(var(--border))]">
                  {filteredData.map((row, idx) => {
                    const rowId = typeof row?.id === "string" ? row.id : undefined;
                    const isEditingRow = rowId !== undefined && editingId === rowId;
                    const displayId = rowId ? `${rowId.substring(0, 8)}...` : "—";
                    const rowKey = rowId ?? `row-${idx}-${activeTable}`;

                    return (
                      <tr
                        key={rowKey}
                        className={`transition-colors hover:bg-[hsl(var(--muted)/0.12)] ${
                          isEditingRow
                            ? "bg-[hsl(var(--accent)/0.04)]"
                            : idx % 2 === 0
                            ? "bg-[hsl(var(--card)/0.4)]"
                            : ""
                        }`}
                      >
                        <td className="px-3 py-2 text-[10px] font-mono text-[hsl(var(--muted-foreground))]">
                          {displayId}
                        </td>
                        {columns.map((col) => (
                          <td
                            key={col}
                            className="px-3 py-2 align-top text-[11px] text-[hsl(var(--foreground))]"
                          >
                            {renderCell(row, col)}
                          </td>
                        ))}
                        <td className="px-3 py-2 text-right">
                          {isEditingRow ? (
                            <div className="flex justify-end gap-1.5">
                              <Button
                                size="sm"
                                className="h-7 px-2 text-[10px] bg-[hsl(var(--accent))] text-[hsl(var(--accent-foreground))]"
                                onClick={handleSave}
                              >
                                💾 Save
                              </Button>
                              <Button
                                size="sm"
                                variant="outline"
                                className="h-7 px-2 text-[10px]"
                                onClick={handleCancel}
                              >
                                ✕ Cancel
                              </Button>
                            </div>
                          ) : rowId ? (
                            <div className="flex justify-end gap-1.5">
                              <Button
                                size="sm"
                                className="h-7 px-2 text-[10px]"
                                onClick={() => handleEdit(row)}
                              >
                                ✏️ Edit
                              </Button>
                              <Button
                                size="sm"
                                variant="destructive"
                                className="h-7 px-2 text-[10px]"
                                onClick={() => handleDelete(rowId)}
                              >
                                🗑️ Delete
                              </Button>
                            </div>
                          ) : (
                            <span className="text-[9px] text-[hsl(var(--muted-foreground))]">
                              No ID
                            </span>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Stats Footer */}
        <div
          className="mt-4 flex flex-col gap-3 rounded-lg bg-[hsl(var(--card))] px-4 py-3 shadow-sm sm:flex-row sm:items-center sm:justify-between"
          data-slot="card"
        >
          <div className="space-y-0.5 text-[10px] sm:text-xs text-[hsl(var(--muted-foreground))]">
            <div>
              Showing{" "}
              <strong className="text-[hsl(var(--foreground))]">
                {filteredData.length}
              </strong>
              {searchTerm && ` of ${data.length}`} records in{" "}
              <strong className="text-[hsl(var(--foreground))]">
                {activeTable}
              </strong>
            </div>
            <div className="text-[9px] text-[hsl(var(--muted-foreground))]">
              Tip: Use the search to quickly locate records. Use the table
              pills above to switch datasets.
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button
              onClick={fetchData}
              disabled={loading}
              className="flex items-center gap-1.5 rounded-md bg-[hsl(var(--accent))] px-3 py-1.5 text-[10px] sm:text-xs font-medium text-[hsl(var(--accent-foreground))] disabled:opacity-60"
            >
              <span className={loading ? "animate-spin" : ""}>🔄</span>
              Refresh
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
