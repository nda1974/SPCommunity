import * as React from 'react';
import * as ReactDom from 'react-dom';
import { Version } from '@microsoft/sp-core-library';
import { BaseClientSideWebPart } from '@microsoft/sp-webpart-base';
import {
  IPropertyPaneConfiguration,
  PropertyPaneTextField
} from '@microsoft/sp-property-pane';

import * as strings from 'PocDevOpsWebPartStrings';
import PocDevOps from './components/PocDevOps';
import { IPocDevOpsProps } from './components/IPocDevOpsProps';

export interface IPocDevOpsWebPartProps {
  description: string;
}

export default class PocDevOpsWebPart extends BaseClientSideWebPart<IPocDevOpsWebPartProps> {

  public render(): void {
    const element: React.ReactElement<IPocDevOpsProps > = React.createElement(
      PocDevOps,
      {
        description: this.properties.description
      }
    );

    ReactDom.render(element, this.domElement);
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
