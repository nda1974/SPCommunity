import * as React from 'react';
import * as ReactDom from 'react-dom';
import { Version } from '@microsoft/sp-core-library';

import {
  BaseClientSideWebPart,
  IPropertyPaneConfiguration,
  PropertyPaneTextField,
  PropertyPaneChoiceGroup
} from '@microsoft/sp-webpart-base';
import * as strings from 'QualityControlControlsListWebPartStrings';
import { IAppProps } from './components/App/IAppProps';
import App from './components/App/App';

export interface IQualityControlControlsListWebPartProps {
  description: string;
  controlsType:string;
}

export default class QualityControlControlsListWebPart extends BaseClientSideWebPart<IQualityControlControlsListWebPartProps> {

  public render(): void {
    const element: React.ReactElement<IAppProps > = React.createElement(
      App,
      {
        controlsType:this.properties.controlsType,
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
                PropertyPaneChoiceGroup('controlsType',{
                  label:'Vælg visning',
                  options:[
                      { key: 'pendingControls', text: 'Mine kontroller'}, 
                      { key: 'submittedControls', text: 'Afsluttede kontroller' }  
                  ]
                })
              ]
            }
          ]
        }
      ]
    };
  }
}
