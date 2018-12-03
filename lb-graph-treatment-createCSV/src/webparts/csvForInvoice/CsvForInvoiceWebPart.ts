import * as React from 'react';
import * as ReactDom from 'react-dom';
import { Version } from '@microsoft/sp-core-library';
import {
  BaseClientSideWebPart,
  IPropertyPaneConfiguration,
  PropertyPaneTextField
} from '@microsoft/sp-webpart-base';

import * as strings from 'CsvForInvoiceWebPartStrings';
import CsvForInvoice from './components/CsvForInvoice';
import { ICsvForInvoiceProps } from './components/ICsvForInvoiceProps';
import { MSGraphClient } from '@microsoft/sp-http';
import * as MicrosoftGraph from '@microsoft/microsoft-graph-types';
export interface ICsvForInvoiceWebPartProps {
  description: string;
}

export default class CsvForInvoiceWebPart extends BaseClientSideWebPart<ICsvForInvoiceWebPartProps> {

  public render(): void {
    // const element: React.ReactElement<ICsvForInvoiceProps > = React.createElement(
    //   CsvForInvoice,
    //   {
    //     description: this.properties.description
    //   }
    // );

    //ReactDom.render(element, this.domElement);
    this.context.msGraphClientFactory
     .getClient()
     .then((client: MSGraphClient): void => {
       // get information about the current user from the Microsoft Graph
       client
         .api('/me')
         .get((error, user:MicrosoftGraph.User, rawResponse?: any) => {
           // handle the response
           console.log(user)
       });
     });

  }

  protected onDispose(): void {
    ReactDom.unmountComponentAtNode(this.domElement);
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
