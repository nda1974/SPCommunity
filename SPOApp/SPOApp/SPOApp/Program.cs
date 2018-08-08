using Microsoft.Office.Interop.Word;
using Microsoft.SharePoint.Client;
using Microsoft.SharePoint.Client.Taxonomy;
using OfficeDevPnP.Core;
using OfficeDevPnP.Core.Pages;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
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
        static void Main(string[] args)
        {
            string manualsToDelete = "IndboManual";
            System.Diagnostics.Debugger.Launch();
            Console.WriteLine(string.Format("Delete all pages with content type = {0} [X]", manualsToDelete));
            Console.WriteLine("Check for links in WikiFields [W]");
            Console.WriteLine("Create Modern Pages [M]");
            Console.WriteLine("Publish All Pages [P]");
            var input = Console.ReadLine();

            if (input.ToLower().Equals("x"))
            {
                string targetSiteUrl = "https://lbforsikring.sharepoint.com/sites/skade";
                ClientContext ctx = SPOUtility.Authenticate(targetSiteUrl, "admnicd@lb.dk", "MandM5555");
                var lst = ctx.Web.Lists.GetByTitle("Webstedssider");
                ctx.Load(lst);
                ctx.ExecuteQuery();
                CamlQuery cq = new CamlQuery();
                string s = "<Where><Eq><FieldRef Name=\"ContentType\" /><Value Type=\"Computed\">" + manualsToDelete + "</Value></Eq></Where>";


                string viewXml = string.Format(@"
                <View>
                    <Query>
                        <Where>
                            <Eq>
                                <FieldRef Name='ContentType' />
                                <Value Type='Computed'>{0}</Value>
                            </Eq>
                        </Where>
                    </Query>
                </View>", manualsToDelete);



                //cq.ViewXml = string.Format("<View Scope=\"RecursiveAll\">{0}</View>", s);
                cq.ViewXml = viewXml;
                ListItemCollection collListItem = lst.GetItems(cq);
                ctx.Load(collListItem);
                ctx.ExecuteQuery();
                int counter = 0;
                foreach (ListItem item in collListItem)
                {
                    counter++;
                    Console.WriteLine("Processing " + counter + " of " + collListItem.Count);
                    ctx.Load(item.ContentType);
                    ctx.ExecuteQuery();
                    Console.WriteLine(item.ContentType.Name);
                    if (item.ContentType.Name.Equals(manualsToDelete))
                    {
                        Console.WriteLine("Deleting webpage : " + item["Title"]);



                        item.DeleteObject();
                        ctx.ExecuteQuery();
                    }

                }

            }
            else if (input.ToLower().Equals("m"))
            {
                StartCreatingModernPages();
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
                string choice = Console.ReadLine();

                Console.WriteLine("Find obscure and empty content  ex. 'false,1,1' and '<p>a</p>' and '<p>v</p>' string [1]");
                Console.WriteLine("Output links to screen[2]");
                Console.WriteLine("Migrate links [3]");
                string featureToRun = Console.ReadLine();

                string ctName = "";
                if (choice == "1")
                {
                    ctName = "BaadManual";
                }
                else if (choice == "2")
                {
                    ctName = "BeredskabManual";
                }
                else if (choice == "3")
                {
                    ctName = "BygningManual";
                }
                else if (choice == "4")
                {
                    ctName = "AnsvarManual";
                }
                else if (choice == "5")
                {
                    ctName = "HundManual";
                }
                else if (choice == "6")
                {
                    ctName = "GerningsmandManual";
                }
                else if (choice == "7")
                {
                    ctName = "EjerskifteManual";
                }
                else if (choice == "8")
                {
                    ctName = "ErhvervManual";
                }
                else if (choice == "9")
                {
                    ctName = "LønsikringIndividuelManual";
                }
                else if (choice == "10")
                {
                    ctName = "RetshjælpManual";
                }
                else if (choice == "11")
                {
                    ctName = "ScalePointManual";
                }
                else if (choice == "12")
                {
                    ctName = "LønsikringKollektivManual";
                }
                else if (choice == "13")
                {
                    ctName = "PersonskadeManual";
                }
                else if (choice == "14")
                {
                    ctName = "RegresManual";
                }


                string targetSiteUrl = "https://lbforsikring.sharepoint.com/sites/skade";
                ClientContext ctx = SPOUtility.Authenticate(targetSiteUrl, "admnicd@lb.dk", "MandM5555");
                string sitePagesLibrary = "Webstedssider";

                LinksUtility.CheckForLinks(ctx, sitePagesLibrary, ctName, featureToRun);

                Console.WriteLine("Done searching for links");
                Console.ReadLine();
            }
            else if (input.ToLower().Equals("p"))
            {
                string targetSiteUrl = "https://lbforsikring.sharepoint.com/sites/skade";
                ClientContext ctx = SPOUtility.Authenticate(targetSiteUrl, "", "");
                SPOUtility.CheckInAllDocuments(ctx, "Webstedssider");
            }
            
        }

        private static void StartCreatingModernPages()
        {

            string sourceLibraryName = "";
            string targetLibraryName = "SitePages";
            targetLibraryName = "Webstedssider";


            string targetSiteUrl = "https://lbforsikring.sharepoint.com/sites/skade";
            //targetSiteUrl = "https://lbforsikring.sharepoint.com/sites/sandkasse";




            ClientContext ctx = SPOUtility.Authenticate(targetSiteUrl, "admnicd@lb.dk", "MandM5555");




            //Console.WriteLine("Create Generic Manuals [X]");


            //var input = Console.ReadLine();


            GenericConfiguration g;
            g.ContentTypeName = "";
            g.SourceLibrary = "";

            //if (input.ToLower().Equals("x"))
            //{
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


            List<GenericManualProperies> manuals = GenericManual.GetSourceFiles(ctx, g);
            GenericManual.CreateModernSitePages(ctx, manuals, g);
            

        }


        
        



    }
}

