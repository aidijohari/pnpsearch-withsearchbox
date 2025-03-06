import * as React from 'react';
// import styles from './PnpSearchApp.module.scss';
import { IPnpSearchAppProps } from './IPnpSearchAppProps';
import DataGridView from './DataGrid';
// import { escape } from '@microsoft/sp-lodash-subset';

export default class PnpSearchApp extends React.Component<IPnpSearchAppProps, {}> {
  public render(): React.ReactElement<IPnpSearchAppProps> {
    const {
      context
    } = this.props;

    return (
      <section>
        <DataGridView context={context}/>
      </section>
    );
  }
}
