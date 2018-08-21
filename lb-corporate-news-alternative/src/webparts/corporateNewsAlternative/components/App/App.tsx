import * as React from 'react';
import { escape } from '@microsoft/sp-lodash-subset';
import { IAppProps } from './IAppProps';
import styles from './App.module.scss'
import { IAppState } from './IAppState';
import pnp, {  setup } from "sp-pnp-js";
import NewsItem from '../NewsItem/NewsItem'
import { Link } from 'office-ui-fabric-react/lib/Link';
import PrimaryNewsItem from '../PrimaryNewsItem/PrimaryNewsItem';
import FeaturedNewsContainer from '../FeaturedNewsContainer/FeaturedNewsContainer';
  
export default class App extends React.Component<IAppProps, IAppState> {
  public constructor(props: IAppProps,state:IAppState){  
        super(props);  
          setup({
            sp: {
                headers: {
                    Accept: "application/json; odata=nometadata"
                },
                baseUrl:"https://lbforsikring.sharepoint.com/sites/intra"
            },
          });

          this.state = {
                    results:[]
          }

          this.fetchSharePointData();
}

private fetchSharePointData(){
 let filterAfsender :string=this.props.filter;
 
  var startDate = new Date();
  
   pnp.sp.web.lists.getByTitle("Webstedssider")
              .items.select("CorporateNews,Publiseringsdato,PrioriteretVisning,Title,Udl%5Fx00f8%5Fbsdato,LBNyhedsbillede,FileRef,Teaser,Afsender/Title")
              .expand("Afsender")
              .filter(`Publiseringsdato le datetime'${startDate.toISOString()}' and Udl%5Fx00f8%5Fbsdato gt datetime'${startDate.toISOString()}'`)
              .orderBy('Publiseringsdato')
              .get().then(
                (data:any[])=>{

                  
                  let P1News:any[]=[];
                  let P2News:any[]=[];
                  let P3News:any[]=[];
                  let res:any[]=[];


                  data.map((item)=>{

                            
                    // if(filterAfsender.length>0 ){
                    if(filterAfsender){
                      if(item.Afsender){
                          item.Afsender.map((afsender)=>{
                            if(afsender.Title==filterAfsender){
                              if(item.PrioriteretVisning==1){
                                P1News.push(item)
                              }
                              else if(item.PrioriteretVisning==2){
                                P2News.push(item)
                              }
                              else if(item.PrioriteretVisning==3){
                                P3News.push(item)
                              }
                            }  
                          })
                      }
                    } 
                    else
                    {
                      if(item.PrioriteretVisning==1){
                        P1News.push(item)
                      }
                      else if(item.PrioriteretVisning==2){
                        P2News.push(item)
                      }
                      else if(item.PrioriteretVisning==3){
                        P3News.push(item)
                      }
                    }

                    
                  });

                  P1News.map((item)=>{
                    res.push(item);
                  })
                  P2News.map((item)=>{
                    res.push(item);
                  })
                  P3News.map((item)=>{
                    res.push(item);
                  })
                  
                  
                  this.setState({'results':res});

                }
              );
}  
private getSenders(newsItem):string{
  
  let res="";
  newsItem.Afsender.map((item)=>{
    res=res + item.Title + ", "
  })
  
  return res.slice(0,-2);
}
public render(): React.ReactElement<IAppProps> {
    
    let counter :number=0;
    let counter2 :number=0;
    
    return (
      <div className='ms-Grid' >
        <div className='ms-Grid-row'>
            {
              this.state.results.map((item)=>{
                counter++;
                
                if (counter==1) {
                  return <PrimaryNewsItem documentTitle={item.Title} previewImageUrl='https://lbforsikring.sharepoint.com/sites/Intra/SiteAssets/Nyheder/Acubiz.png?csf=1&e=Mw2owT' documentDescription={item.Teaser} sender={this.getSenders(item)}/>
                }
                
                  
              })
              
            }
            <FeaturedNewsContainer featuredNewsList={this.state.results} /> 
            
          
          

          
        
        </div>
      </div> 
          /*{ <div className={styles.FeaturedNewsItems}>
            {
              this.state.results.map((item)=>{
                counter=counter+1;  
                let pictureUrl = item.LBNyhedsbillede==null?null:item.LBNyhedsbillede.Url
                
                if(counter<4)
                {
                  return(
                    <div className={styles.NewsItem}>
                      <Link href={item.FileRef}>  
                        <NewsItem documentTitle={item.Title} previewImageUrl={pictureUrl} documentDescription={item.Teaser} sender={this.getSenders(item)}/>
                      </Link>
                    </div>
                  )
                }
                    
              })
              
            }
          </div> 
          <div className={styles.NonFeaturedNewsItemsContainer}>
          
            {
              
              this.state.results.map((item)=>{
                counter2=counter2+1;  
                let pictureUrl = item.LBNyhedsbillede==null?null:item.LBNyhedsbillede.Url
                if(counter2>3)
                {
                  return(
                    <div className={styles.NonFeaturedNewsItems}>  
                      <Link href={item.FileRef}>{item.Title}</Link>
                    </div> 
                  )
                }
              })
            }
          </div> 
        </div>  }*/
      
    );
  }
}
