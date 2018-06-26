import * as React from 'react';
import * as ReactDom from 'react-dom';
import { Version } from '@microsoft/sp-core-library';
import {
  BaseClientSideWebPart,
  IPropertyPaneConfiguration,
  PropertyPaneTextField
} from '@microsoft/sp-webpart-base';

import * as strings from 'LbSkadeWorkprocessWebPartStrings';
import App from '../lbSkadeWorkprocess/components/App/App';
import { IAppProps } from './components/App/App';

export interface ILbSkadeWorkprocessWebPartProps {
  description: string;
}

export default class LbSkadeWorkprocessWebPart extends BaseClientSideWebPart<ILbSkadeWorkprocessWebPartProps> {

  public render(): void {
    const element: React.ReactElement<IAppProps > = React.createElement(
      App,
      {
        manualType: "Skadearbejdsbeskrivelse",
        webPartContext:this.context,
        searchUrl:""
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
