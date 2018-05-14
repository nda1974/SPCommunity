/* tslint:disable:no-unused-variable */
import * as React from 'react';
/* tslint:enable:no-unused-variable */

import { DefaultButton, IButtonProps } from 'office-ui-fabric-react/lib/Button';
import { TeachingBubble } from 'office-ui-fabric-react/lib/TeachingBubble';
import { Link } from 'office-ui-fabric-react/lib/Link';
import { Callout } from 'office-ui-fabric-react/lib/Callout';
import styles from './TeachingBubbleBasicExample.module.scss'
// import { style } from 'glamor';
export interface ITeachingBubbleBasicExampleState {
    isTeachingBubbleVisible?: boolean;
    
}
export interface ITeachingBubbleBasicExampleProps{
  text?:string;
  targetUrl:string;
  showButtonLabel:string;
  hideButtonLabel:string;
  headLine:string;
  iconName:string;
}

export class TeachingBubbleBasicExample extends React.Component<ITeachingBubbleBasicExampleProps,ITeachingBubbleBasicExampleState> {
  private _menuButtonElement: HTMLElement;

  constructor(props: ITeachingBubbleBasicExampleProps,state: ITeachingBubbleBasicExampleState) {
    super(props);

    this._onDismiss = this._onDismiss.bind(this);

    this.state = {
      isTeachingBubbleVisible: false,
    };
  }

  public render() {
    let { isTeachingBubbleVisible } = this.state;
    let examplePrimaryButton: IButtonProps = {
      children: 'Åbn vilkår',
      href:this.props.targetUrl,
      target:'_blank'
      
    };
    let exampleSecondaryButtonProps: IButtonProps = {
      children: 'Luk',
      onClick: this._onDismiss
      
    };

    return (
      <div className='ms-Grid-col'>
        <span className={styles.TeachingBubbleButton} ref={ (menuButton) => this._menuButtonElement = menuButton! }>
          <DefaultButton
          className={styles.TeachingBubbleButton}
            onClick={ this._onDismiss }
            text={ isTeachingBubbleVisible ? this.props.hideButtonLabel : this.props.showButtonLabel }
            iconProps={{ iconName: this.props.iconName }}
          />
        </span>
        { isTeachingBubbleVisible ? (
          <div className={styles.MyWidth}  >
            <TeachingBubble
              targetElement={ this._menuButtonElement }
              primaryButtonProps={ examplePrimaryButton }
              secondaryButtonProps={ exampleSecondaryButtonProps }
              onDismiss={ this._onDismiss }
              headline={this.props.headLine}
            >

                
                <div>{this.props.text}
                
                  {/* <Link href='http://dev.office.com/fabric/components/link'>Se afgørelse.</Link> */}
                </div>
                
                
            </TeachingBubble>
          </div>
        ) : (null) }
      </div>
    );
  }

  private _onDismiss(ev: any) {
    this.setState({
      isTeachingBubbleVisible: !this.state.isTeachingBubbleVisible
    });
  }
}