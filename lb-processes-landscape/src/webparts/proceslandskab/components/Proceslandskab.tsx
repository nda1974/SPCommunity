import * as React from 'react';
import styles from './Proceslandskab.module.scss';
import { IProceslandskabProps } from './IProceslandskabProps';
import { escape } from '@microsoft/sp-lodash-subset';
import Taxonomy from './Taxonomy/Taxonomy'
import { IProceslandskabState } from './IProceslandskabState';
import {Tile} from './Tile/Tile'
export default class Proceslandskab extends React.Component<IProceslandskabProps, IProceslandskabState> {

  public constructor(props:IProceslandskabProps,state:IProceslandskabState){  
    super(props);
    this.state={
      parentTerms:[],
      childTerms:[],
      showHoverDiv:false,
      domain:""
    }
  
  let tax: Taxonomy=new Taxonomy(
  {
      description:''
  }
  );
  
  const r = tax._getParentTermset().then(res=>{
    this.setState({parentTerms:res})
  });
  

  this.test= this.test.bind(this);
  this.test3= this.test3.bind(this);

    


  }
  
  public test(domain:string){
    this.setState({domain:domain});
    this.setState({showHoverDiv:true});
    this.state.parentTerms.map(item=>{
      if(item.Name===domain){
        if(item.TermsCount>0){
          for (let index = 0; index <item.TermsCount ; index++) {
            const element = item[index];
            console.log(element)
          }
          
        }  
      }
    })
  }
  public test3(){
    this.setState({showHoverDiv:!this.state.showHoverDiv})
  }
  
  public render(): React.ReactElement<IProceslandskabProps> {
    return (
      <div className={ styles.proceslandskab }>
        <div className={this.state.showHoverDiv?styles.containerHide:styles.container}>
        <div className={ styles.tilesList }>
          {
            this.state.parentTerms.map(term=>{
              return(
                <div >
                  {term.IsRoot==true?
                  <Tile description='description' name={term.Name} url='' icon='' hoverCallBack={this.test} id={term.Id} />:
                  null
                  }
                </div>
              )
            })
          }
          
        </div>
        </div>
        
        <div  className={this.state.showHoverDiv?styles.container:styles.containerHide}
              onClick={this.test3}>
          {this.state.domain}
        </div>
      </div>
    );
  }
}
