import * as React from 'react';
import * as ReactDom from 'react-dom';
import { Version } from '@microsoft/sp-core-library';
import {
  BaseClientSideWebPart,
  IPropertyPaneConfiguration,
  PropertyPaneTextField
} from '@microsoft/sp-webpart-base';

import * as strings from 'LbCorporateNewsWebPartStrings';
import App from './components/App/App';
import { IAppProps } from './components/App/IAppProps';

export interface ILbCorporateNewsWebPartProps {
  description: string;
}

export default class LbCorporateNewsWebPart extends BaseClientSideWebPart<ILbCorporateNewsWebPartProps> {

  public render(): void {
    const element: React.ReactElement<IAppProps > = React.createElement(
      App,
      {
        description: this.properties.description,
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
                })
              ]
            }
          ]
        }
      ]
    };
  }
}
