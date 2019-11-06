import * as React from 'react';
import styles from './Proceslandskab.module.scss';
import { IProceslandskabProps } from './IProceslandskabProps';
import { escape } from '@microsoft/sp-lodash-subset';
import Taxonomy from './Taxonomy/Taxonomy'
import { IProceslandskabState } from './IProceslandskabState';
import { Domain} from './Domain/Domain'
import {Process} from './Process/Process'
import { classNamesFunction, DefaultButton, IStyle, Overlay, Layer, Spinner, SpinnerSize, SpinnerType } from 'office-ui-fabric-react';

export default class Proceslandskab extends React.Component<IProceslandskabProps, IProceslandskabState> {

  public constructor(props:IProceslandskabProps,state:IProceslandskabState){  
    super(props);
    this.state={
      parentTerms:[],
      childTerms:[],
      childTermsFiltered:[],
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
      this.setState({childTerms:res})
    });
    rhcild.then(
      this._toggleView
    )
  }


  public _showChildTermsNew(domainGuid:string){
    let tax: Taxonomy=new Taxonomy(
      {
          description:''
      }
      );
      
      this.state.childTerms.length==-1?
      tax._getChildTerms(domainGuid).then(res=>{
      this.setState({childTerms:res},this._toggleView)
      }):null;

      const s = this.state.childTerms.filter((elem)=>{
        return elem.Id == domainGuid
      })
      this.setState({childTermsFiltered:s})
  }

  // public _showChildTermsHover(domainGuid:string){
  //   let tax: Taxonomy=new Taxonomy(
  //     {
  //         description:''
  //     }
  //     );
  //     const rhcild = tax._getChildTerms(domainGuid).then(res=>{
  //     this.setState({childTerms:res})
  //   });
  // }
  
  public render(): React.ReactElement<IProceslandskabProps> {
    return (
      <div className={ styles.proceslandskab }>
        <div className={styles.domainContainer} >
          {
            this.state.parentTerms.map(term=>{

              return(
                  term.IsRoot==true?
                  
                    <div onMouseOver={()=>
                      {
                        this._showChildTerms(term.Id)
                      }
                    }
                  >
                  <Domain description='description' 
                          name={term.Name} 
                          url='' 
                          icon='' 
                          hoverCallBack={this._showChildTerms} 
                          id={term.Id} 
                          processes={this.state.childTerms}
                          />
                  
                  </div>:
                  null
              )
            })

          }
          
        </div>
      </div>
    );
  }
  public renderORG(): React.ReactElement<IProceslandskabProps> {
    return (
      <div className={ styles.proceslandskab }>
        <div className={styles.domainContainer} >
          {
            this.state.parentTerms.map(term=>{

              return(
                  term.IsRoot==true?
                  <div onMouseOver={()=>
                    {
                      this._showChildTerms(term.Id);
                    }
                  }>
                  <Domain description='description' 
                          name={term.Name} 
                          url='' 
                          icon='' 
                          hoverCallBack={this._showChildTerms} 
                          id={term.Id} 
                          processes={this.state.childTerms}
                          />
                  
                  </div>:
                  null
              )
            })

          }
          
        </div>
      </div>
    );
  }
}
