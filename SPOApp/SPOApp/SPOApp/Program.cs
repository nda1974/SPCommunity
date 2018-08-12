using Microsoft.Office.Interop.Word;
using Microsoft.SharePoint.Client;
using Microsoft.SharePoint.Client.Taxonomy;
using OfficeDevPnP.Core;
using OfficeDevPnP.Core.Pages;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Net;
using System.Runtime.InteropServices.ComTypes;
using System.Security;
using System.Text;
using System.Threading.Tasks;
using System.Windows.Forms;

namespace SPOApp
{
    /// <summary>
    /// http://sharepointfieldnotes.blogspot.dk/2013/06/sharepoint-2013-code-tips-setting.html
    /// https://github.com/SharePoint/PnP/blob/dev/Samples/Provisioning.ModernPages/Provisioning.ModernPages/Program.cs
    /// </summary>



    public struct SitePageProperies
    {
        public string ManualCategory;
        public string WikiContent;
        public string FileName;
        public string Title;
    }
    public struct BilSkadePortalGuideManualProperies
    {
        public string BilSkadePortalGuideCategory;
        public string WikiContent;
        public string FileName;
        public string Title;
    }
    public struct AnsvarManualProperies
    {
        public string AnsvarCategory;
        public string AnsvarArea;
        public string WikiContent;
        public string FileName;
        public string Title;
    }
    public struct BaadManualProperies
    {
        public string BaadCategory;
        public string BaadArea;
        public string WikiContent;
        public string FileName;
        public string Title;
    }


    public struct BygningManualProperies
    {
        public string BygningCategory;
        public string BygningArea;
        public string WikiContent;
        public string FileName;
        public string Title;
    }
    public struct BeredskabManualProperies
    {
        public string WikiContent;
        public string FileName;
        public string Title;
    }
    public struct EnterpriseManualProperies
    {
        public string WikiContent;
        public string FileName;
        public string Title;
    }

    public struct BilManualProperies
    {
        public string BilCategory;
        public string WikiContent;
        public string FileName;
        public string Title;
    }
    public struct EjerskifteManualProperies
    {
        public string EjerskifteCategory;
        public string EjerskifteArea;
        public string WikiContent;
        public string FileName;
        public string Title;
    }
    public struct ErhvervManualProperies
    {
        public string ErhvervCategory;
        public string ErhvervArea;
        public string WikiContent;
        public string FileName;
        public string Title;
    }
    public struct GerningsmandManualProperies
    {
        public string GerningsmandCategory;
        public string WikiContent;
        public string FileName;
        public string Title;
    }
    public struct HundManualProperies
    {
        public string HundCategory;
        public string WikiContent;
        public string FileName;
        public string Title;
    }
    public struct IndboManualProperies
    {
        public string IndboCategory;
        public string IndboArea;
        public string WikiContent;
        public string FileName;
        public string Title;
        public string LBInfo;
        public string LBTeaser;
        public string LBKendelser;

    }

    public struct GenericManualProperies
    {
        public string Gruppe;
        public string UnderGruppe;
        public string WikiContent;
        public string FileName;
        public string Title;
    }
    public struct GenericConfiguration
    {
        public string ContentTypeName;
        public string SourceLibrary;
    }


    class Program
    {

        public static string IsPageCoincidence(string fileName)
        {
            
            using (var reader = new StreamReader(@"C:\Git\LBIntranet\Powershell\MigratePages\CoincidenceFeature\CoincidenceOfFilenamesFiltered.csv"))
            {
                List<string> listA = new List<string>();
                List<string> listB = new List<string>();
                while (!reader.EndOfStream)
                {
                    
                    var line = reader.ReadLine();
                    var values = line.Split(';');
                    //Console.WriteLine(values[0] + " - " + values[1]);
                    if (values[1] == fileName)
                    {
                        return values[0];
                    }
                    
                }
            }
            return null;

        }

        public static void RenameFile(string newFileName)
        {
            Console.WriteLine("Enter your password.");
            SecureString password = GetPassword();
        // Input Parameters  
            string url = "https://lbforsikring.sharepoint.com/sites/nicd";
            string userName = "sadmnicd@lbforsikring.onmicrosoft.com";
            //string password = "MandM1974";
        
            userName = "nicd@lb.dk";
            //password = "MandM4444";

            // PnP component to set context  
            ClientContext clientContext = new ClientContext(url);
            
            clientContext.Credentials = new SharePointOnlineCredentials(userName, password);

            Microsoft.SharePoint.Client.List spList = clientContext.Web.Lists.GetByTitle("Webstedssider");
            clientContext.Load(spList);
            clientContext.ExecuteQuery();

            if (spList != null && spList.ItemCount > 0)
            {
                Microsoft.SharePoint.Client.CamlQuery camlQuery = new CamlQuery();
                camlQuery.ViewXml = @"<View>  <Query> <Where><Eq><FieldRef Name='LinkFilenameNoMenu' /><Value Type='Computed'>Kat.aspx </Value></Eq></Where> </Query> <ViewFields><FieldRef Name='Title' /></ViewFields> </View>";

                ListItemCollection listItems = spList.GetItems(camlQuery);
                clientContext.Load(listItems);
                clientContext.ExecuteQuery();
                listItems[0]["Title"] = "Stor FISK";
                listItems[0]["FileLeafRef"] = "FISK.aspx";
                listItems[0].Update();
                clientContext.ExecuteQuery();
            }



        }
        private static SecureString GetPassword()
        {
            ConsoleKeyInfo info;
            //Get the user's password as a SecureString  
            SecureString securePassword = new SecureString();
            do
            {
                info = Console.ReadKey(true);
                if (info.Key != ConsoleKey.Enter)
                {
                    securePassword.AppendChar(info.KeyChar);
                }
            }
            while (info.Key != ConsoleKey.Enter);
            return securePassword;
        }
    
    static void Main(string[] args)
        {
            string targetSiteUrl = "https://lbforsikring.sharepoint.com/sites/skade";
            ClientContext ctx = SPOUtility.Authenticate(targetSiteUrl, "admnicd@lb.dk", "MandM5555");
            //devCreateModernPage(ctx);

            
            string manualsToDelete = "IndboManual";
            System.Diagnostics.Debugger.Launch();
            
            Console.WriteLine("Check for links in WikiFields [W]");
            Console.WriteLine("Create Modern Pages [M]");
            Console.WriteLine("Publish All Pages [P]");
            var input = Console.ReadLine();

            if (input.ToLower().Equals("m"))
            {
                //StartCreatingModernPages();
                try
                {
                    StartCreatingModernPagesDEV();
                }
                catch (Exception ex)
                {

                    Console.WriteLine(ex);
                }
                
                Console.WriteLine("Done....");
                Console.ReadLine();

            }
            else if (input.ToLower().Equals("w"))
            {
                Console.WriteLine("Båd [1]");
                Console.WriteLine("Beredskab [2]");
                Console.WriteLine("Byg [3]");
                Console.WriteLine("Ansvar [4]");
                Console.WriteLine("Hund [5]");
                Console.WriteLine("Gerningsmand [6]");
                Console.WriteLine("Ejerskifte [7]");
                Console.WriteLine("Erhverv [8]");
                Console.WriteLine("Lønsikring Individuel [9]");
                Console.WriteLine("Retshjælp [10]");
                Console.WriteLine("ScalePoint [11]");
                Console.WriteLine("Lønsikring Kollektiv [12]");
                Console.WriteLine("Personskade [13]");
                Console.WriteLine("Regres [14]");
                Console.WriteLine("Skybrud [15]");
                Console.WriteLine("Storskade [16]");
                string choice = Console.ReadLine();

                Console.WriteLine("Find obscure and empty content  ex. 'false,1,1' and '<p>a</p>' and '<p>v</p>' string [1]");
                Console.WriteLine("Output links to screen[2]");
                Console.WriteLine("Migrate links [3]");
                string featureToRun = Console.ReadLine();

                string ctName = "";
                string branchLibraryName = "";
                string documentLibrarySearchString = "";

                if (choice == "1")
                {
                    ctName = "BaadManual";
                    branchLibraryName = "baad";
                    documentLibrarySearchString = "skade/hb/baad/delte";
                }
                else if (choice == "2")
                {
                    ctName = "BeredskabManual";
                    branchLibraryName = "Beredskab";
                    documentLibrarySearchString = "skade/hb/besk/delte";
                }
                else if (choice == "3")
                {
                    ctName = "BygningManual";
                    branchLibraryName = "Byg";
                    documentLibrarySearchString = "skade/hb/byg/delte";
                }
                else if (choice == "4")
                {
                    ctName = "AnsvarManual";
                    branchLibraryName = "ansvar";
                    documentLibrarySearchString = "skade/hb/ansvarny/delte";
                }
                else if (choice == "5")
                {
                    ctName = "HundManual";
                    branchLibraryName = "Hund";
                    documentLibrarySearchString = "skade/hb/hund/delte";
                }
                else if (choice == "6")
                {
                    ctName = "GerningsmandManual";
                    branchLibraryName = "Gerningsmand";
                    documentLibrarySearchString = "skade/hb/gerningsmand/delte";
                    
                }
                else if (choice == "7")
                {
                    ctName = "EjerskifteManual";
                    branchLibraryName = "Ejerskifte";
                    documentLibrarySearchString = "skade/hb/ejerskifte/delte";

                }
                else if (choice == "8")
                {
                    ctName = "ErhvervManual";
                    branchLibraryName = "Erhverv";
                    documentLibrarySearchString = "skade/hb/erhv/delte";
                }
                else if (choice == "9")
                {
                    ctName = "LønsikringIndividuelManual";
                    branchLibraryName = "LoensikringIndividuel";
                    documentLibrarySearchString = "skade/hb/lønsikring/delte";
                }
                else if (choice == "10")
                {
                    ctName = "RetshjælpManual";
                    branchLibraryName = "Retshjlp";
                    documentLibrarySearchString = "skade/hb/retshj/delte";
                }
                else if (choice == "11")
                {
                    ctName = "ScalePointManual";
                    branchLibraryName = "ScalePoint";
                    documentLibrarySearchString = "skade/hb/sp/delte";
                }
                else if (choice == "12")
                {
                    ctName = "LønsikringKollektivManual";
                    branchLibraryName = "LoensikringKollektiv";
                    documentLibrarySearchString = "skade/hb/lønsikringkollektiv/delte";
                }
                else if (choice == "13")
                {
                    ctName = "PersonskadeManual";
                    branchLibraryName = "Personskade";
                    documentLibrarySearchString = "skade/hb/person/delte";
                }
                else if (choice == "14")
                {
                    ctName = "RegresManual";
                    branchLibraryName = "Regres";
                    documentLibrarySearchString = "skade/hb/reg/delte";
                }
                else if (choice == "15")
                {
                    ctName = "SkybrudsManual";
                    branchLibraryName = "Skybrudsmanual";
                    documentLibrarySearchString = "skade/hb/SkybrudsManual/delte";
                }
                else if (choice == "16")
                {
                    ctName = "StorskadeManual";
                    branchLibraryName = "Storskade";
                    documentLibrarySearchString = "skade/hb/storskade/delte";
                }


                //string targetSiteUrl = "https://lbforsikring.sharepoint.com/sites/skade";
                //ClientContext ctx = SPOUtility.Authenticate(targetSiteUrl, "admnicd@lb.dk", "MandM5555");
                
                string sitePagesLibrary = "Webstedssider";

                //ORG LinksUtility.CheckForLinks(ctx, sitePagesLibrary, ctName, featureToRun);
                LinksUtility.CheckForLinks(ctx, sitePagesLibrary, ctName, featureToRun,documentLibrarySearchString,branchLibraryName);

                Console.WriteLine("Done searching for links");
                Console.ReadLine();
            }
            else if (input.ToLower().Equals("p"))
            {
                
                SPOUtility.CheckInAllDocuments(ctx, "Webstedssider");
            }
            
        }
        private static void devCreateModernPage(ClientContext context)
        {

            ClientSidePage page = context.Web.AddClientSidePage("dev.aspx", true);
            page.PageTitle = "My Title";
            page.Save();

            page.AddSection(CanvasSectionTemplate.TwoColumn, 1);
            page.Save();
            CanvasSection section = page.Sections[0];

            ClientSideWebPart imageWebPart = page.InstantiateDefaultWebPart(DefaultClientSideWebParts.Image);
            //imageWebPart.Properties["siteId"] = "c827cb03-d059-4956-83d0-cd60e02e3b41";
            //imageWebPart.Properties["webId"] = "9fafd7c0-e8c3-4a3c-9e87-4232c481ca26";
            //imageWebPart.Properties["listId"] = "78d1b1ac-7590-49e7-b812-55f37c018c4b";
            //imageWebPart.Properties["uniqueId"] = "3C27A419-66D0-4C36-BF24-BD6147719052";
            //imageWebPart.Properties["imgWidth"] = 1002;
            //imageWebPart.Properties["imgHeight"] = 469;
            imageWebPart.Properties["imageSourceType"] = 2;
            imageWebPart.Properties["imageSource"] = @"\sites\Skade\SiteAssets\ikoner\hund.png";
            page.AddControl(imageWebPart, section.Columns[1], 0);
            page.Save();

            ClientSideText t = new ClientSideText() { Text = "Hund kiks" };
            page.AddControl(t, section.Columns[0], 0);
            
            page.Save();
            page.Publish();

            
            
        }
        /// <summary>
        /// ORG
        /// </summary>
        private static void StartCreatingModernPages()
        {
            
            string sourceLibraryName = "";
            string targetLibraryName = "SitePages";
            targetLibraryName = "Webstedssider";


            string targetSiteUrl = "https://lbforsikring.sharepoint.com/sites/skade";

            ClientContext ctx = SPOUtility.Authenticate(targetSiteUrl, "admnicd@lb.dk", "MandM5555");


            GenericConfiguration g;
            g.ContentTypeName = "";
            g.SourceLibrary = "";

            Console.WriteLine("Vælg branch:");
            Console.WriteLine("Bygning [1]");
            Console.WriteLine("Ansvar [2]");
            Console.WriteLine("Hund [3]");
            Console.WriteLine("Ejerskifte [4]");
            Console.WriteLine("Gerningsmand[5]");
            Console.WriteLine("Erhverv[6]");
            Console.WriteLine("Lønsikring Individuel[7]");
            Console.WriteLine("Lønsikring Kollektiv[8]");
            Console.WriteLine("Indbo[9]");
            Console.WriteLine("Personskade[10]");
            Console.WriteLine("Regres[11]");
            Console.WriteLine("Retshjælp[12]");
            Console.WriteLine("ScalePoint[13]");
            Console.WriteLine("Generel Skadepolitik[14]");
            Console.WriteLine("Skybrud[15]");
            Console.WriteLine("Storskade[16]");
            Console.WriteLine("Rejse[17]");


            string branch = Console.ReadLine();
            if (branch == "1")
            {
                g.ContentTypeName = "BygningManual";
                g.SourceLibrary = "Bygwebsider";
            }
            else if (branch == "2")
            {
                g.ContentTypeName = "AnsvarManual";
                g.SourceLibrary = "Ansvarwebsider";
            }
            else if (branch == "3")
            {
                g.ContentTypeName = "HundManual";
                g.SourceLibrary = "Hundwebsider";
            }
            else if (branch == "4")
            {
                g.ContentTypeName = "EjerskifteManual";
                g.SourceLibrary = "Ejerskiftewebsider";
            }
            else if (branch == "5")
            {
                g.ContentTypeName = "GerningsmandManual";
                g.SourceLibrary = "Gerningsmandwebsider";
            }
            else if (branch == "6")
            {
                g.ContentTypeName = "ErhvervManual";
                g.SourceLibrary = "Erhvervwebsider";
            }
            else if (branch == "7")
            {
                g.ContentTypeName = "LønsikringIndividuelManual";
                g.SourceLibrary = "LoensikringIndividuelWebsider";
            }
            else if (branch == "8")
            {
                g.ContentTypeName = "LønsikringKollektivManual";
                g.SourceLibrary = "loensikringKollektivWebsider";
            }
            else if (branch == "9")
            {
                g.ContentTypeName = "IndboManual";
                g.SourceLibrary = "indboWebsider";
            }
            else if (branch == "10")
            {
                g.ContentTypeName = "PersonskadeManual";
                g.SourceLibrary = "PersonskadeWebsider";
            }
            else if (branch == "11")
            {
                g.ContentTypeName = "RegresManual";
                g.SourceLibrary = "RegresWebsider";
            }
            else if (branch == "12")
            {
                g.ContentTypeName = "RetshjælpManual";
                g.SourceLibrary = "RetshjaelpWebsider";
            }
            else if (branch == "13")
            {
                g.ContentTypeName = "ScalePointManual";
                g.SourceLibrary = "ScalePointWebsider";
            }
            else if (branch == "14")
            {
                g.ContentTypeName = "GenerelSkadepolitikManual";
                g.SourceLibrary = "GenerelSkadepolitikWebsider";
            }
            else if (branch == "15")
            {
                g.ContentTypeName = "SkybrudsManual";
                g.SourceLibrary = "SkybrudsManualWebsider";
            }
            else if (branch == "16")
            {
                g.ContentTypeName = "StorskadeManual";
                g.SourceLibrary = "StorskadeWebsider";
            }
            else if (branch == "17")
            {
                g.ContentTypeName = "RejseManual";
                g.SourceLibrary = "RejseWebsider";
            }


            List<GenericManualProperies> manuals = GenericManual.GetSourceFiles(ctx, g);
            GenericManual.CreateModernSitePages(ctx, manuals, g);
            

        }



        /// <summary>
        /// DEV
        /// </summary>
        private static void StartCreatingModernPagesDEV()
        {
            string branchImageName = "";
            string manualTaxFieldValue = "";
            string sourceLibraryName = "";
            string targetLibraryName = "SitePages";
            targetLibraryName = "Webstedssider";


            string targetSiteUrl = "https://lbforsikring.sharepoint.com/sites/skade";

            ClientContext ctx = SPOUtility.Authenticate(targetSiteUrl, "admnicd@lb.dk", "MandM5555");


            GenericConfiguration g;
            g.ContentTypeName = "";
            g.SourceLibrary = "";

            Console.WriteLine("Vælg branch:");
            Console.WriteLine("Bygning [1]");
            Console.WriteLine("Ansvar [2]");
            Console.WriteLine("Hund [3]");
            Console.WriteLine("Ejerskifte [4]");
            Console.WriteLine("Gerningsmand[5]");
            Console.WriteLine("Erhverv[6]");
            Console.WriteLine("Lønsikring Individuel[7]");
            Console.WriteLine("Lønsikring Kollektiv[8]");
            Console.WriteLine("Indbo[9]");
            Console.WriteLine("Personskade[10]");
            Console.WriteLine("Regres[11]");
            Console.WriteLine("Retshjælp[12]");
            Console.WriteLine("ScalePoint[13]");
            Console.WriteLine("Generel Skadepolitik[14]");
            Console.WriteLine("Skybrud[15]");
            Console.WriteLine("Storskade[16]");
            Console.WriteLine("Rejse[17]");
            Console.WriteLine("Beredskab[18]");
            Console.WriteLine("Båd[19]");


            string branch = Console.ReadLine();
            
            if (branch == "1")
            {
                g.ContentTypeName = "BygningManual";
                g.SourceLibrary = "Bygwebsider";
            }
            else if (branch == "2")
            {
                g.ContentTypeName = "AnsvarManual";
                g.SourceLibrary = "Ansvarwebsider";
            }
            else if (branch == "3")
            {
                manualTaxFieldValue = "Hund";
                g.ContentTypeName = "HundManual";
                g.SourceLibrary = "Hundwebsider";
            }
            else if (branch == "4")
            {
                g.ContentTypeName = "EjerskifteManual";
                g.SourceLibrary = "Ejerskiftewebsider";
            }
            else if (branch == "5")
            {
                manualTaxFieldValue = "Gerningsmand";
                g.ContentTypeName = "GerningsmandManual";
                g.SourceLibrary = "Gerningsmandwebsider";
            }
            else if (branch == "6")
            {
                g.ContentTypeName = "ErhvervManual";
                g.SourceLibrary = "Erhvervwebsider";
            }
            else if (branch == "7")
            {
                g.ContentTypeName = "LønsikringIndividuelManual";
                g.SourceLibrary = "LoensikringIndividuelWebsider";
            }
            else if (branch == "8")
            {
                g.ContentTypeName = "LønsikringKollektivManual";
                g.SourceLibrary = "loensikringKollektivWebsider";
            }
            else if (branch == "9")
            {
                manualTaxFieldValue = "Indbo";
                g.ContentTypeName = "IndboManual";
                g.SourceLibrary = "indboWebsider";
            }
            else if (branch == "10")
            {
                g.ContentTypeName = "PersonskadeManual";
                g.SourceLibrary = "PersonskadeWebsider";
            }
            else if (branch == "11")
            {
                g.ContentTypeName = "RegresManual";
                g.SourceLibrary = "RegresWebsider";
            }
            else if (branch == "12")
            {
                g.ContentTypeName = "RetshjælpManual";
                g.SourceLibrary = "RetshjaelpWebsider";
            }
            else if (branch == "13")
            {
                g.ContentTypeName = "ScalePointManual";
                g.SourceLibrary = "ScalePointWebsider";
            }
            else if (branch == "14")
            {
                g.ContentTypeName = "GenerelSkadepolitikManual";
                g.SourceLibrary = "GenerelSkadepolitikWebsider";
            }
            else if (branch == "15")
            {
                g.ContentTypeName = "SkybrudsManual";
                g.SourceLibrary = "SkybrudsManualWebsider";
            }
            else if (branch == "16")
            {
                g.ContentTypeName = "StorskadeManual";
                g.SourceLibrary = "StorskadeWebsider";
            }
            else if (branch == "17")
            {
                branchImageName = @"\sites\Skade\SiteAssets\ikoner\rejse.png";


                manualTaxFieldValue = "Rejse";
                g.ContentTypeName = "RejseManual";
                g.SourceLibrary = "RejseWebsider";
            }
            else if (branch == "18")
            {
                manualTaxFieldValue = "Beredskab";
                g.ContentTypeName = "BeredskabManual";
                g.SourceLibrary = "BeredskabWebsider";
            }
            else if (branch == "19")
            {
                manualTaxFieldValue = "Båd";
                g.ContentTypeName = "BaadManual";
                g.SourceLibrary = "BaadWebsider";
            }


            List<GenericManualProperies> manuals = GenericManual.GetSourceFiles(ctx, g);


            int counter = 1;
            foreach (var p in manuals)
            {
                
                string fileName = p.FileName;
                //Console.WriteLine("Creating " + counter + " of " + manuals.Count);
                //Console.WriteLine("Start creating " + p.FileName);

                try
                {
                    if (!string.IsNullOrEmpty(Program.IsPageCoincidence(p.FileName)))
                    {
                        fileName = manualTaxFieldValue + p.FileName;
                    }

                    ClientSidePage page = ctx.Web.AddClientSidePage(fileName, true);

                    Microsoft.SharePoint.Client.ContentType newContentType = ctx.Web.GetContentTypeByName("Skadehåndbog");
                    ctx.Load(newContentType);
                    ctx.ExecuteQuery();
                    ListItem item = page.PageListItem;
                    ctx.Load(item);
                    ctx.ExecuteQuery();
                    item.Properties["ContentTypeId"] = newContentType.Id.StringValue;
                    item["ContentTypeId"] = newContentType.Id;
                    item.Update();

                    if (!string.IsNullOrEmpty(p.Gruppe))
                    {
                        //SPOUtility.SetMetadataField(ctx, item, p.Gruppe, "Gruppe");
                        SPOUtility.SetMetadataField(ctx, item, p.Gruppe, "Gruppe", manualTaxFieldValue);
                        item.Update();
                    }
                    if (!string.IsNullOrEmpty(p.UnderGruppe))
                    {
                        SPOUtility.SetMetadataField(ctx, item, p.UnderGruppe, "Undergruppe", manualTaxFieldValue);
                        item.Update();
                    }

                    SPOUtility.SetMetadataField(ctx, item, manualTaxFieldValue, "H_x00e5_ndbog");
                    item.Update();

                    page.PageTitle = p.FileName.Substring(0, p.FileName.Length - 5);
                    page.Save();

                    page.AddSection(CanvasSectionTemplate.TwoColumn, 1);
                    page.Save();
                    CanvasSection section = page.Sections[0];


                    ClientSideText t = new ClientSideText() { Text = "[TODO]" };
                    page.AddControl(t, section.Columns[0], 0);


                    ClientSideWebPart imageWebPart = page.InstantiateDefaultWebPart(DefaultClientSideWebParts.Image);
                    //imageWebPart.Properties["siteId"] = "c827cb03-d059-4956-83d0-cd60e02e3b41";
                    //imageWebPart.Properties["webId"] = "9fafd7c0-e8c3-4a3c-9e87-4232c481ca26";
                    //imageWebPart.Properties["listId"] = "78d1b1ac-7590-49e7-b812-55f37c018c4b";
                    //imageWebPart.Properties["uniqueId"] = "3C27A419-66D0-4C36-BF24-BD6147719052";
                    //imageWebPart.Properties["imgWidth"] = 1002;
                    //imageWebPart.Properties["imgHeight"] = 469;
                    imageWebPart.Properties["imageSourceType"] = 2;
                    imageWebPart.Properties["imageSource"] = branchImageName;
                    page.AddControl(imageWebPart, section.Columns[1], 0);
                    page.Save();
                    page.Publish();
                    ctx.ExecuteQuery();

                    counter++;
                }
                catch (Exception ex)
                {
                    Console.WriteLine(p.FileName);
                    Console.WriteLine(ex);

                }



            }
            


        }



    }
}

