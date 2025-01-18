import { BipolarJunctionTransistorModel } from "@/components/context/SpiceContext/SpiceContext";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from "@/components/ui/table";
import { FC, useMemo, useRef, useState } from "react";
import {
  ColumnDef,
  ColumnFiltersState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable
} from "@tanstack/react-table";
import Acronym from "@/components/ui/acronym";
import { useReactFlow } from "@xyflow/react";
import { AppNode } from "../../../../types";
import { AppEdge } from "@/components/Editor/components/canvas/edges/types";
import { Button } from "@/components/ui/Button";
import clsx from "clsx";
import { useVirtualizer } from "@tanstack/react-virtual";
import { Input } from "@/components/ui/input";

const columns: ColumnDef<BipolarJunctionTransistorModel>[] = [
  {
    accessorKey: "name",
    header: "Name",
    cell: ({ getValue }) => getValue<string>()
  },
  {
    accessorKey: "polarity",
    header: "Polarity",
    cell: ({ getValue }) => getValue<string>()
  },
  {
    accessorKey: "is",
    header: () => <Acronym helper="Transport Saturation Current">IS</Acronym>,
    cell: ({ getValue }) => getValue<string>() || "-"
  },
  {
    accessorKey: "xti",
    header: () => <Acronym helper="Temperature Effect Exponent">XTI</Acronym>,
    cell: ({ getValue }) => getValue<string>() || "-"
  },
  {
    accessorKey: "eg",
    header: () => <Acronym helper="Bandgap Voltage">EG</Acronym>,
    cell: ({ getValue }) => getValue<string>() || "-"
  },
  {
    accessorKey: "vaf",
    header: () => <Acronym helper="Forward Early Voltage">VAF</Acronym>,
    cell: ({ getValue }) => getValue<string>() || "-"
  },
  {
    accessorKey: "bf",
    header: () => <Acronym helper="Maximum Forward Beta">BF</Acronym>,
    cell: ({ getValue }) => getValue<string>() || "-"
  },
  {
    accessorKey: "ise",
    header: () => <Acronym helper="Emitter Leakage Current">ISE</Acronym>,
    cell: ({ getValue }) => getValue<string>() || "-"
  },
  {
    accessorKey: "ne",
    header: () => <Acronym helper="Leakage Emission Coefficient">NE</Acronym>,
    cell: ({ getValue }) => getValue<string>() || "-"
  },
  {
    accessorKey: "ikf",
    header: () => <Acronym helper="Forward High-Current Roll-Off">IKF</Acronym>,
    cell: ({ getValue }) => getValue<string>() || "-"
  },
  {
    accessorKey: "nk",
    header: () => (
      <Acronym helper="High-Current Roll-Off Coefficient">NK</Acronym>
    ),
    cell: ({ getValue }) => getValue<string>() || "-"
  },
  {
    accessorKey: "xtb",
    header: () => <Acronym helper="Beta Temperature Coefficient">XTB</Acronym>,
    cell: ({ getValue }) => getValue<string>() || "-"
  },
  {
    accessorKey: "br",
    header: () => <Acronym helper="Maximum Reverse Beta">BR</Acronym>,
    cell: ({ getValue }) => getValue<string>() || "-"
  },
  {
    accessorKey: "isc",
    header: () => <Acronym helper="Collector Leakage Current">ISC</Acronym>,
    cell: ({ getValue }) => getValue<string>() || "-"
  },
  {
    accessorKey: "nc",
    header: () => <Acronym helper="Leakage Emission Coefficient">NC</Acronym>,
    cell: ({ getValue }) => getValue<string>() || "-"
  },
  {
    accessorKey: "ikr",
    header: () => <Acronym helper="Reverse High-Current Roll-Off">IKR</Acronym>,
    cell: ({ getValue }) => getValue<string>() || "-"
  },
  {
    accessorKey: "rc",
    header: () => <Acronym helper="Ohmic Resistance">RC</Acronym>,
    cell: ({ getValue }) => getValue<string>() || "-"
  },
  {
    accessorKey: "cjc",
    header: () => (
      <Acronym helper="Collector Zero-Bias Capacitance">CJC</Acronym>
    ),
    cell: ({ getValue }) => getValue<string>() || "-"
  },
  {
    accessorKey: "mjc",
    header: () => <Acronym helper="Collector P-N Grading Factor">MJC</Acronym>,
    cell: ({ getValue }) => getValue<string>() || "-"
  },
  {
    accessorKey: "vjc",
    header: () => <Acronym helper="Collector Built-In Potential">VJC</Acronym>,
    cell: ({ getValue }) => getValue<string>() || "-"
  },
  {
    accessorKey: "fc",
    header: () => (
      <Acronym helper="Depletion Capacitance Coefficient">FC</Acronym>
    ),
    cell: ({ getValue }) => getValue<string>() || "-"
  },
  {
    accessorKey: "cje",
    header: () => <Acronym helper="Emitter Zero-Bias Capacitance">CJE</Acronym>,
    cell: ({ getValue }) => getValue<string>() || "-"
  },
  {
    accessorKey: "mje",
    header: () => <Acronym helper="Emitter P-N Grading Factor">MJE</Acronym>,
    cell: ({ getValue }) => getValue<string>() || "-"
  },
  {
    accessorKey: "vje",
    header: () => <Acronym helper="Emitter Built-In Potential">VJE</Acronym>,
    cell: ({ getValue }) => getValue<string>() || "-"
  },
  {
    accessorKey: "tr",
    header: () => <Acronym helper="Reverse Transit Time">TR</Acronym>,
    cell: ({ getValue }) => getValue<string>() || "-"
  },
  {
    accessorKey: "tf",
    header: () => <Acronym helper="Forward Transit Time">TF</Acronym>,
    cell: ({ getValue }) => getValue<string>() || "-"
  },
  {
    accessorKey: "itf",
    header: () => <Acronym helper="Transit Time vs. Ic">ITF</Acronym>,
    cell: ({ getValue }) => getValue<string>() || "-"
  },
  {
    accessorKey: "xtf",
    header: () => <Acronym helper="Bias Dependence Coefficient">XTF</Acronym>,
    cell: ({ getValue }) => getValue<string>() || "-"
  },
  {
    accessorKey: "vtf",
    header: () => <Acronym helper="Transit Time vs. Vbc">VTF</Acronym>,
    cell: ({ getValue }) => getValue<string>() || "-"
  },
  {
    accessorKey: "rb",
    header: () => <Acronym helper="Base Resistance">RB</Acronym>,
    cell: ({ getValue }) => getValue<string>() || "-"
  }
];

interface PickModelProps {
  models: BipolarJunctionTransistorModel[];
  handleClose(): void;
  id: string;
  currentModel: Partial<BipolarJunctionTransistorModel> | undefined;
}

const PickModel: FC<PickModelProps> = ({
  models,
  handleClose,
  id,
  currentModel
}) => {
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);

  const { setNodes } = useReactFlow<AppNode, AppEdge>();

  const [pickedTransistor, setPickedTransistor] =
    useState<BipolarJunctionTransistorModel | null>(null);

  // Only uses the model
  const onUse = () => {
    if (!pickedTransistor) return;

    setNodes((nodes) =>
      nodes.map((node) => {
        if (node.id === id) {
          const bjtNode = {
            ...node,
            data: {
              ...node.data,
              data: { model: pickedTransistor }
            }
          } as AppNode;

          return bjtNode;
        }

        return node;
      })
    );
    handleClose();
  };

  const sortedModels = useMemo(
    () => models.sort((a, b) => a.name.localeCompare(b.name)),
    [models]
  );

  const table = useReactTable({
    data: sortedModels,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnFiltersChange: setColumnFilters,
    state: {
      columnFilters
    },
    initialState: {
      pagination: {
        pageSize: models.length
      },
      columnFilters
    }
  });

  const { rows } = table.getRowModel();

  const scrollableRef = useRef<HTMLDivElement | null>(null);

  const virtualizer = useVirtualizer({
    count: rows.length,
    getScrollElement: () => scrollableRef.current,
    estimateSize: () => 53,
    overscan: 20
  });

  const isEmpty = sortedModels.length === 0;

  return (
    <div className="flex flex-col grow px-1">
      <Input
        className="mb-2"
        placeholder="Search by name"
        value={(table.getColumn("name")?.getFilterValue() as string) ?? ""}
        onChange={(event) =>
          table.getColumn("name")?.setFilterValue(event.target.value)
        }
      />
      <div
        ref={scrollableRef}
        className="overflow-auto bg-card rounded-lg border-2 max-w-full grow h-[450px]"
      >
        <div style={{ height: `${virtualizer.getTotalSize()}px` }}>
          <Table>
            <TableHeader>
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id}>
                  {headerGroup.headers.map((header) => {
                    return (
                      <TableHead key={header.id}>
                        {header.isPlaceholder
                          ? null
                          : flexRender(
                              header.column.columnDef.header,
                              header.getContext()
                            )}
                      </TableHead>
                    );
                  })}
                </TableRow>
              ))}
            </TableHeader>
            <TableBody>
              {!isEmpty ? (
                virtualizer.getVirtualItems().map((virtualRow, index) => {
                  const row = rows[virtualRow.index];

                  return (
                    <TableRow
                      className={clsx("cursor-pointer", {
                        "!bg-primary/50":
                          row.original.name ===
                          (pickedTransistor?.name || currentModel?.name),
                        "!bg-primary/15":
                          currentModel &&
                          pickedTransistor &&
                          currentModel.name !== pickedTransistor.name &&
                          row.original.name === currentModel.name
                      })}
                      style={{
                        height: virtualRow.size,
                        transform: `translateY(${
                          virtualRow.start - index * virtualRow.size
                        }px)`
                      }}
                      onClick={() => setPickedTransistor(row.original)}
                      key={row.id}
                    >
                      {row.getVisibleCells().map((cell) => (
                        <TableCell key={cell.id}>
                          {flexRender(
                            cell.column.columnDef.cell,
                            cell.getContext()
                          )}
                        </TableCell>
                      ))}
                    </TableRow>
                  );
                })
              ) : (
                <TableRow>
                  <TableCell
                    colSpan={columns.length}
                    className="h-24 text-center"
                  >
                    No results.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </div>
      <div className="mt-4 w-full flex justify-end gap-2">
        <Button
          disabled={!pickedTransistor}
          variant="ghost"
          onClick={() => setPickedTransistor(null)}
        >
          Clear selection
        </Button>
        <Button
          onClick={onUse}
          className="min-w-[150px]"
          disabled={!pickedTransistor}
        >{`Use${pickedTransistor ? ` ${pickedTransistor.name}` : ""}`}</Button>
      </div>
    </div>
  );
};

export default PickModel;
