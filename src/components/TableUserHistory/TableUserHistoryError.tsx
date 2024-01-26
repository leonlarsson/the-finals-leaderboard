export interface TableUserHistoryErrorProps {
  errors: string[];
}

const TableUserHistoryError = ({ errors }: TableUserHistoryErrorProps) => (
  <div className="flex flex-col gap-1">
    <span>Something went wrong while fetching table data</span>
    {errors.map((err, i) => (
      <span key={i}>{err}</span>
    ))}
  </div>
);

export default TableUserHistoryError;
