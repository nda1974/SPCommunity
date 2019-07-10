import * as React from 'react';
import styles from './Card.module.scss';
import { ICardProps } from './ICardProps';
import {ICardState} from './ICardState'
import { escape, fromPairs } from '@microsoft/sp-lodash-subset';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import CKEditor from '@ckeditor/ckeditor5-react';
import { sp } from "@pnp/sp";

export default class Card extends React.Component<ICardProps, ICardState> {

  public constructor(props:ICardProps){  
    let interval:any=null;
    let today: Date = new Date();
    //today.setHours(0, 0, 0, 0);
    var offset = new Date().getTimezoneOffset();
    today.setMinutes(today.getMinutes() + offset);

    
    super(props);
  
    this.state= {
                  postItems:[]
                }
}

  public render(): React.ReactElement<ICardProps> {
    return (
      
      
      <div>
        <div>{this.props.posterName}</div>
        <div>{this.props.posterEmail}</div>
        <div>{this.props.createdDate}</div>
        
        <div  dangerouslySetInnerHTML={{ __html: this.props.content }} ></div>
        <br></br>

        
        
      </div>
    );
  }
}
