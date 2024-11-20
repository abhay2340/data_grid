import React, { useState } from "react";

const extractKeys = (data: Record<string, any>[], parentKey = ""): string[] => {
  const keys: string[] = [];
  data.forEach((item) => {
    Object.keys(item).forEach((key) => {
      const fullKey = parentKey ? `${parentKey}.${key}` : key;
      if (typeof item[key] === "object" && !Array.isArray(item[key]) && item[key] !== null) {
        keys.push(...extractKeys([item[key]], fullKey));
      } else {
        if (!keys.includes(fullKey)) keys.push(fullKey);
      }
    });
  });
  return keys;
};
const getValue = (obj: Record<string, any>, path: string): any => {
  return path.split(".").reduce((acc, key) => (acc ? acc[key] : undefined), obj);
};

interface TesttProps {
  data: Record<string, any>[]; // The dataset
  dropdownColumns?: string[]; // Columns that should use dropdowns for filtering
  onRowClick?: (row: Record<string, any>) => void; // Callback for row click
}

const Testt: React.FC<TesttProps> = ({ data, dropdownColumns = [], onRowClick }) => {
  const [filters, setFilters] = useState<Record<string, string>>({});
  const [filteredData, setFilteredData] = useState(data);

  const columns = data.length > 0 ? extractKeys(data) : [];

  // Handle filtering logic
  const handleFilterChange = (key: string, value: string) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);

    const newFilteredData = data.filter((row) => {
      return Object.keys(newFilters).every((filterKey) => {
        const filterValue = newFilters[filterKey];
        if (!filterValue) return true;
        const cellValue = getValue(row, filterKey);
        return cellValue?.toString().toLowerCase().includes(filterValue.toLowerCase());
      });
    });

    setFilteredData(newFilteredData);
  };

  return (
    <div>
      <table border={1} style={{ width: "100%", textAlign: "left", borderCollapse: "collapse" }}>
        <thead>
          <tr>
            {columns.map((col) => (
              <th key={col}>
                {col}
                <div>
                  {dropdownColumns.includes(col) ? (
                    <select
                      value={filters[col] || ""}
                      onChange={(e) => handleFilterChange(col, e.target.value)}
                      style={{ width: "100%" }}
                    >
                      <option value="">All</option>
                      {[...new Set(data.map((row) => getValue(row, col)))].map((option) => (
                        <option key={option} value={option}>
                          {option}
                        </option>
                      ))}
                    </select>
                  ) : (
                    <input
                      type="text"
                      placeholder={`Filter ${col}`}
                      value={filters[col] || ""}
                      onChange={(e) => handleFilterChange(col, e.target.value)}
                      style={{ width: "100%", padding: "4px" }}
                    />
                  )}
                </div>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {filteredData.length > 0 ? (
            filteredData.map((row, rowIndex) => (
              <tr
                key={rowIndex}
                onClick={() => onRowClick?.(row)}
                style={{ cursor: onRowClick ? "pointer" : "default" }}
              >
                {columns.map((col) => (
                  <td key={`${rowIndex}-${col}`}>{getValue(row, col) || ""}</td>
                ))}
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={columns.length} style={{ textAlign: "center" }}>
                No Data Found
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default Testt;
