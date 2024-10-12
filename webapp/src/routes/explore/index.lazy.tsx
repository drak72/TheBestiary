import { createLazyFileRoute, useNavigate } from "@tanstack/react-router";
import { useCallback, useMemo, useState, useEffect } from "react";
import {
  AllCommunityModule,
  ModuleRegistry,
  RowClickedEvent,
  colorSchemeDarkBlue,
  themeQuartz,
  ColDef,
} from "ag-grid-community";
import { AgGridReact } from "ag-grid-react";
import { SearchBar } from "@components/SearchBar";

export const Route = createLazyFileRoute("/explore/")({
  component: RouteComponent,
});

// Register all Community features for AG Grid
ModuleRegistry.registerModules([AllCommunityModule]);
const tableTheme = themeQuartz.withPart(colorSchemeDarkBlue);

interface RowData {
  id: string | number;
  [key: string]: string | number | boolean | null | undefined;
}

function RouteComponent() {
  const { rows = [], cols } = Route.useLoaderData();
  const navigate = useNavigate();

  const [colDefs] = useState<ColDef<RowData>[]>(cols ?? []);
  const [searchText, setSearchText] = useState("");
  const [filteredData, setFilteredData] = useState<RowData[]>(mapRows(rows));

  useEffect(() => {
    setFilteredData(mapRows(rows, searchText));
  }, [searchText, rows]);

  const rowSelection = useMemo(() => "single" as const, []);

  const onRowClicked = useCallback(
    (event: RowClickedEvent<RowData>) => {
      const id = event?.node?.data?.id;
      if (id) {
        navigate({ to: "/entity/$id", params: { id } });
      }
    },
    [navigate],
  );

  const onSearchChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      setSearchText(event.target.value);
    },
    [],
  );

  return (
    <div
      style={{
        height: "85vh",
        marginTop: "10vh",
        marginLeft: "2vw",
        marginRight: "2vw",
        zIndex: 80,
      }}
    >
      <SearchBar searchText={searchText} onSearchChange={onSearchChange} />
      <AgGridReact<RowData>
        theme={tableTheme}
        rowData={filteredData}
        columnDefs={colDefs}
        rowSelection={rowSelection}
        onRowClicked={onRowClicked}
      />
    </div>
  );
}

const mapRows = (rows: RowData[], searchText: string = ""): RowData[] => {
  return rows
    .map((row) => ({
      ...row,
      id: row.id.toString(),
    }))
    .filter(
      (row) =>
        !searchText ||
        Object.values(row).some((value) =>
          value?.toString().toLowerCase().includes(searchText.toLowerCase()),
        ),
    );
};
