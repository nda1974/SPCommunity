using Microsoft.SharePoint.Client;
using Microsoft.SharePoint.Client.Utilities;
using OfficeDevPnP.Core.Pages;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Text;
using System.Text.RegularExpressions;
using System.Threading.Tasks;

namespace SPOApp
{
    public static class Indbo
    {
        

        

        public static List<IndboManualProperies> GetSourceFiles(ClientContext context, string sourceLibraryName)
        {


            //StreamReader sr = new StreamReader(@"C:\Git\LBIntranet\SPOApp\IndbohåndbøgerCSV.csv");
            //// for set encoding
            //// StreamReader sr = new StreamReader(@"file.csv", Encoding.GetEncoding(1250));
            //List<IndboManualProperies> pages = new List<IndboManualProperies>();
            //string strline = "";
            //string[] _values = null;
            //int x = 0;
            //while (!sr.EndOfStream)
            //{
            //    x++;
            //    strline = sr.ReadLine();
            //    _values = strline.Split(';');
            //    if (x > 1)
            //    {
            //        IndboManualProperies spp;
            //        //spp.WikiContent = listItem["FileLeafRef"].ToString() == "Advokatomkostninger.aspx"? spp.WikiContent=Program.ReadFromWordDocument(""):"Hest";

            //        //spp.WikiContent = (listItem["WikiField"] == null) ? "" : listItem["WikiField"].ToString();
            //        spp.WikiContent = "[TODO]";
            //        spp.IndboCategory = _values[2];
            //        spp.IndboArea = _values[1];
            //        spp.Title = _values[0].ToString().Split('.')[0];
            //        spp.FileName = _values[0];
            //        spp.LBInfo = _values[3];
            //        spp.LBTeaser = _values[4];
            //        spp.LBKendelser = "";

            //        pages.Add(spp);
            //        Console.WriteLine(_values);
            //    }
            //}
            //sr.Close();



            
            List sourceSitePagesLibrary = context.Web.Lists.GetByTitle(sourceLibraryName);

            CamlQuery query = CamlQuery.CreateAllItemsQuery();
            ListItemCollection items = sourceSitePagesLibrary.GetItems(query);
            context.Load(items);
            context.ExecuteQuery();
            List<IndboManualProperies> pages = new List<IndboManualProperies>();
            foreach (ListItem listItem in items)
            {

                if (listItem.FileSystemObjectType == FileSystemObjectType.File)
                {
                    //if (listItem["FileLeafRef"].ToString() == "Bofælle.aspx")
                    //{

                    //    //Program.CreateWordDocument(listItem["WikiField"].ToString());
                    //}
                    //else
                    //{
                    //}

                    IndboManualProperies spp;
                    //spp.WikiContent = listItem["FileLeafRef"].ToString() == "Advokatomkostninger.aspx"? spp.WikiContent=Program.ReadFromWordDocument(""):"Hest";

                    //spp.WikiContent = (listItem["WikiField"] == null) ? "" : listItem["WikiField"].ToString();
                    spp.WikiContent = "[TODO]";
                    spp.IndboCategory = (listItem["Kategori"] == null) ? "" : listItem["Kategori"].ToString();
                    spp.IndboArea = (listItem["Omr_x00e5_de"] == null) ? "" : listItem["Omr_x00e5_de"].ToString();
                    spp.Title = listItem["FileLeafRef"].ToString().Split('.')[0];
                    spp.FileName = listItem["FileLeafRef"].ToString();
                    spp.LBInfo = (listItem["HandbogInfo"] == null) ? "" : listItem["HandbogInfo"].ToString();
                    spp.LBKendelser = (listItem["HandbogKendelser"] == null) ? "" : listItem["HandbogKendelser"].ToString();
                    spp.LBTeaser = (listItem["HandbogTeaser"] == null) ? "" : listItem["HandbogTeaser"].ToString();

                    pages.Add(spp);
                }
            }
            return pages;
        }

        public static void CreateModernSitePages(ClientContext context, List<IndboManualProperies> pages)
        {

            //List<AnsvarManualProperies> sourcePages = pages;
            string targetContentTypeName = "IndboManual";
            int counter = 0;
            foreach (var p in pages)
            {
                counter = counter + 1;
                Console.WriteLine("Creating " + p.FileName + " page " + counter + " of " + pages.Count);
                CreatePages(context, p, targetContentTypeName);
                //if (p.FileName.Equals("Bofælle.aspx"))
                //{
                //    CreatePages(context, p, targetContentTypeName);
                //}

            }
        }

        private static void CreatePages(ClientContext context, IndboManualProperies p, string targetContentTypeName)
        {
            try
            {
                ClientSidePage.Load(context, p.FileName);
                Console.ForegroundColor = ConsoleColor.Yellow;
                Console.WriteLine("The file " + p.FileName + " already exists");
                Console.ForegroundColor = ConsoleColor.White;
            }
            catch (Exception)
            {

                var page = context.Web.AddClientSidePage(p.FileName, true);
                //string s = Regex.Replace(p.WikiContent, "<.*?>", String.Empty);
                //string s = Program.ReadFromWordDocument("");

                ClientSideText txt1 = new ClientSideText() { Text = p.WikiContent };

                page.AddControl(txt1, -1);

                Microsoft.SharePoint.Client.ContentType newContentType = context.Web.GetContentTypeByName(targetContentTypeName);
                context.Load(newContentType);
                context.ExecuteQuery();

                ListItem item = page.PageListItem;
                //item.Update();

                context.Load(item);
                context.ExecuteQuery();

                //item["ContentType"] = newContentType.Name;
                item.Properties["ContentTypeId"] = newContentType.Id.StringValue;
                item["ContentTypeId"] = newContentType.Id;

                item.Update();
                //page.Save();

                //context.ExecuteQuery();



                //context.ExecuteQuery();

                if (!string.IsNullOrEmpty(p.IndboCategory))
                {
                    SPOUtility.SetMetadataField(context, item, p.IndboCategory, "IndboCategory");
                    item.Update();
                }
                if (!string.IsNullOrEmpty(p.IndboArea))
                {
                    SPOUtility.SetMetadataField(context, item, p.IndboArea, "IndboArea");
                    item.Update();
                }


                if (!string.IsNullOrEmpty(p.LBKendelser))
                {
                    item["LBVerdicts"] = p.LBKendelser;
                }

                if (!string.IsNullOrEmpty(p.LBTeaser))
                {
                    item["LBTeaser"] = p.LBTeaser;
                }

                if (!string.IsNullOrEmpty(p.LBInfo))
                {
                    item["LBInfo"] = p.LBInfo;
                }

                item.Update();

                page.Save();


                context.ExecuteQuery();
            }
            
            //var page = context.Web.AddClientSidePage(p.FileName, true);
            ////string s = Regex.Replace(p.WikiContent, "<.*?>", String.Empty);
            ////string s = Program.ReadFromWordDocument("");
            
            //ClientSideText txt1 = new ClientSideText() { Text = p.WikiContent };

            //page.AddControl(txt1, -1);

            //Microsoft.SharePoint.Client.ContentType newContentType = context.Web.GetContentTypeByName(targetContentTypeName);
            //context.Load(newContentType);
            //context.ExecuteQuery();

            //ListItem item = page.PageListItem;
            ////item.Update();

            //context.Load(item);
            //context.ExecuteQuery();

            ////item["ContentType"] = newContentType.Name;
            //item.Properties["ContentTypeId"] = newContentType.Id.StringValue;
            //item["ContentTypeId"] = newContentType.Id;

            //item.Update();
            ////page.Save();

            ////context.ExecuteQuery();



            ////context.ExecuteQuery();

            //if (!string.IsNullOrEmpty(p.IndboCategory))
            //{
            //    SPOUtility.SetMetadataField(context, item, p.IndboCategory, "IndboCategory");
            //    item.Update();
            //}
            //if (!string.IsNullOrEmpty(p.IndboArea))
            //{
            //    SPOUtility.SetMetadataField(context, item, p.IndboArea, "IndboArea");
            //    item.Update();
            //}


            //if (!string.IsNullOrEmpty(p.LBKendelser))
            //{
            //    item["LBVerdicts"] = p.LBKendelser;
            //}

            //if (!string.IsNullOrEmpty(p.LBTeaser))
            //{
            //    item["LBTeaser"] = p.LBTeaser;
            //}

            //if (!string.IsNullOrEmpty(p.LBInfo))
            //{
            //    item["LBInfo"] = p.LBInfo;
            //}

            //item.Update();





            
            //page.Save();


            //context.ExecuteQuery();


        }
        public static void CheckForLinks(ClientContext context)
        {
            CamlQuery camlQuery = new CamlQuery();

            List<string> strLogMessageNoFilesWithLinks = new List<string>();
            List<string> strLogMessageNoFilesWithNoCanvas = new List<string>();




            var oList = context.Web.Lists.GetByTitle("IndboFromLBIntranet");
            ListItemCollection collListItem = oList.GetItems(camlQuery);
            context.Load(collListItem);

            context.Load(collListItem,
                 items => items.Include(
                    item => item.Id,
                    item => item.DisplayName,
                    item => item.ContentType,
                    item => item["FileRef"],
                    item => item["WikiField"]));

            context.ExecuteQuery();


            List<string> strLog = new List<string>();
            int counter = 0;
            foreach (ListItem oListItem in collListItem)
            {
                

                    if (oListItem["WikiField"].ToString().Contains("href"))
                    {
                        Console.ForegroundColor = ConsoleColor.White;
                        Console.WriteLine("ID: " + oListItem.Id);
                        Console.WriteLine("Title: " + oListItem.DisplayName);
                        Console.WriteLine("Url: " + oListItem["FileRef"]);
                        Console.ForegroundColor = ConsoleColor.Yellow;
                        List<string> urls = FindHrefs(oListItem["WikiField"].ToString());

                        if (urls.Count>0)
                        {
                            counter = counter+1;
                            strLog.Add("ID: " + oListItem.Id);
                            strLog.Add("Title: " + oListItem.DisplayName);
                            strLog.Add("Url: " + oListItem["FileRef"]);
                            strLog.Add("-----------------------------");
                            foreach (string s in urls)
                            {
                                strLog.Add("link: " + s);
                            }
                            strLog.Add("-----------------------------");
                            System.IO.File.AppendAllLines(@"C:\Git\LBIntranet\SPOApp\SPOApp\SPOApp\logfiles\linksInManuals.txt", strLog.ToArray());
                        }   

                        
                        //FindHrefs(oListItem["WikiField"].ToString());
                        Console.WriteLine("");
                        Console.WriteLine("------------------------------------------------");
                        //Console.WriteLine("ID: {0} \nDisplay name: {1} \n Url {2} ",
                        //oListItem.Id, oListItem.DisplayName, oListItem["FileRef"]);
                        //FindHrefs(oListItem["CanvasContent1"].ToString());
                        Console.ForegroundColor = ConsoleColor.White;
                        
                }
                
                

            }
            Console.WriteLine("Links counter: " + counter);

        }

        public static void CheckForLinksORG(ClientContext context) {
            CamlQuery camlQuery = new CamlQuery();

            List<string> strLogMessageNoFilesWithLinks = new List<string>();
            List<string> strLogMessageNoFilesWithNoCanvas = new List<string>();




            var oList = context.Web.Lists.GetByTitle("Webstedssider");
            ListItemCollection collListItem = oList.GetItems(camlQuery);
            context.Load(collListItem);

            context.Load(collListItem,
                 items => items.Include(
                    item => item.Id,
                    item => item.DisplayName,
                    item => item.ContentType,
                    item => item["FileRef"],
                    item => item["CanvasContent1"]));

            context.ExecuteQuery();
            //List<string> strLog = new List<string>();
            foreach (ListItem oListItem in collListItem)
            {
                if (oListItem.ContentType.Name == "IndboManual")
                {
                    
                    if (oListItem["CanvasContent1"].ToString().Contains("href"))
                    {
                        Console.ForegroundColor = ConsoleColor.Red;
                        Console.WriteLine("ID: " + oListItem.Id);
                        Console.WriteLine("Title: " + oListItem.DisplayName);
                        Console.WriteLine("Url: " + oListItem["FileRef"]);
                        
                        FindHrefs(oListItem["CanvasContent1"].ToString());
                        Console.WriteLine("------------------------------------------------");
                        //Console.WriteLine("ID: {0} \nDisplay name: {1} \n Url {2} ",
                        //oListItem.Id, oListItem.DisplayName, oListItem["FileRef"]);
                        //FindHrefs(oListItem["CanvasContent1"].ToString());
                        Console.ForegroundColor = ConsoleColor.White;
                    }
                }
                
            }


            //System.IO.File.AppendAllLines(@"C:\Git\LBIntranet\SPOApp\SPOApp\SPOApp\logfiles\linksInManuals.txt", strLog.ToArray());
            //System.IO.File.WriteAllLines(@"C:\Git\LBIntranet\SPOApp\SPOApp\SPOApp\logfiles\linksInManuals.txt", strLog.ToArray());
            

        }

        private static List<string> FindHrefs(string input)
        {
            List<string> strLog = new List<string>();

            Regex regex = new Regex("href\\s*=\\s*(?:\"(?<1>[^\"]*)\"|(?<1>\\S+))", RegexOptions.IgnoreCase);
            Match match;
            for (match = regex.Match(input); match.Success; match = match.NextMatch())
            {
                Console.WriteLine("Found a href. ");
                foreach (System.Text.RegularExpressions.Group group in match.Groups)
                {
                    
                    if (group.ToString().ToLower().Contains("skade/hb/indbo/") || group.ToString().Contains("sites/Skade/IndboFromLBIntranet") || group.ToString().ToLower().Contains("ankeforsikring.dk") )
                    {
                        Console.WriteLine("Href value: {0}", group);
                    }
                    else
                    {
                        strLog.Add(group.ToString());
                        Console.ForegroundColor = ConsoleColor.Red;
                        Console.WriteLine("Href value: {0}", group);
                        Console.ForegroundColor = ConsoleColor.Yellow;
                    }
                }
            }
            return strLog;

        }

    }
}
