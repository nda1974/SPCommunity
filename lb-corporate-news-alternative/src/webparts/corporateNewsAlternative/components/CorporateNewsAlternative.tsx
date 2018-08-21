import * as React from 'react';
import styles from './CorporateNewsAlternative.module.scss';
import { ICorporateNewsAlternativeProps } from './ICorporateNewsAlternativeProps';
import { escape } from '@microsoft/sp-lodash-subset';
import { IAppProps } from './App/IAppProps';
import App from './App/App';

export default class CorporateNewsAlternative extends React.Component<ICorporateNewsAlternativeProps, {}> {




  // public render(): React.ReactElement<ICorporateNewsAlternativeProps> {
  //   return (
  //     <div className={ styles.corporateNewsAlternative }>
  //       <div className={ styles.container }>
  //         <div className={ styles.row }>
  //           <div className={ styles.column }>
  //               <div className="primaryItem">
  //               <div className="item">
  //               <div className="newsItem newsItem__hasImage newsItem__featured">
  //               <div className="imageArea">
  //               <a  className="imageArea_link" aria-hidden="true" href="https://lbforsikring.sharepoint.com/sites/Intra/SiteAssets/Nyheder/nicd.aspx" target="_self" >
  //                 <div className="ms-Image imageArea_image">
  //                   <img title="Acubiz One holder sommerferie" className="ms-Image-image is-loaded ms-Image-image--cover ms-Image-image--portrait is-fadeIn image-368" role="presentation" aria-hidden="true" src="https://lbforsikring.sharepoint.com/sites/Intra/SiteAssets/Nyheder/Acubiz.png" />
  //                 </div>
  //                 <div className="content"></div>
  //               </a>
  //               </div>
  //               <div className="text">
  //                   <div>
  //                     <a  className="text_title" aria-label="Acubiz One holder sommerferie Publiceret af Luise Jørgensen d. i forgårs. Beskrivelse: Der vil ikke blive foretaget udbetaling af udlæg i nedenstående uger: Uge 30, 31 og 32 for LB Forsikring Uge 32, 33 og 34 for LB-IT/Medvind Du skal fortsat registrere udlæg, kreditkortbrug og km i Acubiz One i disse uger – der vil dog først blive ud…" href="https://lbforsikring.sharepoint.com/sites/Intra/SitePages/Acubiz-One-holder-sommerferie.aspx" target="_self" data-automation-id="newsItemTitle" data-interception="propagate">Acubiz One holder sommerferie</a>
  //                     <div className="text_description_471b00d7" data-automation-id="newsItemDescription">Der vil ikke blive foretaget udbetaling af udlæg i nedenstående uger: Uge 30, 31 og 32 for LB Forsikring Uge 32, 33 og 34 for LB-IT/Medvind Du skal fortsat registrere udlæg, k…</div>
  //                   </div>
  //                   <div title="Luise Jørgensen i forgårs" className="metadata_d1726a55">
  //                     <div className="personaAuthorDate_d1726a55">
  //                       <div className="persona_d1726a55" role="presentation" aria-hidden="true">
  //                         <div className="ms-Persona ms-Persona--size32 root-353" >
  //                           <div className="ms-Persona-coin ms-Persona--size32 coin-360" >
  //                             <div className="ms-Persona-imageArea imageArea-362">
  //                               <div className="ms-Image ms-Persona-image image-365" >
  //                                 <img className="ms-Image-image is-loaded ms-Image-image--cover ms-Image-image--portrait is-fadeIn image-368" alt="Acubiz One holder sommerferie" src="/_layouts/15/userphoto.aspx?size=S&amp;accountname=lujo%40lb.dk" />
  //                               </div>
  //                           </div>
  //                         </div>
  //                       </div>
  //                     </div>
  //                     <div className="personaAuthorDate_authorDate_d1726a55">
  //                       <span className="author_d1726a55" role="presentation" aria-hidden="true">Luise Jørgensen</span>
  //                       <span className="date_d1726a55" role="presentation" aria-hidden="true">i forgårs</span>
  //                     </div>
  //                   </div>
  //                   {/* <div className="views_d1726a55">
  //                   <span title="3 visninger" className="viewCounts_6530fc0d" role="presentation" aria-hidden="true">3 visninger</span>
  //                   </div> */}
  //               </div>
  //             </div>
  //           </div>
  //         </div>
  //         </div>
  //           </div>
  //           <div className={ styles.column }>
              

  //             <div className={ styles.container }>
  //               <div className={ styles.row }>
  //                 <div className={ styles.column }>
                    
  //                 </div>
  //                 <div className={ styles.column }>
                    
  //                 </div>
  //               </div>
  //             </div>




  //           </div>
  //         </div>
  //       </div>
  //     </div>
  //   );
  // }
}
