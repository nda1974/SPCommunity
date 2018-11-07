import * as React from 'react';
import * as ReactDom from 'react-dom';
import { Version } from '@microsoft/sp-core-library';
import {
  BaseClientSideWebPart,
  IPropertyPaneConfiguration,
  PropertyPaneTextField,
  WebPartContext
} from '@microsoft/sp-webpart-base';

import * as strings from 'SkadehandbogWebPartStrings';
import { IAppProps } from './components/App/IAppProps';
import App from './components/App/App';
import { IPickerTerms, PropertyFieldTermPicker } from "@pnp/spfx-property-controls/lib/PropertyFieldTermPicker";


export interface ISkadehandbogWebPartProps {
  description: string;
}

export default class SkadehandbogWebPart extends BaseClientSideWebPart<IAppProps> {
 
 
  public render(): void {
    const element: React.ReactElement<IAppProps > = React.createElement(
      App,
      {
        description: this.properties.description,
        terms:this.properties.terms,
        webPartContext:this.context
      }
    );

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
                }),
                PropertyFieldTermPicker('terms', {
                  label: 'Select terms',
                  panelTitle: 'Select terms',
                  initialValues: this.properties.terms,
                  allowMultipleSelections: false,
                  excludeSystemGroup: false,
                  onPropertyChange: this.onPropertyPaneFieldChanged,
                  properties: this.properties,
                  context: this.context,
                  onGetErrorMessage: null,
                  deferredValidationTime: 0,
                  // limitByGroupNameOrID: '3ba507c-3d2e-45c1-83cc-03a2e9db3c36',
                  limitByTermsetNameOrID: 'db2bc258-374d-4422-93ff-a27bebfb5409',
                  key: 'termSetsPickerFieldId'
                })
              ]
            }
          ]
        }
      ]
    };
  }
}
