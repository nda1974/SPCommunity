import * as React from 'react';
import styles from '../App/App.module.scss';
import { IAppProps } from './IAppProps';
import { escape } from '@microsoft/sp-lodash-subset';
import { TextField } from 'office-ui-fabric-react/lib/TextField';
import { ChoiceGroup, IChoiceGroupOption } from 'office-ui-fabric-react/lib/ChoiceGroup';
export default class App extends React.Component<IAppProps, {}> {

  private _onChange(ev: React.FormEvent<HTMLInputElement>, option: IChoiceGroupOption): void {
    console.dir(option);
  }
  public render(): React.ReactElement<IAppProps> {
    return (
      <div className={ styles.app }>
        <div className={ styles.container }>
          <div className={ styles.row }>
            <div className={ styles.column }>
              <span className={ styles.title }>Welcome to SharePoint!</span>

              <TextField label="Standard" multiline rows={3} />
              
              <ChoiceGroup
                className="defaultChoiceGroup"
                defaultSelectedKey="B"
                options={[
                  {
                    key: 'A',
                    text: 'Option A'
                  },
                  {
                    key: 'B',
                    text: 'Option B'
                  },
                  {
                    key: 'C',
                    text: 'Option C',
                    disabled: true
                  },
                  {
                    key: 'D',
                    text: 'Option D'
                  }
                ]}
                onChange={this._onChange}
                label="Pick one"
                required={true}
              />

            <ChoiceGroup
                className="defaultChoiceGroup"
                defaultSelectedKey="B"
                options={[
                  {
                    key: 'A',
                    text: 'Option A'
                  },
                  {
                    key: 'B',
                    text: 'Option B'
                  },
                  {
                    key: 'C',
                    text: 'Option C',
                    disabled: true
                  },
                  {
                    key: 'D',
                    text: 'Option D'
                  }
                ]}
                onChange={this._onChange}
                label="Pick one"
                required={true}
              />

              <p className={ styles.subTitle }>Customize SharePoint experiences using Web Parts.</p>
              <p className={ styles.description }>{escape(this.props.description)}</p>
              <a href="https://aka.ms/spfx" className={ styles.button }>
                <span className={ styles.label }>Learn more</span>
              </a>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
