import * as React from 'react';
import * as ReactDom from 'react-dom';
import { Version } from '@microsoft/sp-core-library';
import {
  BaseClientSideWebPart,
  IPropertyPaneConfiguration,
  PropertyPaneTextField
} from '@microsoft/sp-webpart-base';

import * as strings from 'GenerateInvoiceCsvFileWebPartStrings';
import GenerateInvoiceCsvFile from './components/GenerateInvoiceCsvFile';
import { IGenerateInvoiceCsvFileProps } from './components/IGenerateInvoiceCsvFileProps';
import { MSGraphClient,MSGraphClientFactory } from '@microsoft/sp-http';
export interface IGenerateInvoiceCsvFileWebPartProps {
  description: string;
}

export default class GenerateInvoiceCsvFileWebPart extends BaseClientSideWebPart<IGenerateInvoiceCsvFileWebPartProps> {

  public render(): void {
    const element: React.ReactElement<IGenerateInvoiceCsvFileProps > = React.createElement(
      this.context.MSGraphClientFactory()
      .getClient()
      .then((client: MSGraphClient): void => {
        // use MSGraphClient here
      });
      GenerateInvoiceCsvFile,
      {
        description: this.properties.description,
        ctx:this.context
        
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
                })
              ]
            }
          ]
        }
      ]
    };
  }
}
