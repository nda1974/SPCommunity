import * as React from 'react';
import styles from '../Sections/Sections.module.scss'
import { ISectionsProps } from './ISectionsProps';
import { ChoiceGroup, IChoiceGroupOption } from 'office-ui-fabric-react/lib/ChoiceGroup';
import { ISectionsState } from './ISectionsState';

export default class Sections extends React.Component<ISectionsProps, ISectionsState> {
  
  private choiceGroupSections:any[] = [];
  

  constructor(props: ISectionsProps,state:ISectionsState) {
    super(props);
    this.state = {};
    
    

  }
  
  private _onChange(ev: React.FormEvent<HTMLInputElement>, option: IChoiceGroupOption): void {
    console.dir(option);
  }
  
  public render(): React.ReactElement<ISectionsProps> {
    
    
    return (
              <ChoiceGroup
                className={styles.commandText}
                options={this.props.sections}
                onChange={this._onChange}
              />

    );
  }
}
