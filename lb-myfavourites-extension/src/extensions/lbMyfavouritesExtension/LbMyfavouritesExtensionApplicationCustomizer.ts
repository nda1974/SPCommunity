import * as React from "react";
import * as ReactDOM from "react-dom";
import { override } from '@microsoft/decorators';
import { Log } from '@microsoft/sp-core-library';

import { Dialog } from '@microsoft/sp-dialog';
import {
  BaseApplicationCustomizer, 
  PlaceholderContent, 
  PlaceholderName 
} from '@microsoft/sp-application-base';
import * as strings from 'LbMyfavouritesExtensionApplicationCustomizerStrings';

import MyFavouritesTopBar from "./components/MyFavouritesTopBar/MyFavouritesTopBar";
import { IMyFavouritesTopBarProps } from "./components/MyFavouritesTopBar/IMyFavouritesTopBarProps";

const LOG_SOURCE: string = 'LbMyfavouritesExtensionApplicationCustomizer';

/**
 * If your command set uses the ClientSideComponentProperties JSON input,
 * it will be deserialized into the BaseExtension.properties object.
 * You can define an interface to describe it.
 */
export interface ILbMyfavouritesExtensionApplicationCustomizerProperties {
  // This is an example; replace with your own property
  testMessage: string;
}

/** A Custom Action which can be run during execution of a Client Side Application */
export default class LbMyfavouritesExtensionApplicationCustomizer
  extends BaseApplicationCustomizer<ILbMyfavouritesExtensionApplicationCustomizerProperties> {

  // @override
  // public onInit(): Promise<void> {
  //   Log.info(LOG_SOURCE, `Initialized ${strings.Title}`);

  //   let message: string = this.properties.testMessage;
  //   if (!message) {
  //     message = '(No properties were provided.)';
  //   }

  //   Dialog.alert(`Hello from ${strings.Title}:\n\n${message}`);

  //   return Promise.resolve();
  // }
  @override
  public onInit(): Promise<void> {
    let placeholder: PlaceholderContent;
    placeholder = this.context.placeholderProvider.tryCreateContent(PlaceholderName.Top);

    // init the react top bar component.
    const element: React.ReactElement<IMyFavouritesTopBarProps> = React.createElement(
      MyFavouritesTopBar,
      {
        context: this.context
      }
    );

    // render the react element in the top placeholder.
    ReactDOM.render(element, placeholder.domElement);

    return Promise.resolve();

  }
}
