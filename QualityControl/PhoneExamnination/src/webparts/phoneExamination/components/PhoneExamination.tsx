import * as React from 'react';
import styles from './PhoneExamination.module.scss';
import { IPhoneExaminationProps } from './IPhoneExaminationProps';
import { escape } from '@microsoft/sp-lodash-subset';
import { PeoplePicker, PrincipalType } from "@pnp/spfx-controls-react/lib/PeoplePicker";


export default class PhoneExamination extends React.Component<IPhoneExaminationProps, {}> {
  private _getPeoplePickerItems(items: any[]) {
    console.log('Items:', items);
  }
  
  public render(): React.ReactElement<IPhoneExaminationProps> {
    return (
      <div className={ styles.phoneExamination }>
        <div className={ styles.container }>
          <div className={ styles.row }>
            <div className={ styles.column }>
              <span className={ styles.title }>Welcome to SharePoint!</span>
              <p className={ styles.subTitle }>Customize SharePoint experiences using Web Parts.</p>
              <p className={ styles.description }>{escape(this.props.description)}</p>
              <a href="https://aka.ms/spfx" className={ styles.button }>
                <span className={ styles.label }>Learn more</span>
              </a>
              <PeoplePicker
                context={this.props.context}
                titleText="People Picker"
                personSelectionLimit={3}
                groupName={""} // Leave this blank in case you want to filter from all users
                showtooltip={false}
                isRequired={false}
                disabled={false}
                selectedItems={this._getPeoplePickerItems}
                showHiddenInUI={false}
                principleTypes={[PrincipalType.User]} />

            </div>
          </div>
        </div>
      </div>
    );
  }
}
