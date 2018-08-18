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
using System.Text.RegularExpressions;
using System.Threading.Tasks;
using System.Windows.Forms;

namespace SPOApp
{
    /// <summary>
    /// http://sharepointfieldnotes.blogspot.dk/2013/06/sharepoint-2013-code-tips-setting.html
    /// https://github.com/SharePoint/PnP/blob/dev/Samples/Provisioning.ModernPages/Provisioning.ModernPages/Program.cs
    /// </summary>


    public enum ParsingFeature
    {
        CheckForObscurity = 1,
        OutputLinksToScreen = 2,
        MigrateLinks = 3,
        UnknownFeature
    }
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
    public struct FileWithLinks
    {
        public string FileName;
        public string OriginalLink;
        public string NewLink;
        public string CoincidenceFilePrefix;
    }


    

    class Program
    {
        private const string COINCIDENCE_IN_FILES_FILEPATH = @"C:\Git\LBIntranet\Powershell\MigratePages\CoincidenceFeature\CoincidenceOfFilenamesFiltered.csv";
        private const string LINKS_IN_PAGES_FILEPATH = @"C:\Git\LBIntranet\SPOApp\SPOApp\SPOApp\importfiles\LinkMigration\Indbo_LinksRepair.csv";
        private const string OUTPUT_LINKS_IN_PAGES_FILEPATH = @"C:\Git\LBIntranet\SPOApp\SPOApp\SPOApp\logfiles\OutputLinks\";
        private static List<string> lstLog = new List<string>();
        private static List<string> lstOutputLinksInPages = new List<string>();
        private static List<string> lstError = new List<string>();
        public static string IsPageCoincidence(string fileName)
        {
            
            using (var reader = new StreamReader(COINCIDENCE_IN_FILES_FILEPATH))
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


        public static List<FileWithLinks> GetFilesWithLinks()
        {
            List<FileWithLinks> resFiles = new List<FileWithLinks>();
            using (var reader = new StreamReader(LINKS_IN_PAGES_FILEPATH, Encoding.UTF8))
            {
                while (!reader.EndOfStream)
                {
                    var line = reader.ReadLine();
                    var values = line.Split(';');

                    FileWithLinks fwl;
                    fwl.FileName = values[0];
                    fwl.OriginalLink = values[1];
                    fwl.NewLink = values[2];
                    fwl.CoincidenceFilePrefix = values[3];
                    resFiles.Add(fwl);

                }
            }
            return resFiles;

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

            string logFileName = "";
            string errorFileName = "";

            string targetSiteUrl = "https://lbforsikring.sharepoint.com/sites/skade";
            ClientContext ctx = SPOUtility.Authenticate(targetSiteUrl, "admnicd@lb.dk", "MandM5555");


            System.Diagnostics.Debugger.Launch();

            Console.WriteLine("Check for links in WikiFields [W]");
            Console.WriteLine("Create Modern Pages [M]");
            Console.WriteLine("Repair Modern Pages [R]");
            Console.WriteLine("Publish All Pages [P]");
            var input = Console.ReadLine();

            if (input.ToLower().Equals("m"))
            {
                try
                {
                    StartCreatingModernPages(false);
                }
                catch (Exception ex)
                {

                    Console.WriteLine(ex);
                }

                Console.WriteLine("Done....");
                Console.ReadLine();

            }
            if (input.ToLower().Equals("r"))
            {
                try
                {
                    StartCreatingModernPages(true);
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
                Console.WriteLine("Rejse [17]");
                Console.WriteLine("Indbo [18]");
                Console.WriteLine("Bil [19]");
                string choice = Console.ReadLine();

                //Console.WriteLine("Find obscure and empty content  ex. 'false,1,1' and '<p>a</p>' and '<p>v</p>' string [1]");
                Console.WriteLine("Output links to screen[2]");
                Console.WriteLine("Migrate links [3]");
                string featureToRun = Console.ReadLine();
                ParsingFeature parsingFeature;


                string branchLibraryName = "";
                string documentLibrarySearchString = "";
                string manualTaxDisplayname = "";

                #region REGION Choose branch
                if (choice == "1")
                {
                    //ctName = "BaadManual";
                    branchLibraryName = "baad";
                    documentLibrarySearchString = "skade/hb/baad/delte";
                }
                else if (choice == "2")
                {
                    //ctName = "BeredskabManual";
                    branchLibraryName = "Beredskab";
                    documentLibrarySearchString = "skade/hb/besk/delte";
                }
                else if (choice == "3")
                {
                    manualTaxDisplayname = "Bygning";
                    //ctName = "BygningManual";
                    branchLibraryName = "Byg";
                    documentLibrarySearchString = "skade/hb/byg/delte";
                }
                else if (choice == "4")
                {
                    //ctName = "AnsvarManual";
                    branchLibraryName = "Ansvar";
                    documentLibrarySearchString = "skade/hb/ansvarny/delte";
                }
                else if (choice == "5")
                {
                    //ctName = "HundManual";
                    branchLibraryName = "Hund";
                    documentLibrarySearchString = "skade/hb/hund/delte";
                }
                else if (choice == "6")
                {
                    //ctName = "GerningsmandManual";
                    branchLibraryName = "Gerningsmand";
                    documentLibrarySearchString = "skade/hb/gerningsmand/delte";

                }
                else if (choice == "7")
                {
                    //ctName = "EjerskifteManual";
                    branchLibraryName = "Ejerskifte";
                    documentLibrarySearchString = "skade/hb/ejerskifte/delte";

                }
                else if (choice == "8")
                {
                    //ctName = "ErhvervManual";
                    branchLibraryName = "Erhverv";
                    documentLibrarySearchString = "skade/hb/erhv/delte";
                }
                else if (choice == "9")
                {
                    //ctName = "LønsikringIndividuelManual";
                    branchLibraryName = "LoensikringIndividuel";
                    documentLibrarySearchString = "skade/hb/lønsikring/delte";
                }
                else if (choice == "10")
                {
                    //ctName = "RetshjælpManual";
                    branchLibraryName = "Retshjlp";
                    documentLibrarySearchString = "skade/hb/retshj/delte";
                }
                else if (choice == "11")
                {
                    //ctName = "ScalePointManual";
                    branchLibraryName = "ScalePoint";
                    documentLibrarySearchString = "skade/hb/sp/delte";
                }
                else if (choice == "12")
                {
                    //ctName = "LønsikringKollektivManual";
                    branchLibraryName = "LoensikringKollektiv";
                    documentLibrarySearchString = "skade/hb/lønsikringkollektiv/delte";
                }
                else if (choice == "13")
                {
                    //ctName = "PersonskadeManual";
                    branchLibraryName = "Personskade";
                    documentLibrarySearchString = "skade/hb/person/delte";
                }
                else if (choice == "14")
                {
                    //ctName = "RegresManual";
                    branchLibraryName = "Regres";
                    documentLibrarySearchString = "skade/hb/reg/delte";
                }
                else if (choice == "15")
                {
                    //ctName = "SkybrudsManual";
                    branchLibraryName = "Skybrudsmanual";
                    documentLibrarySearchString = "skade/hb/SkybrudsManual/delte";
                }
                else if (choice == "16")
                {
                    //ctName = "StorskadeManual";
                    branchLibraryName = "Storskade";
                    documentLibrarySearchString = "skade/hb/storskade/delte";
                }
                else if (choice == "17")
                {
                    manualTaxDisplayname = "Rejse";
                    //ctName = "StorskadeManual";
                    branchLibraryName = "Rejse";
                    documentLibrarySearchString = "skade/hb/rejse/delte";
                }
                else if (choice == "18")
                {
                    manualTaxDisplayname = "Indbo";
                    //ctName = "StorskadeManual";
                    branchLibraryName = "Indbo";
                    documentLibrarySearchString = "skade/hb/indbo/delte";
                }
                else if (choice == "19")
                {
                    manualTaxDisplayname = "Bil";
                    //ctName = "StorskadeManual";
                    branchLibraryName = "Bil";
                    documentLibrarySearchString = "skade/hb/bil/delte";
                }
                #endregion


                //string targetSiteUrl = "https://lbforsikring.sharepoint.com/sites/skade";
                //ClientContext ctx = SPOUtility.Authenticate(targetSiteUrl, "admnicd@lb.dk", "MandM5555");

                if (featureToRun == "1")
                {
                    logFileName = branchLibraryName + "_CheckForObscurityLOG.txt";
                    errorFileName = branchLibraryName + "_CheckForObscurityERROR.txt";
                    parsingFeature = ParsingFeature.CheckForObscurity;
                }
                else if (featureToRun == "2")
                {
                    errorFileName = branchLibraryName + "_OutputLinksToScreenERROR.txt";
                    logFileName = branchLibraryName + "_OutputLinksToScreen.txt";
                    parsingFeature = ParsingFeature.OutputLinksToScreen;
                }
                else if (featureToRun == "3")
                {
                    errorFileName = branchLibraryName + "_MigrateLinksERROR.txt";
                    logFileName = branchLibraryName + "_MigrateLinksLOG.txt";
                    parsingFeature = ParsingFeature.MigrateLinks;
                }
                else
                {
                    parsingFeature = ParsingFeature.UnknownFeature;
                }

                string sitePagesLibrary = "Webstedssider";
                var fileName = "";
                ListItemCollection collListItem = LinksUtility.GetManualsFromSitePages(ctx, sitePagesLibrary, manualTaxDisplayname);

                if (parsingFeature == ParsingFeature.MigrateLinks)
                {
                    List<FileWithLinks> files = GetFilesWithLinks();

                    List<FileWithLinks> orderedFiles = files.OrderBy(o => o.FileName).ToList();
                    int i = 0;
                    foreach (var file in orderedFiles)
                    {
                        i++;
                        Console.WriteLine("Processing " + i + " of " + orderedFiles.Count);
                        // Handle only the files with these 'CoincidenceFilePrefix' in order to keep track of the migration stages.
                        if (!string.IsNullOrEmpty(file.FileName)
                            && (file.CoincidenceFilePrefix.Equals("Indbo") ||
                                file.CoincidenceFilePrefix.Equals("Bygning") ||
                                file.CoincidenceFilePrefix.Equals("Bil") ||
                                file.CoincidenceFilePrefix.Equals("Rejse")
                                )
                        )
                        {
                            try
                            {
                                string tmpFileNameFromLink = Uri.UnescapeDataString(file.OriginalLink);
                                bool coincidenceInLink;
                                // Coincidence in filenames
                                if (IsPageCoincidence(tmpFileNameFromLink.Substring(tmpFileNameFromLink.LastIndexOf('/') + 1)) != null)
                                {
                                    coincidenceInLink = true;
                                    }
                                else
                                {
                                    coincidenceInLink = false;
                                }
                                EditCurrentLink(ctx, file, coincidenceInLink);
                            }
                            catch (Exception ex)
                            {
                                Console.ForegroundColor = ConsoleColor.Red;
                                Console.WriteLine("----------------------------------------------");
                                Console.WriteLine(file.FileName);
                                Console.WriteLine("----------------------------------------------");
                                Console.ForegroundColor = ConsoleColor.Yellow;
                                Console.WriteLine("----------------------------------------------");
                                Console.WriteLine(ex.Message);
                                Console.WriteLine("----------------------------------------------");
                                Console.ForegroundColor = ConsoleColor.White;
                            }

                        }

                    }
                }
                else
                {
                    lstOutputLinksInPages.Add("FileName;OriginalHyperLink;NewHyperLink;CoincidencePrefix");
                    foreach (ListItem item in collListItem)
                    {
                        fileName = item["FileRef"].ToString();
                        fileName = fileName.Substring(fileName.LastIndexOf('/') + 1);
                        try
                        {
                            ClientSidePage P = ClientSidePage.Load(ctx, fileName);

                            foreach (CanvasSection section in P.Sections)
                            {
                                foreach (CanvasControl control in section.Controls)
                                {
                                    if (control.Type.Name == "ClientSideText")
                                    {
                                        ClientSideText t = (ClientSideText)control;
                                        if (parsingFeature == ParsingFeature.CheckForObscurity)
                                        {
                                            LinksUtility.FindObscureText(t.Text, fileName);

                                        }
                                        else if (parsingFeature == ParsingFeature.OutputLinksToScreen)
                                        {
                                            try
                                            {
                                                OutputLinksToScreen(fileName, t.Text, branchLibraryName, documentLibrarySearchString);
                                            }
                                            catch (Exception ex)
                                            {

                                                lstError.Add(fileName + ";" + ex.Message + ";OutputLinksToScreen");
                                            }

                                        }
                                        else if (parsingFeature == ParsingFeature.MigrateLinks)
                                        {

                                            //var res = LinksUtility.TraverseHyperLinks(fileName, t.Text, branchLibraryName, documentLibrarySearchString);
                                            //t.Text = res;
                                            //P.Save();
                                            //P.Publish();
                                        }
                                    }
                                }
                            }
                        }
                        catch (Exception ex)
                        {
                            Console.ForegroundColor = ConsoleColor.Red;
                            Console.WriteLine(ex.Message);
                            Console.ForegroundColor = ConsoleColor.White;
                            lstError.Add(fileName + ";" + ex.Message + ";OutputLinksToScreen");
                        }

                    }
                }
            }
            else if (input.ToLower().Equals("p"))
            {

                SPOUtility.CheckInAllDocuments(ctx, "Webstedssider");
            }
            
            System.IO.File.WriteAllLines(@"C:\Git\LBIntranet\SPOApp\SPOApp\SPOApp\logfiles\" + logFileName, lstLog.ToArray());

            System.IO.File.WriteAllLines(OUTPUT_LINKS_IN_PAGES_FILEPATH + logFileName, lstOutputLinksInPages.ToArray());
            //System.IO.File.WriteAllLines(@"C:\Git\LBIntranet\SPOApp\SPOApp\SPOApp\logfiles\" + errorFileName, lstError.ToArray());
            //ORG LinksUtility.CheckForLinks(ctx, sitePagesLibrary, ctName, featureToRun);


            //LinksUtility.CheckForLinks(ctx, sitePagesLibrary, parsingFeature ,documentLibrarySearchString,branchLibraryName,manualTaxDisplayname);

            Console.WriteLine("Done searching for links");
            Console.ReadLine();
        }

        private static void EditCurrentLink(ClientContext ctx, FileWithLinks file, bool linkToCoincidenceFile)
        {
            string filePrefix = "";
            string tmpFileNameFromLink = "";
            ClientSidePage P = ClientSidePage.Load(ctx, file.FileName);
            foreach (CanvasSection section in P.Sections)
            {
                foreach (CanvasControl control in section.Controls)
                {
                    if (control.Type.Name == "ClientSideText")
                    {
                        ClientSideText t = (ClientSideText)control;
                        string s = t.Text;
                        
                        //Replace link
                        string newPageText=Uri.UnescapeDataString(t.Text).Replace(Uri.UnescapeDataString(file.OriginalLink), Uri.UnescapeDataString("https://lbforsikring.sharepoint.com/sites/Skade" + file.NewLink));
                        
                        //Replace filename
                        if (linkToCoincidenceFile)
                        {
                            tmpFileNameFromLink = Uri.UnescapeDataString(file.OriginalLink);
                            filePrefix = IsPageCoincidence(tmpFileNameFromLink.Substring(tmpFileNameFromLink.LastIndexOf('/') + 1));
                            newPageText.Replace(tmpFileNameFromLink, filePrefix + tmpFileNameFromLink);
                        }

                        t.Text = newPageText;
                        P.Save();
                        P.Publish();
                        filePrefix = "";
                        tmpFileNameFromLink = "";
                    }
                }
            }
        }



        public static void OutputLinksToScreen(string fileName, string input, string branchLibraryName, string documentLibrarySearchString)
        {

            Regex regex = new Regex("href\\s*=\\s*(?:\"(?<1>[^\"]*)\"|(?<1>\\S+))", RegexOptions.IgnoreCase);
            Match match;
            
            for (match = regex.Match(input); match.Success; match = match.NextMatch())
            {
                
                foreach (System.Text.RegularExpressions.Capture capture in match.Captures)
                {
                    lstOutputLinksInPages.Add(fileName + ";N/A;" + capture + ";N/A");
                }
            }
            


        }



        //private static void devCreateModernPage(ClientContext context)
        //{

        //    ClientSidePage page = context.Web.AddClientSidePage("dev.aspx", true);
        //    page.PageTitle = "My Title";
        //    page.Save();

        //    page.AddSection(CanvasSectionTemplate.TwoColumn, 1);
        //    page.Save();
        //    CanvasSection section = page.Sections[0];

        //    ClientSideWebPart imageWebPart = page.InstantiateDefaultWebPart(DefaultClientSideWebParts.Image);
        //    //imageWebPart.Properties["siteId"] = "c827cb03-d059-4956-83d0-cd60e02e3b41";
        //    //imageWebPart.Properties["webId"] = "9fafd7c0-e8c3-4a3c-9e87-4232c481ca26";
        //    //imageWebPart.Properties["listId"] = "78d1b1ac-7590-49e7-b812-55f37c018c4b";
        //    //imageWebPart.Properties["uniqueId"] = "3C27A419-66D0-4C36-BF24-BD6147719052";
        //    //imageWebPart.Properties["imgWidth"] = 1002;
        //    //imageWebPart.Properties["imgHeight"] = 469;
        //    imageWebPart.Properties["imageSourceType"] = 2;
        //    imageWebPart.Properties["imageSource"] = @"\sites\Skade\SiteAssets\ikoner\hund.png";
        //    page.AddControl(imageWebPart, section.Columns[1], 0);
        //    page.Save();

        //    ClientSideText t = new ClientSideText() { Text = "Hund kiks" };
        //    page.AddControl(t, section.Columns[0], 0);

        //    page.Save();
        //    page.Publish();



        //}
      
        
        
        /// <summary>
        /// ORG
        /// </summary>
        //private static void StartCreatingModernPages()
        //{

        //    string sourceLibraryName = "";
        //    string targetLibraryName = "SitePages";
        //    targetLibraryName = "Webstedssider";


        //    string targetSiteUrl = "https://lbforsikring.sharepoint.com/sites/skade";

        //    ClientContext ctx = SPOUtility.Authenticate(targetSiteUrl, "admnicd@lb.dk", "MandM5555");


        //    GenericConfiguration g;
        //    g.ContentTypeName = "";
        //    g.SourceLibrary = "";

        //    Console.WriteLine("Vælg branch:");
        //    Console.WriteLine("Bygning [1]");
        //    Console.WriteLine("Ansvar [2]");
        //    Console.WriteLine("Hund [3]");
        //    Console.WriteLine("Ejerskifte [4]");
        //    Console.WriteLine("Gerningsmand[5]");
        //    Console.WriteLine("Erhverv[6]");
        //    Console.WriteLine("Lønsikring Individuel[7]");
        //    Console.WriteLine("Lønsikring Kollektiv[8]");
        //    Console.WriteLine("Indbo[9]");
        //    Console.WriteLine("Personskade[10]");
        //    Console.WriteLine("Regres[11]");
        //    Console.WriteLine("Retshjælp[12]");
        //    Console.WriteLine("ScalePoint[13]");
        //    Console.WriteLine("Generel Skadepolitik[14]");
        //    Console.WriteLine("Skybrud[15]");
        //    Console.WriteLine("Storskade[16]");
        //    Console.WriteLine("Rejse[17]");


        //    string branch = Console.ReadLine();
        //    if (branch == "1")
        //    {
        //        g.ContentTypeName = "BygningManual";
        //        g.SourceLibrary = "Bygwebsider";
        //    }
        //    else if (branch == "2")
        //    {
        //        g.ContentTypeName = "AnsvarManual";
        //        g.SourceLibrary = "Ansvarwebsider";
        //    }
        //    else if (branch == "3")
        //    {
        //        g.ContentTypeName = "HundManual";
        //        g.SourceLibrary = "Hundwebsider";
        //    }
        //    else if (branch == "4")
        //    {
        //        g.ContentTypeName = "EjerskifteManual";
        //        g.SourceLibrary = "Ejerskiftewebsider";
        //    }
        //    else if (branch == "5")
        //    {
        //        g.ContentTypeName = "GerningsmandManual";
        //        g.SourceLibrary = "Gerningsmandwebsider";
        //    }
        //    else if (branch == "6")
        //    {
        //        g.ContentTypeName = "ErhvervManual";
        //        g.SourceLibrary = "Erhvervwebsider";
        //    }
        //    else if (branch == "7")
        //    {
        //        g.ContentTypeName = "LønsikringIndividuelManual";
        //        g.SourceLibrary = "LoensikringIndividuelWebsider";
        //    }
        //    else if (branch == "8")
        //    {
        //        g.ContentTypeName = "LønsikringKollektivManual";
        //        g.SourceLibrary = "loensikringKollektivWebsider";
        //    }
        //    else if (branch == "9")
        //    {
        //        g.ContentTypeName = "IndboManual";
        //        g.SourceLibrary = "indboWebsider";
        //    }
        //    else if (branch == "10")
        //    {
        //        g.ContentTypeName = "PersonskadeManual";
        //        g.SourceLibrary = "PersonskadeWebsider";
        //    }
        //    else if (branch == "11")
        //    {
        //        g.ContentTypeName = "RegresManual";
        //        g.SourceLibrary = "RegresWebsider";
        //    }
        //    else if (branch == "12")
        //    {
        //        g.ContentTypeName = "RetshjælpManual";
        //        g.SourceLibrary = "RetshjaelpWebsider";
        //    }
        //    else if (branch == "13")
        //    {
        //        g.ContentTypeName = "ScalePointManual";
        //        g.SourceLibrary = "ScalePointWebsider";
        //    }
        //    else if (branch == "14")
        //    {
        //        g.ContentTypeName = "GenerelSkadepolitikManual";
        //        g.SourceLibrary = "GenerelSkadepolitikWebsider";
        //    }
        //    else if (branch == "15")
        //    {
        //        g.ContentTypeName = "SkybrudsManual";
        //        g.SourceLibrary = "SkybrudsManualWebsider";
        //    }
        //    else if (branch == "16")
        //    {
        //        g.ContentTypeName = "StorskadeManual";
        //        g.SourceLibrary = "StorskadeWebsider";
        //    }
        //    else if (branch == "17")
        //    {
        //        g.ContentTypeName = "RejseManual";
        //        g.SourceLibrary = "RejseWebsider";
        //    }


        //    List<GenericManualProperies> manuals = GenericManual.GetSourceFiles(ctx, g);
        //    GenericManual.CreateModernSitePages(ctx, manuals, g);


        //}


            
        private static void StartCreatingModernPages(bool? repair)
        {
            string branchImageUrl = "";
            string manualTaxFieldValue = "";
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
            Console.WriteLine("Bil[20]");


            string branch = Console.ReadLine();

            #region Menu choices
            if (branch == "1")
            {
                branchImageUrl = @"https://lbforsikring.sharepoint.com/sites/skade/SiteAssets/ikoner/hus.png";
                manualTaxFieldValue = "Bygning";
                g.ContentTypeName = "BygningManual";
                g.SourceLibrary = "Bygwebsider";
            }
            else if (branch == "2")
            {
                manualTaxFieldValue = "Ansvar";
                branchImageUrl = @"https://lbforsikring.sharepoint.com/sites/skade/SiteAssets/ikoner/ansvar.png";
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
                branchImageUrl = @"https://lbforsikring.sharepoint.com/sites/skade/SiteAssets/ikoner/indbo.png";
                manualTaxFieldValue = "Indbo";
                g.ContentTypeName = "IndboManual";
                g.SourceLibrary = "indboWebsider";
            }
            else if (branch == "10")
            {
                branchImageUrl = @"https://lbforsikring.sharepoint.com/sites/skade/SiteAssets/ikoner/personskade.png";
                
                manualTaxFieldValue = "Personskade";
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
                branchImageUrl = @"https://lbforsikring.sharepoint.com/sites/skade/SiteAssets/ikoner/rejse.png";
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
            else if (branch == "20")
            {
                branchImageUrl = @"https://lbforsikring.sharepoint.com/sites/skade/SiteAssets/ikoner/bil.png";
                manualTaxFieldValue = "Bil";
                g.ContentTypeName = "BilManual";
                g.SourceLibrary = "BilWebsider";
            }
            #endregion

            

            List<GenericManualProperies> manuals;
            //if (repair == true)
            //{
            //    manuals = GenericManual.GetSourceFilesForRepair(ctx, g);
            //}
            //else
            //{
            //    manuals = GenericManual.GetSourceFiles(ctx, g);
            //}

            manuals = GenericManual.GetSourceFilesFromCSV(); 


            int counter = 1;
            foreach (var p in manuals)
            {

                string fileName = p.FileName;
                Console.WriteLine("Creating " + counter + " of " + manuals.Count);
                Console.WriteLine("Start creating " + p.FileName);

                try
                {
                    if (!string.IsNullOrEmpty(Program.IsPageCoincidence(p.FileName)))
                    {
                        fileName = manualTaxFieldValue + p.FileName;
                    }

                    ClientSidePage page = ctx.Web.AddClientSidePage(fileName, true);
                    //ClientSidePage page = new ClientSidePage(ctx);

                    Microsoft.SharePoint.Client.ContentType newContentType = ctx.Web.GetContentTypeByName("Skadehåndbog");
                    ctx.Load(newContentType);
                    ctx.ExecuteQuery();

                    ListItem item = page.PageListItem;
                    ctx.Load(item);
                    ctx.ExecuteQuery();
                    item.Properties["ContentTypeId"] = newContentType.Id.StringValue;
                    item["ContentTypeId"] = newContentType.Id;
                    item["PageLayoutType"] = "Home";
                    item["BannerImageUrl"] = "https://lbforsikring.sharepoint.com" + branchImageUrl;
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

                    ctx.Load(item);
                    ctx.ExecuteQuery();


                    page.PageTitle = p.FileName.Substring(0, p.FileName.Length - 5);
                    //page.Save();

                    page.AddSection(CanvasSectionTemplate.TwoColumnLeft, 1);
                    //page.Save();
                    CanvasSection section = page.Sections[0];


                    ClientSideText t = new ClientSideText() { Text = "[TODO]" };
                    page.AddControl(t, section.Columns[0], 0);


                    ClientSideWebPart imageWebPart = page.InstantiateDefaultWebPart(DefaultClientSideWebParts.Image);
                    //imageWebPart.Properties["siteId"] = "843f7b1b-ffcf-4881-bcf7-2ada5969a5fe";
                    //imageWebPart.Properties["webId"] = "18196690-7d06-4ad4-ae87-af7cd393a25";
                    //imageWebPart.Properties["listId"] = "8e992018-f0cc-48fa-a4e3-74cb8af6eb63";
                    ////rejse.png
                    //imageWebPart.Properties["uniqueId"] = "d2bd511c-5fb8-475e-9e23-dcd2d72c621b";
                    //imageWebPart.Properties["imgWidth"] = 1002;
                    //imageWebPart.Properties["imgHeight"] = 469;
                    imageWebPart.Properties["imageSourceType"] = 2;
                    imageWebPart.Properties["imageSource"] = branchImageUrl;
                    //page.Save();

                    page.AddControl(imageWebPart, section.Columns[1], 0);
                    page.Save();
                    page.Publish();
                    //ctx.ExecuteQuery();

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

