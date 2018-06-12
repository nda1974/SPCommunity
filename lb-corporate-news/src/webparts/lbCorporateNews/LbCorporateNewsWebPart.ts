import * as React from 'react';
import * as ReactDom from 'react-dom';
import { Version } from '@microsoft/sp-core-library';
import {
  BaseClientSideWebPart,
  IPropertyPaneConfiguration,
  PropertyPaneTextField
} from '@microsoft/sp-webpart-base';

import * as strings from 'LbCorporateNewsWebPartStrings';
import LbCorporateNews from './components/LbCorporateNews';
import { ILbCorporateNewsProps } from './components/ILbCorporateNewsProps';

export interface ILbCorporateNewsWebPartProps {
  description: string;
}

export default class LbCorporateNewsWebPart extends BaseClientSideWebPart<ILbCorporateNewsWebPartProps> {

  public render(): void {
    const element: React.ReactElement<ILbCorporateNewsProps > = React.createElement(
      LbCorporateNews,
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
