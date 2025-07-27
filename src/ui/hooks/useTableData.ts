import { useState, useCallback } from "react";
import { TableRecord } from "src/types/form-data.type";

export const useTableData = () => {
  const [data, setData] = useState<TableRecord[]>([]);

  const addRecord = useCallback((record: TableRecord) => {
    setData((prev) => [...prev, record]);
  }, []);

  const deleteRecord = useCallback((key: string) => {
    setData((prev) => prev.filter((item) => item.key !== key));
  }, []);

  return {
    data,
    addRecord,
    deleteRecord,
  };
};
