import { IQuery } from '@autoschedule/queries-fn';
import { lens } from 'lens.ts';
import { IConfig } from './config.interface';
import { IUserstateCollection } from './userstate-collection.interface';
import { UIState } from '../core-state/ui.state';

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
  readonly ui: UIState
}

export const coreStateL = lens<ICoreState>();
