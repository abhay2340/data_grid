import { useState } from "react";
import data from "./Test.json";
import "./App.css";
import structure from "./ExtractObjectStructure";
import { getValue } from "./ValueResolver";
import sort from "./sortData";

function App() {

  const { keys, valueMap } = structure(data); 
  console.log("List of keys")
  console.log(keys)
  const [filters, setFilters] = useState<{ [key: string]: string }>({});
  const [toggleInputBox, setToggleInputBox] = useState<{ [key: string]: boolean }>(
    keys.reduce((acc, key) => ({ ...acc, [key]: false }), {})
  );


  console.log("Toggled button Information")
  console.log(toggleInputBox)


  const [filteredData, setFilteredData] = useState(data);


  // Handle the filtere values when filter changes
  const handleFilterChange = (key: string, value: string) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);
    const filtered = data.filter((item) =>
      keys.every((k) => {
        const cellValue = getValue(item, k)?.toString().toLowerCase();
        const filterValue = newFilters[k]?.toString().toLowerCase() || "";
        return cellValue.includes(filterValue);
      })
    );
    
    setFilteredData(filtered);
  };

  // Toggle the Input Type
  const toggleInputType = (key: string) => {
    setToggleInputBox((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  const getSortedValues = (key: string): [string, number][] => {
    return sort(key, valueMap);
  };

 
  const clearFilter=()=>{
    setFilters({})
    setFilteredData(data)
  }

  return (
    <div>
      <button onClick={()=>clearFilter()}>Clear Filters</button>
      <div className="container">
        <table>
          <thead>
            <tr>
              {keys.map((key) => (
                <th key={key}>
                  {key}
                  <br />
                  <button onClick={() => toggleInputType(key)}>{toggleInputBox[key]?"DropDown":"Input"}</button>
                  {toggleInputBox[key] ? (
                    <input
                      type="text"
                      placeholder={`Filter ${key}`}
                      value={filters[key] || ""}
                      onChange={(e) => handleFilterChange(key, e.target.value)}
                    />
                  ) : (
                    <select
                      onChange={(e) => handleFilterChange(key, e.target.value)}
                      value={filters[key] || ""}
                    >
                      <option value="">Select {key}</option>
                      {getSortedValues(key).map(([value, count]) => (
                        <option key={value} value={value}>
                          {value} ({count})
                        </option>
                      ))}
                    </select>
                  )}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filteredData.map((item: any, index: number) => (
              <tr key={index}>
                {keys.map((key: string) => (
                  <td key={`${key}-${index}`}>{getValue(item, key)}</td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default App;
