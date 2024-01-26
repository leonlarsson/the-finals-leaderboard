export interface TableUserHistoryErrorProps {
  errors: string[];
}

const TableUserHistoryError = ({ errors }: TableUserHistoryErrorProps) => (
  <>
    <span>Something went wrong while fetching table data</span>
    <br />
    {errors.map((err, i) => (
      <>
        <span key={i}>{err}</span>
        <br />
      </>
    ))}
  </>
);

export default TableUserHistoryError;
