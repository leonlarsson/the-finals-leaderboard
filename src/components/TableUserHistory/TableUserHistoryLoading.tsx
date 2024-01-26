import { TableCell, TableRow } from "@/components/ui/table.tsx";
import LinearProgress from "@mui/material/LinearProgress";

export interface TableUserHistoryLoadingProps {
  colSpan: number;
}

const TableUserHistoryLoading = ({ colSpan }: TableUserHistoryLoadingProps) => (
  <TableRow>
    <TableCell colSpan={colSpan} style={{ padding: 0 }}>
      <LinearProgress />
    </TableCell>
  </TableRow>
);

export default TableUserHistoryLoading;
