export interface IItemCmpProps<T> {
  action: (u: any) => void;
  item: T;
  suite: ReadonlyArray<T>;
}