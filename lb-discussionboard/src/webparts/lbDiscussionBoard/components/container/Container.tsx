import * as React from 'react';
import styles from './Container.module.scss';
import { IContainerProps } from './IContainerProps';
import {IContainerState} from './IContainerState'
import { escape, fromPairs } from '@microsoft/sp-lodash-subset';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import CKEditor from '@ckeditor/ckeditor5-react';
import { sp } from "@pnp/sp";
import {ICardProps} from "../card/ICardProps"
import Card from "../card/Card"
export default class Container extends React.Component<IContainerProps, IContainerState> {

  public constructor(props:IContainerProps){  
    let interval:any=null;
    let today: Date = new Date();
    //today.setHours(0, 0, 0, 0);
    var offset = new Date().getTimezoneOffset();
    today.setMinutes(today.getMinutes() + offset);

    
    super(props);
  
    this.state= {
                  postItems:[]
                }


                sp.setup(
                  {
                    sp: {
                              headers: {
                                  Accept: "application/json; odata=nometadata"
                              },
                              baseUrl:"https://tailgating.sharepoint.com"
                          }
                  }
                )
              //   setup({
              //     sp: {
              //         headers: {
              //             Accept: "application/json; odata=nometadata"
              //         },
              //         baseUrl:"https://lbforsikring.sharepoint.com/sites/intra"
              //     }
              // });
              
              //.filter(`Start lt datetime'${today.toISOString()}' and Slut gt datetime'${today.toISOString()}'`)
              this.fetchSharePointData();
              // pnp.sp.web.lists.getByTitle("Driftmeddelelser")
              // .items.select("Title,Active,Severity,Description,Start,Slut").get().then(
              //   (data:any[])=>{this.setState({listItems:data})}
              // );
    
}
private fetchSharePointData(){

sp.web.lists.getByTitle("SS_Posts")
              .items.select().get().then(
                (data:any[])=>{this.setState({postItems:data})}
              );
}
  public render(): React.ReactElement<IContainerProps> {
    return (
      
      <div className={ styles.container }>
          <div>
          {
            this.state.postItems.map(item=>{
              return<Card content={item.Content} createdDate={item.Created} posterEmail={item.PosterEmail} posterName={item.PosterName} />
            })
          }
          </div>
        <div>I'm a container component</div>
        
        {/* <CKEditor
                    editor={ ClassicEditor }
                    data="<p>Hello from CKEditor 5!</p>"
                    onInit={ editor => {
                        // You can store the "editor" and use when it is needed.
                        console.log( 'Editor is ready to use!', editor );
                    } }
                    onChange={ ( event, editor ) => {
                        const data = editor.getData();
                        console.log( { event, editor, data } );
                    } }
                    onBlur={ editor => {
                        console.log( 'Blur.', editor );
                    } }
                    onFocus={ editor => {
                        console.log( 'Focus.', editor );
                    } }
                /> */}
        <div className={ styles.container }>
          <div className={ styles.row }>
            <div className={ styles.column }>
              <span className={ styles.title }>Welcome to SharePoint!</span>
              <p className={ styles.subTitle }>Customize SharePoint experiences using Web Parts.</p>
              <p className={ styles.description }>{escape(this.props.description)}</p>
              <a href="https://aka.ms/spfx" className={ styles.button }>
                <span className={ styles.label }>Learn more</span>
              </a>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
