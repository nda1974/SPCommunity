using Microsoft.SharePoint.Client;
using OfficeDevPnP.Core.Pages;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Text.RegularExpressions;
using System.Threading.Tasks;

namespace SPOApp
{
    public static class LinksUtility
    {
        private static List<string> strLog = new List<string>();
        public static void CheckForLinks(ClientContext context, string sitePagesLibraryTitle)
        {
            CamlQuery camlQuery = new CamlQuery();

            List<string> strLogMessageNoFilesWithLinks = new List<string>();
            List<string> strLogMessageNoFilesWithNoCanvas = new List<string>();

            var oList = context.Web.Lists.GetByTitle(sitePagesLibraryTitle);

            ListItemCollection collListItem = oList.GetItems(camlQuery);
            //context.Load(collListItem);
            context.Load(collListItem,
                 items => items.Include(
                    item => item.Id,
                    item => item.DisplayName,
                    item => item.ContentType,
                    item => item["FileRef"],
                    item => item["WikiField"]));
            context.ExecuteQuery();

            
            int counter = 0;
            foreach (ListItem oListItem in collListItem)
            {
                if (oListItem.ContentType.Name == "IndboManual")
                {
                    string tmp= oListItem["FileRef"].ToString();
                    string fileName = tmp;
                    fileName= fileName.Substring(fileName.LastIndexOf('/') + 1);
                    string postFileString = tmp.Substring(0,tmp.LastIndexOf('/') + 1);
                    ClientSidePage P = ClientSidePage.Load(context, fileName);
                    foreach(CanvasSection section in P.Sections)
                    {

                        foreach (CanvasControl control in section.Controls)
                        {
                            if (control.Type.Name == "ClientSideText")
                            {
                                ClientSideText t = (ClientSideText)control;

                                var res = FindHrefs(fileName, t.Text);
                                if (res.Length>0)
                                {

                                    //t.Text= res;
                                    //P.Save();

                                }
                            }
                            
                        }
                    }
                    //if (oListItem["WikiField"].ToString().Contains("href"))
                    //{
                    //    Console.ForegroundColor = ConsoleColor.White;
                    //    Console.WriteLine("ID: " + oListItem.Id);
                    //    Console.WriteLine("Title: " + oListItem.DisplayName);
                    //    Console.WriteLine("Url: " + oListItem["FileRef"]);
                    //    Console.ForegroundColor = ConsoleColor.Yellow;
                    //    List<string> urls = FindHrefs(oListItem["WikiField"].ToString());

                    //    if (urls.Count > 0)
                    //    {
                    //        counter = counter + 1;
                    //        strLog.Add("ID: " + oListItem.Id);
                    //        strLog.Add("Title: " + oListItem.DisplayName);
                    //        strLog.Add("Url: " + oListItem["FileRef"]);
                    //        strLog.Add("-----------------------------");
                    //        foreach (string s in urls)
                    //        {
                    //            strLog.Add("link: " + s);
                    //        }
                    //        strLog.Add("-----------------------------");
                    //        System.IO.File.AppendAllLines(@"C:\Git\LBIntranet\SPOApp\SPOApp\SPOApp\logfiles\linksInManuals.txt", strLog.ToArray());
                    //    }



                    //    Console.WriteLine("");
                    //    Console.WriteLine("------------------------------------------------");
                    //    Console.ForegroundColor = ConsoleColor.White;

                    //}
                }
                



            }
            System.IO.File.AppendAllLines(@"C:\Git\LBIntranet\SPOApp\SPOApp\SPOApp\logfiles\linksInManuals.csv", strLog.ToArray());
            Console.WriteLine("Links counter: " + counter);

        }
        private static void ReplaceLinks()
        {
        }
        private static string FindHrefs(string fileName,string input)
        {
            Console.WriteLine("Title: " + fileName);
            
            string newPrefixUrl = "https://lbforsikring.sharepoint.com/sites/Skade/SitePages/";
            Regex regex = new Regex("href\\s*=\\s*(?:\"(?<1>[^\"]*)\"|(?<1>\\S+))", RegexOptions.IgnoreCase);
            Match match;
            
            //System.IO.File.AppendAllLines(@"C:\Git\LBIntranet\SPOApp\SPOApp\SPOApp\logfiles\linksInManuals.txt", strLog.ToArray());
            
            for (match = regex.Match(input); match.Success; match = match.NextMatch())
            {

                
                foreach (System.Text.RegularExpressions.Group group in match.Groups)
                {
                    string postFileString = group.Value.Substring(0, group.Value.LastIndexOf('/') + 1);
                    Console.WriteLine("group.Value: {0}", group.Value);
                    Console.WriteLine("postFileString: {0}", postFileString);
                    if (group.ToString().ToLower().Contains("ankeforsikring.dk") || 
                        group.ToString().ToLower().Contains("retsinformation.dk") || 
                        group.ToString().ToLower().Contains("borger.dk"))
                    {
                    }
                    else { 
                        strLog.Add(fileName + ";" + group.Value + ";" + postFileString);
                    }
                    //if (group.ToString().ToLower().Contains("skade/hb/indbo/sitepages"))
                    //{
                    //    strLog.Add(fileName + ";" + group.Value +";" + "skade/hb/indbo/sitepages");


                    //}
                    //else if (group.ToString().ToLower().Contains("skade/hb/indbo/sitepages"))
                    //{
                    //    strLog.Add(fileName + ";" + group.Value + ";" + "skade/hb/indbo/sitepages");
                    //}
                    //if (group.ToString().ToLower().Contains("skade/hb/indbo/"))
                    //{


                    //    string oldString = "/Skade/hb/indbo/SitePages/";
                    //    string res = input.Replace(oldString, newPrefixUrl);
                    //    strLog.Add(fileName + ";" + oldString+";" + group.Value + ";" + "Check");

                    //    Console.ForegroundColor = ConsoleColor.Yellow;
                    //    Console.ForegroundColor = ConsoleColor.White;


                    //    return res;
                    //}
                    //else if (group.ToString().Contains("sites/Skade/IndboFromLBIntranet"))
                    //{
                    //    string oldString = "sites/Skade/IndboFromLBIntranet";

                    //    strLog.Add(fileName + ";" + oldString + ";" + group.Value + ";" + "Check");
                    //    Console.ForegroundColor = ConsoleColor.DarkYellow;
                    //    Console.WriteLine("Href value: {0}", group);
                    //    Console.ForegroundColor = ConsoleColor.White;
                    //    return "";

                    //}
                    //else if (group.ToString().ToLower().Contains("ankeforsikring.dk") || group.ToString().ToLower().Contains("retsinformation.dk"))
                    //{

                    //    //Console.ForegroundColor = ConsoleColor.Green;
                    //    //Console.WriteLine("Href value: {0}", group);
                    //    //Console.ForegroundColor = ConsoleColor.White;
                    //    //return "";
                    //}
                    //else
                    //{

                    //    strLog.Add(fileName + ";" + group.Value + ";" + "[REFACTOR]" + ";" + "Refactor");


                    //    strLog.Add(fileName + "," + "" + "," + group.Value + "," + "Check");

                    //    Console.ForegroundColor = ConsoleColor.Red;
                    //    Console.WriteLine("Href value: {0}", group);
                    //    Console.ForegroundColor = ConsoleColor.White;
                    //    return "";

                    //}

                }
            }
            Console.WriteLine("--------------------------------------------" );
            return "";

        }
    }
}
