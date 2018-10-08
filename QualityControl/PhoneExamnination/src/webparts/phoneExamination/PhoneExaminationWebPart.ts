import * as React from 'react';
import * as ReactDom from 'react-dom';
import { Version } from '@microsoft/sp-core-library';
import {
  BaseClientSideWebPart,
  IPropertyPaneConfiguration,
  PropertyPaneTextField
} from '@microsoft/sp-webpart-base';

import * as strings from 'PhoneExaminationWebPartStrings';
import PhoneExamination from './components/PhoneExamination';
import { IPhoneExaminationProps } from './components/IPhoneExaminationProps';

export interface IPhoneExaminationWebPartProps {
  description: string;
}

export default class PhoneExaminationWebPart extends BaseClientSideWebPart<IPhoneExaminationWebPartProps> {

  public render(): void {
    const element: React.ReactElement<IPhoneExaminationProps > = React.createElement(
      PhoneExamination,
      {
        description: this.properties.description,
        context:this.context
      }
    );
this.context
    ReactDom.render(element, this.domElement);
  }

  protected get dataVersion(): Version {
    return Version.parse('1.0');
  }

  protected getPropertyPaneConfiguration(): IPropertyPaneConfiguration {
    return {
      pages: [
        {
          header: {
            description: strings.PropertyPaneDescription
          },
          groups: [
            {
              groupName: strings.BasicGroupName,
              groupFields: [
                PropertyPaneTextField('description', {
                  label: strings.DescriptionFieldLabel
                })
              ]
            }
          ]
        }
      ]
    };
  }
}
