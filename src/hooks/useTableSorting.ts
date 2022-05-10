import { useAppSelector, useAppDispatch } from "../redux/hooks";
import { getTableSorting } from "../redux/appSelectors";
import { IOrder, setTableSorting } from "../redux/appSlice";

export function useTableSorting() {
  const sorting = useAppSelector(getTableSorting);
  const dispatch = useAppDispatch();

  const setSorting = (name: string, property: string, order: IOrder) => {
    dispatch(setTableSorting({ name, property, order }));
  };

  return {
    sorting,
    setSorting,
  };
}
