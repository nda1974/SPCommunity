import * as React from 'react';
import styles from './Proceslandskab.module.scss';
import { IProceslandskabProps } from './IProceslandskabProps';
import { escape } from '@microsoft/sp-lodash-subset';
import Taxonomy from './Taxonomy/Taxonomy'
import { IProceslandskabState } from './IProceslandskabState';
import { Domain} from './Domain/Domain'
import {Process} from './Process/Process'
import { classNamesFunction, DefaultButton, IStyle, Overlay, Layer } from 'office-ui-fabric-react';

export default class Proceslandskab extends React.Component<IProceslandskabProps, IProceslandskabState> {

  public constructor(props:IProceslandskabProps,state:IProceslandskabState){  
    super(props);
    this.state={
      parentTerms:[],
      childTerms:[],
      showHoverDiv:false,
      domainGuid:"",
      domainName:""
    }
  
  let tax: Taxonomy=new Taxonomy(
  {
      description:''
  }
  );
  
  const r = tax._getParentTermset().then(res=>{
    this.setState({parentTerms:res})
  });

  
  

  this._showChildTerms= this._showChildTerms.bind(this);
  this._toggleView= this._toggleView.bind(this);
  

    


  }
  private _toggleView():void{
    const currentViewStatus:boolean=this.state.showHoverDiv;
    this.setState({showHoverDiv:!currentViewStatus});
  }
  public _showChildTerms(domainGuid:string){
    let tax: Taxonomy=new Taxonomy(
      {
          description:''
      }
      );
      const rhcild = tax._getChildTerms(domainGuid).then(res=>{
      this.setState({childTerms:res},this._toggleView)
    });
  }
  
  
  public render(): React.ReactElement<IProceslandskabProps> {
    return (
      <div className={ styles.proceslandskab }>
        <div className={this.state.showHoverDiv?styles.containerHide:styles.domainContainer}>
        
          {
            this.state.parentTerms.map(term=>{

              return(
                  term.IsRoot==true?
                  <Domain description='description' name={term.Name} url='' icon='' hoverCallBack={this._showChildTerms} id={term.Id} />:
                  null
              )
            })
          }
          
        </div>
        <div  className={this.state.showHoverDiv?styles.processContainer:styles.containerHide}>
          
              {
                this.state.childTerms.map(term=>{
                  return(
                    
                      <Process description='description'  name={term.Name} url='' icon='' hoverCallBack={this._toggleView} id={term.Id} />
                  )
                })
              }
        </div>
        {/* <div  className={this.state.showHoverDiv?styles.container:styles.containerHide}>
              {
                this.state.childTerms.map(term=>{
                  return(
                    <div >
                      <Tile description='description' name={term.Name} url='' icon='' hoverCallBack={this._toggleView} id={term.Id} />
                    </div>
                  )
                })
              }
        </div> */}

        

      </div>
    );
  }
}
