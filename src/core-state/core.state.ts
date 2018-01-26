import { IQuery } from '@autoschedule/queries-fn';

import { IUserstateCollection } from './userstate-collection.interface';

export enum StepOption {
  every,
  last,
}

export type suitesType = ReadonlyArray<ReadonlyArray<IQuery>>;
export type userstatesType = ReadonlyArray<ReadonlyArray<IUserstateCollection>>;

export interface ICoreState {
  readonly suites: suitesType;
  readonly userstates: userstatesType;
  readonly stepOption: StepOption;
  readonly onTestbenchUserstate: ReadonlyArray<IUserstateCollection>;
  readonly onTestbenchQueries: ReadonlyArray<IQuery>;
}
