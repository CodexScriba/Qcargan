"use client";

import { useState, useEffect } from "react";

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

export default function AdminDashboard() {
  const [activeTable, setActiveTable] = useState<TableId>("banks");
  const [data, setData] = useState<any[]>([]);
  const [filteredData, setFilteredData] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editedData, setEditedData] = useState<any>({});
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

  const handleEdit = (row: any) => {
    const primaryKey = row.id || row.vehicleId;
    setEditingId(primaryKey);
    setEditedData({ ...row });
  };

  const handleSave = async () => {
    try {
      const response = await fetch(`/api/admin/${activeTable}/${editingId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editedData),
      });

      if (!response.ok) throw new Error("Failed to update");

      await fetchData();
      setEditingId(null);
      setEditedData({});
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to save");
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

  const handleFieldChange = (field: string, value: any) => {
    setEditedData((prev: any) => ({ ...prev, [field]: value }));
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

  const renderCell = (row: any, key: string) => {
    const value = row[key];
    const primaryKey = row.id || row.vehicleId || '';
    const isEditing = editingId === primaryKey;
    const cellId = `${primaryKey}-${key}`;

    // Handle different data types
    if (value === null || value === undefined) {
      return <span className="text-[hsl(var(--muted-foreground))]">—</span>;
    }

    if (typeof value === "boolean") {
      if (isEditing) {
        return (
          <input
            type="checkbox"
            checked={editedData[key] ?? value}
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
      return (
        <input
          type="text"
          value={editedData[key] ?? value}
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

  const columns = data.length > 0 ? Object.keys(data[0]).filter((key) => key !== "id" && key !== "vehicleId") : [];

  // Get the primary key for the current table (id or vehicleId)
  const getPrimaryKey = (row: any) => {
    return row.id || row.vehicleId || '';
  };

  return (
    <div className="min-h-screen bg-background p-4 sm:p-6">
      <div className="mx-auto max-w-[1800px]">
        {/* Header */}
        <div className="card-container mb-6 sm:mb-8">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="space-y-2">
              <h1 className="text-2xl font-semibold tracking-tight text-[hsl(var(--title-blue))] sm:text-3xl">
                ⚡ Admin Dashboard
              </h1>
              <p className="text-sm text-[hsl(var(--muted-foreground))]">
                Temporary admin panel for managing your Supabase content
              </p>
            </div>

            {/* Search Bar */}
            <div className="relative w-full sm:w-80">
              <input
                type="text"
                placeholder="Search records..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full rounded-lg border border-[hsl(var(--border))] bg-[hsl(var(--input))] px-4 py-2.5 pl-10 text-sm text-[hsl(var(--foreground))] placeholder:text-[hsl(var(--muted-foreground))] focus:outline-none focus:ring-2 focus:ring-[hsl(var(--ring))]"
              />
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[hsl(var(--muted-foreground))]">
                🔍
              </span>
            </div>
          </div>
        </div>

        {/* Table Tabs */}
        <div className="mb-6 flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
          {TABLES.map((table) => (
            <button
              key={table.id}
              onClick={() => setActiveTable(table.id)}
              className={`flex shrink-0 items-center gap-2 rounded-lg px-4 py-2.5 text-sm font-medium transition-all ${
                activeTable === table.id
                  ? "bg-[hsl(var(--accent))] text-[hsl(var(--accent-foreground))] shadow-lg ring-2 ring-[hsl(var(--accent)/0.3)]"
                  : "bg-[hsl(var(--card))] text-[hsl(var(--muted-foreground))] hover:bg-[hsl(var(--muted))] hover:text-[hsl(var(--foreground))] hover:shadow-md"
              }`}
            >
              <span className="text-lg">{table.icon}</span>
              <span>{table.label}</span>
            </button>
          ))}
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-6 flex items-center gap-3 rounded-lg border border-[hsl(var(--destructive))] bg-[hsl(var(--destructive)/0.1)] p-4 text-sm text-[hsl(var(--destructive))]">
            <span className="text-xl">⚠️</span>
            <div>
              <strong>Error:</strong> {error}
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
              <table className="w-full border-collapse">
                <thead className="bg-[hsl(var(--muted)/0.3)]">
                  <tr className="border-b-2 border-[hsl(var(--border))]">
                    <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-[hsl(var(--muted-foreground))]">
                      ID
                    </th>
                    {columns.map((col) => (
                      <th
                        key={col}
                        className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-[hsl(var(--muted-foreground))]"
                      >
                        {col.replace(/([A-Z])/g, " $1").replace(/_/g, " ").trim()}
                      </th>
                    ))}
                    <th className="px-4 py-3 text-right text-xs font-semibold uppercase tracking-wider text-[hsl(var(--muted-foreground))]">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {filteredData.map((row, idx) => {
                    const primaryKey = getPrimaryKey(row);
                    return (
                    <tr
                      key={primaryKey || idx}
                      className={`border-b border-[hsl(var(--border))] transition-colors hover:bg-[hsl(var(--muted)/0.2)] ${
                        editingId === primaryKey ? "bg-[hsl(var(--accent)/0.05)]" : ""
                      } ${idx % 2 === 0 ? "bg-[hsl(var(--card)/0.5)]" : "bg-transparent"}`}
                    >
                      <td className="px-4 py-3 text-xs font-mono text-[hsl(var(--muted-foreground))]">
                        {primaryKey ? `${primaryKey.substring(0, 8)}...` : `Row ${idx + 1}`}
                      </td>
                      {columns.map((col) => (
                        <td key={col} className="px-4 py-3 text-sm text-[hsl(var(--foreground))]">
                          {renderCell(row, col)}
                        </td>
                      ))}
                      <td className="px-4 py-3 text-right">
                        {editingId === primaryKey ? (
                          <div className="flex justify-end gap-2">
                            <button
                              onClick={handleSave}
                              className="rounded-lg bg-[hsl(var(--accent))] px-3 py-1.5 text-xs font-medium text-[hsl(var(--accent-foreground))] shadow-md transition-all hover:bg-[hsl(var(--accent)/0.9)] hover:shadow-lg"
                            >
                              💾 Save
                            </button>
                            <button
                              onClick={handleCancel}
                              className="rounded-lg bg-[hsl(var(--muted))] px-3 py-1.5 text-xs font-medium text-[hsl(var(--muted-foreground))] transition-all hover:bg-[hsl(var(--muted)/0.8)]"
                            >
                              ✕ Cancel
                            </button>
                          </div>
                        ) : (
                          <div className="flex justify-end gap-2">
                            <button
                              onClick={() => handleEdit(row)}
                              className="rounded-lg bg-[hsl(var(--primary))] px-3 py-1.5 text-xs font-medium text-[hsl(var(--primary-foreground))] shadow-md transition-all hover:bg-[hsl(var(--primary)/0.9)] hover:shadow-lg"
                            >
                              ✏️ Edit
                            </button>
                            <button
                              onClick={() => handleDelete(primaryKey)}
                              className="rounded-lg bg-[hsl(var(--destructive))] px-3 py-1.5 text-xs font-medium text-[hsl(var(--destructive-foreground))] shadow-md transition-all hover:bg-[hsl(var(--destructive)/0.9)] hover:shadow-lg"
                            >
                              🗑️ Delete
                            </button>
                          </div>
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
        <div className="mt-6 flex flex-col gap-4 rounded-lg bg-[hsl(var(--card))] px-6 py-4 shadow-md sm:flex-row sm:items-center sm:justify-between" data-slot="card">
          <div className="text-sm text-[hsl(var(--muted-foreground))]">
            Showing{" "}
            <strong className="text-[hsl(var(--foreground))]">{filteredData.length}</strong>
            {searchTerm && ` of ${data.length}`} records in{" "}
            <strong className="text-[hsl(var(--foreground))]">{activeTable}</strong> table
          </div>
          <button
            onClick={fetchData}
            disabled={loading}
            className="flex items-center justify-center gap-2 rounded-lg bg-[hsl(var(--accent))] px-4 py-2 text-sm font-medium text-[hsl(var(--accent-foreground))] shadow-md transition-all hover:bg-[hsl(var(--accent)/0.9)] hover:shadow-lg disabled:opacity-50"
          >
            <span className={loading ? "animate-spin" : ""}>🔄</span>
            Refresh
          </button>
        </div>
      </div>
    </div>
  );
}
