import { IQuery } from '@autoschedule/queries-fn';
import { lens } from 'lens.ts';
import { IConfig } from '@scheduler-tester/core-state/config.interface';
import { IUserstateCollection } from '@scheduler-tester/core-state/userstate-collection.interface';
import { UIState } from '@scheduler-tester/core-state/ui.state';

export enum StepOption {
  every,
  last,
}

export type suitesType = ReadonlyArray<ReadonlyArray<IQuery>>;
export type userstatesType = ReadonlyArray<ReadonlyArray<IUserstateCollection>>;

export interface ICoreState {
  readonly config: IConfig;
  readonly suites: suitesType;
  readonly userstates: userstatesType;
  readonly stepOption: StepOption;
  readonly onTestbenchUserstate: number;
  readonly onTestbenchQueries: number;
  readonly ui: UIState;
}

export const coreStateL = lens<ICoreState>();
