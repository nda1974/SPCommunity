import * as React from 'react';
import * as ReactDom from 'react-dom';
import { Version } from '@microsoft/sp-core-library';
import {
  BaseClientSideWebPart,
  IPropertyPaneConfiguration,
  PropertyPaneTextField
} from '@microsoft/sp-webpart-base';

import * as strings from 'LbServiceWebshopWebPartStrings';
import { IAppProps } from './components/App/AppProps';
import App from './components/App/App';

export interface ILbServiceWebshopWebPartProps {
  description: string;
}

export default class LbServiceWebshopWebPart extends BaseClientSideWebPart<ILbServiceWebshopWebPartProps> {

  public render(): void {
    const element: React.ReactElement<IAppProps > = React.createElement(
      App,
      {
        description: this.properties.description
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
