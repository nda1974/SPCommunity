import * as React from 'react';
import { IAppProps } from './IAppProps';
import { IAppState } from './IAppState';
export default class App extends React.Component<IAppProps, IAppState> {

    public render(): React.ReactElement<IAppProps> {
        return (
            <div>
                Controltype: {this.props.controlsType}
            </div>
        )
    }
}