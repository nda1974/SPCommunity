import * as React from 'react';
import * as ReactDom from 'react-dom';
import { Version } from '@microsoft/sp-core-library';
import { BaseClientSideWebPart } from '@microsoft/sp-webpart-base';
import {
  IPropertyPaneConfiguration,
  PropertyPaneTextField
} from '@microsoft/sp-property-pane';

import * as strings from 'OverforTilAndenPuWebPartStrings';
import App from './components/App/App';
import { IAppProps } from './components/App/IAppProps';
import { LinkBase } from 'office-ui-fabric-react';

export interface IOverforTilAndenPuWebPartProps {
  description: string;
}

export default class OverforTilAndenPuWebPart extends BaseClientSideWebPart<IAppProps> {

  public render(): void {
    
    const element: React.ReactElement<IAppProps > = React.createElement(
      App,
      {
        // currentUserEmail: this.context.pageContext.user.email
        currentUserEmail: "kigl@lb.dk"
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
