import * as React from 'react';
import styles from '../BusinessValue/BusinessValue.module.scss'
import { IBusinessValueProps } from './IBusinessValueProps';
import { ChoiceGroup, IChoiceGroupOption } from 'office-ui-fabric-react/lib/ChoiceGroup';
import { IBusinessValueState } from './IBusinessValueState';

export default class BusinessValue extends React.Component<IBusinessValueProps, IBusinessValueState> {
  
  

  constructor(props: IBusinessValueProps,state:IBusinessValueState) {
    super(props);
    this.state = {};
    


  }
  
  private _onChange(ev: React.FormEvent<HTMLInputElement>, option: IChoiceGroupOption): void {
    console.dir(option);
  }
  
  public render(): React.ReactElement<IBusinessValueProps> {
    
    
    return (
              <ChoiceGroup
                className={styles.commandText}
                options={this.props.businessValue}
                onChange={this._onChange}
              />

    );
  }
}
