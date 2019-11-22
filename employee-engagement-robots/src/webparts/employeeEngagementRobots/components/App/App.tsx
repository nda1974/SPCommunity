import * as React from 'react';
import styles from '../App/App.module.scss';
import { IAppProps } from './IAppProps';
import { escape } from '@microsoft/sp-lodash-subset';
import { TextField } from 'office-ui-fabric-react/lib/TextField';
import { ChoiceGroup, IChoiceGroupOption } from 'office-ui-fabric-react/lib/ChoiceGroup';
// import {Web} from '@pnp/sp'
import { DefaultButton,Dialog,DialogType} from 'office-ui-fabric-react';
import { Shimmer, ShimmerElementType } from 'office-ui-fabric-react/lib/Shimmer';
import { IAppState, IRobotIdea } from './IAppState';
import * as myLibrary from 'corporate-library';
export default class App extends React.Component<IAppProps, IAppState> {
  constructor(props: IAppProps) {
    super(props);
    this.state = { 
      sections:[],
      isLoading:false,
      showDialog:false,
      businessValue:[],
      robotIdea:{
                  BusinessValue:'',
                  Section:'',
                  Title:''
                }
      
    };

    this._getSharePointData = this._getSharePointData.bind(this);
    this._onBusinessValueChange=this._onBusinessValueChange.bind(this);
    this._onSectionChange=this._onSectionChange.bind(this);
    this._addSharePointData=this._addSharePointData.bind(this);
    this._onSubmitClick=this._onSubmitClick.bind(this);
    this._closeModal=this._closeModal.bind(this);
    
    this._getSharePointData();
  }

  private _onSectionChange(ev: React.FormEvent<HTMLInputElement>, option: IChoiceGroupOption): void {
    console.dir(option);
    var robotIdea:IRobotIdea=this.state.robotIdea;
    robotIdea.Section = option.text;
    this.setState({robotIdea:robotIdea})
  }
  private _onBusinessValueChange(ev: React.FormEvent<HTMLInputElement>, option: IChoiceGroupOption): void {
    console.dir(option);
    var robotIdea:IRobotIdea=this.state.robotIdea;
    robotIdea.BusinessValue = option.text;
    this.setState({robotIdea:robotIdea})
  }
  private _onSubmitClick():void{
    this.setState({isLoading:true},
      ()=>{
        this._addSharePointData();
        this.setState({isLoading:false})
      }

      )
      
  }
  
  
  private async _getSharePointData():Promise<void>{
    const lib = new myLibrary.CorporateLibraryLibrary;

    const pnpjs:any = lib.importPNPJS();
    const w = new pnpjs.Web("https://lbforsikring.sharepoint.com/sites/SFU")
    
    // const list:Promise<any[]> = await w.lists.getById('fc68373d-9dc8-4b52-82d3-8ac0e8085f04').items.getAll().then(r=>{
    //   console.log(r);
    // });
    // const web = new Web("https://lbforsikring.sharepoint.com/sites/SFU");
    
  var businessValuesGroupArray:any[]=[];
    var sectionsValuesGroupArray:any[]=[];

    const b =await w.lists.getById('fc68373d-9dc8-4b52-82d3-8ac0e8085f04').items.getAll().then(
      businessValueProm=>{
        businessValueProm.map(item=>{
          businessValuesGroupArray.push({
            key :item['ID'],
            text: item['Title']
            })
        })
          
      });

    const s =await w.lists.getById('8fc2ef89-4559-4e49-aea0-f7d993c213ca').items.getAll().then(sectionsValueProm=>{
      sectionsValueProm.map(item=>{
        sectionsValuesGroupArray.push({
          key :item['ID'],
          text: item['Title']
          })
      })
          
        })

    this.setState({sections:sectionsValuesGroupArray,businessValue:businessValuesGroupArray})  
    
  }
  private async _addSharePointData():Promise<void>{
    const lib = new myLibrary.CorporateLibraryLibrary;

    const pnpjs:any = lib.importPNPJS();
    const w = new pnpjs.Web("https://lbforsikring.sharepoint.com/sites/SFU")
    
    // const web = new Web("https://lbforsikring.sharepoint.com/sites/SFU");
    
    const res =w.lists.getById('fc578f3b-d500-413d-8f47-b127bd4f663c')
              .items
              .add(
                  { 
                    Title:this.state.robotIdea.Title.length.toString(),
                    Description:this.state.robotIdea.Title,
                    BusinessValue:this.state.robotIdea.BusinessValue,
                    Sections:this.state.robotIdea.Section}
                  )

    res.catch((err)=>{
      this.setState({createItemSucceded:false})
    })
    
    res.then((err)=>{
      this.setState({createItemSucceded:true,showDialog:true})
    })
    
    
    
  }
  private _closeModal = (): void => {
    this.setState({showDialog:false})
  };
  public render(): React.ReactElement<IAppProps> {
    
    
    return (

      <div className={ styles.app }>
        <div className={ styles.container }>
        <Dialog
          hidden={!this.state.showDialog}
          onDismiss={this._closeModal}
          dialogContentProps={{
            type: DialogType.normal,
            title: 'Tak for dit input..',
            subText: 'Din idé er blevet oprettet og vil blive behandlet snarest'
          }}
          modalProps={{
            isBlocking: false,
            styles: { main: { maxWidth: 450 } },
            
          }}
        >
          
        </Dialog>
          
            {this.state.isLoading==true?
            
            <div className={ styles.row }>
              <Shimmer
                      width={'70%'}
                      shimmerElements={[
            { type: ShimmerElementType.circle },
            { type: ShimmerElementType.gap, width: '2%' },
            { type: ShimmerElementType.line },
            { type: ShimmerElementType.circle },
            { type: ShimmerElementType.gap, width: '2%' },
            { type: ShimmerElementType.line },
            { type: ShimmerElementType.circle },
            { type: ShimmerElementType.gap, width: '2%' },
            { type: ShimmerElementType.line }
          ]}
        />
            </div>
            :null}
            
            {this.state.isLoading==false && this.state.createItemSucceded!=false?
            <div>
            <div className={ styles.row }>
                <div className={ styles.title }>
                  Idé: 
                </div>
                  
                <div className={ styles.description }>
                  Beskriv problemet/ uhensigtmæssigheden, som du gerne vil have løst - det forventes ikke at du har en løsning.
                </div>
                
                <TextField  multiline
                            className={styles.textInputField} 
                            rows={10} 
                            onChange={(elem,value)=>{
                              var temp:IRobotIdea=this.state.robotIdea;
                              temp.Title=value;
                              this.setState({robotIdea:temp})
                            }}
                            />
              
            </div>
            <div className={ styles.row }>
                <div className={ styles.title }>
                  Gevinst: 
                </div>
                <div className={ styles.description }>
                  Hvilken forretningsværdi kan forventes
                </div>
                <div className={ styles.radioButton }>
                  <ChoiceGroup  onChange={this._onBusinessValueChange}
                                options={this.state.businessValue}/>
                </div>
            </div>    
            <div className={ styles.row }>
                <div className={ styles.title }>
                Berørt område:
                </div>
                
                <div className={ styles.description }>
                  Hvor i LB får vi direkte effekt?
                </div>
                <div className={ styles.radioButton }>
                  <ChoiceGroup  onChange={this._onSectionChange}
                                options={this.state.sections}/>
                </div>
            </div>
            <div className={ styles.row }>
            <DefaultButton  text="Send idé" 
                            onClick={this._onSubmitClick} 
                            allowDisabledFocus 
                            className={styles.button}
                            />
        
            </div>
          </div>
            :null}
          {this.state.createItemSucceded==false?<div>Tak for hjælpen :-)</div>:null}
          


        
        </div>
                        
      </div>
      
    );
  }
}
