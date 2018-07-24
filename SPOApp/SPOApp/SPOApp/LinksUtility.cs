using HtmlAgilityPack;
using Microsoft.SharePoint.Client;
using OfficeDevPnP.Core.Pages;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Text;
using System.Text.RegularExpressions;
using System.Threading.Tasks;
using System.Web;

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
                if (oListItem.ContentType.Name == "BaadManual")
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
                                t.Text = res;
                            }
                        }
                    }
                    P.Save();
                    P.Publish();
                   
                }
                



            }
            System.IO.File.AppendAllLines(@"C:\Git\LBIntranet\SPOApp\SPOApp\SPOApp\logfiles\linksInManuals.csv", strLog.ToArray(),Encoding.UTF8);
            Console.WriteLine("Links counter: " + counter);

        }
        private static void ReplaceLinks(string source, string target, string fileName)
        {
        }
        private static string FindHrefs(string fileName,string input)
        {
            string newInput = "";
            string s= HttpUtility.UrlEncode("https://lbforsikring.sharepoint.com/sites/Skade/SitePages/" + fileName);

            
            string newPrefixUrl = "https://lbforsikring.sharepoint.com/sites/Skade/SitePages/";
            Regex regex = new Regex("href\\s*=\\s*(?:\"(?<1>[^\"]*)\"|(?<1>\\S+))", RegexOptions.IgnoreCase);
            
            Match match;
            
            for (match = regex.Match(input); match.Success; match = match.NextMatch())
            {

                foreach (System.Text.RegularExpressions.Capture capture in match.Captures)
                {
                    
                    if (capture.Value.ToString().ToLower().Contains("skade/hb"))
                    {
                        Console.WriteLine("Capture.Value: {0}", capture.Value);
                        string postFileString = capture.Value.Substring(capture.Value.LastIndexOf('/') + 1);
                        newInput=input.Replace(capture.Value, "href=\"/sites/Skade/SitePages/" + postFileString + "\"");
                        //WebUtility.UrlEncode
                        Console.WriteLine("New value: {0}", "href=\"/sites/Skade/SitePages/" + fileName + "\"");
                        FindHrefs(fileName, newInput);
                        
                    }
                    //else
                    //{
                    //    Console.WriteLine("Capture.Value: {0}", capture.Value);
                    //}
                }

                //    foreach (System.Text.RegularExpressions.Group group in match.Groups)
                //{
                //    string postFileString = group.Value.Substring(0, group.Value.LastIndexOf('/') + 1);
                //    Console.WriteLine("group.Value: {0}", group.Value);
                //    Console.WriteLine("postFileString: {0}", postFileString);
                //    if (group.ToString().ToLower().Contains("ankeforsikring.dk") || 
                //        group.ToString().ToLower().Contains("retsinformation.dk") || 
                //        group.ToString().ToLower().Contains("borger.dk") ||
                //        group.ToString().ToLower().Contains("tinglysning.dk") ||
                //        group.ToString().ToLower().Contains("forsikringogpension.dk"))
                //    {
                //    }
                //    else if (group.ToString().ToLower().Contains("skade/hb"))
                //    {
                //        ReplaceLinks(postFileString);
                //        strLog.Add(fileName + ";" + group.Value + ";" + postFileString);
                //    }
                //    else { 
                //        strLog.Add(fileName + ";" + group.Value + ";" + postFileString);
                //    }
                    

                //}
            }
            Console.WriteLine("--------------------------------------------" );
            return newInput;

        }
    }
}
