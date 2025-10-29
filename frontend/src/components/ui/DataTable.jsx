import React, { useEffect, useRef } from 'react';
import { DataTable as SimpleDataTable } from 'simple-datatables';

const DataTable = ({ 
  columns = [], 
  data = [], 
  searchable = true,
  sortable = true,
  perPage = 10,
  className = ''
}) => {
  const tableRef = useRef(null);
  const datatableRef = useRef(null);

  useEffect(() => {
    if (tableRef.current && data.length > 0) {
      // Destroy existing instance
      if (datatableRef.current) {
        datatableRef.current.destroy();
      }

      // Create new instance
      datatableRef.current = new SimpleDataTable(tableRef.current, {
        searchable,
        sortable,
        perPage,
        tableRender: (_data, table, type) => {
          if (type === "print") {
            return table;
          }
          
          if (searchable) {
            const tHead = table.childNodes[0];
            const filterHeaders = {
              nodeName: "TR",
              attributes: {
                class: "search-filtering-row"
              },
              childNodes: tHead.childNodes[0].childNodes.map(
                (_th, index) => ({
                  nodeName: "TH",
                  childNodes: [
                    {
                      nodeName: "INPUT",
                      attributes: {
                        class: "datatable-input px-2 py-1 text-sm border border-gray-300 rounded",
                        type: "search",
                        "data-columns": "[" + index + "]",
                        placeholder: `Filter ${columns[index]?.header || ''}`
                      }
                    }
                  ]
                })
              )
            };
            tHead.childNodes.push(filterHeaders);
          }
          
          return table;
        }
      });
    }

    return () => {
      if (datatableRef.current) {
        datatableRef.current.destroy();
      }
    };
  }, [data, columns, searchable, sortable, perPage]);

  return (
    <div className={`overflow-x-auto ${className}`}>
      <table 
        ref={tableRef}
        className="w-full text-sm text-left text-gray-500 dark:text-gray-400"
      >
        <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
          <tr>
            {columns.map((column, index) => (
              <th key={index} scope="col" className="px-6 py-3">
                <span className="flex items-center">
                  {column.header}
                  {sortable && (
                    <svg className="w-4 h-4 ms-1" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
                      <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m8 15 4 4 4-4m0-6-4-4-4 4"/>
                    </svg>
                  )}
                </span>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((row, rowIndex) => (
            <tr key={rowIndex} className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600">
              {columns.map((column, colIndex) => (
                <td key={colIndex} className="px-6 py-4">
                  {column.render 
                    ? column.render(row, rowIndex) 
                    : row[column.accessor]
                  }
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default DataTable;