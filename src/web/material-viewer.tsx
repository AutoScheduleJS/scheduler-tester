import * as React from 'react';
import { IMaterial } from '@autoschedule/queries-scheduler';
import { IItemProps } from './timeline';

export class MaterialViewer extends React.PureComponent<IItemProps<IMaterial>> {
  render() {
    const { item } = this.props;
    return (
      <div>
        {item.queryId}-{item.materialId}|{item.end - item.start}
      </div>
    );
  }
}
