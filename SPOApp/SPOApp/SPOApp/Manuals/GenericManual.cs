using Microsoft.SharePoint.Client;
using Microsoft.VisualBasic.FileIO;
using OfficeDevPnP.Core;
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
    public static class GenericManual
    {

        public static List<GenericManualProperies> GetSourceFilesForRepair(ClientContext context, GenericConfiguration g)
        {
            List<string> repairFiles = new List<string>();
            using (var reader = new StreamReader(@"C:\Git\LBIntranet\SPOApp\SPOApp\SPOApp\logfiles\repair.csv"))
            {
                
                while (!reader.EndOfStream)
                {
                    
                    var line = reader.ReadLine();
                    repairFiles.Add(line);
                    
                }
            }
            List sourceSitePagesLibrary = context.Web.Lists.GetByTitle(g.SourceLibrary);

            CamlQuery query = CamlQuery.CreateAllItemsQuery();
            ListItemCollection items = sourceSitePagesLibrary.GetItems(query);
            context.Load(items);
            context.ExecuteQuery();
            List<GenericManualProperies> pages = new List<GenericManualProperies>();
            foreach (ListItem listItem in items)
            {
                if (repairFiles.IndexOf(listItem["FileLeafRef"].ToString()) > 0)
                {
                    if (listItem.FileSystemObjectType == FileSystemObjectType.File)
                    {

                        GenericManualProperies spp;
                        
                        spp.WikiContent = (listItem["WikiField"] == null) ? "" : listItem["WikiField"].ToString();

                        if (g.ContentTypeName == "RegresManual" ||
                            g.ContentTypeName == "BeredskabManual" ||
                            g.ContentTypeName == "StorskadeManual")
                        {
                            // Der er ingen kategori i Regreshåndbogen
                            spp.Gruppe = null;
                        }
                        else if (g.ContentTypeName == "AnsvarManual")
                        {
                            spp.Gruppe = (listItem["kATEGORI"] == null) ? "" : listItem["kATEGORI"].ToString();
                        }
                        else if (g.ContentTypeName == "HundManual")
                        {
                            spp.Gruppe = (listItem["kategori"] == null) ? "" : listItem["kategori"].ToString();
                        }
                        else if (g.ContentTypeName == "ScalePointManual")
                        {
                            spp.Gruppe = (listItem["L_x00f8_sning"] == null) ? "" : listItem["L_x00f8_sning"].ToString();
                        }
                        else if (g.ContentTypeName == "SkybrudsManual")
                        {
                            spp.Gruppe = (listItem["Emne"] == null) ? "" : listItem["Emne"].ToString();
                        }
                        else
                        {
                            spp.Gruppe = (listItem["Kategori"] == null) ? "" : listItem["Kategori"].ToString();
                        }


                        if (g.ContentTypeName != "HundManual" &&
                            g.ContentTypeName != "RetshjælpManual" &&
                            g.ContentTypeName != "GerningsmandManual" &&
                            g.ContentTypeName != "ScalePointManual" &&
                            g.ContentTypeName != "StorskadeManual" &&
                            g.ContentTypeName != "RejseManual" &&
                            g.ContentTypeName != "BeredskabManual" &&
                            g.ContentTypeName != "BilManual" &&
                            g.ContentTypeName != "SkybrudsManual")
                        {
                            spp.UnderGruppe = (listItem["Omr_x00e5_de"] == null) ? "" : listItem["Omr_x00e5_de"].ToString();
                        }
                        else if (g.ContentTypeName == "SkybrudsManual")
                        {
                            spp.UnderGruppe = (listItem["Forklaring"] == null) ? "" : listItem["Forklaring"].ToString();
                        }
                        else
                        {
                            spp.UnderGruppe = null;
                        }

                        spp.Title = listItem["FileLeafRef"].ToString().Split('.')[0];
                        spp.FileName = listItem["FileLeafRef"].ToString();

                        pages.Add(spp);
                    }
                }
            }
            return pages;
        }

        public static List<GenericManualProperies> GetSourceFiles(ClientContext context, GenericConfiguration g)
        {

            List sourceSitePagesLibrary = context.Web.Lists.GetByTitle(g.SourceLibrary);

            CamlQuery query = CamlQuery.CreateAllItemsQuery();
            ListItemCollection items = sourceSitePagesLibrary.GetItems(query);
            context.Load(items);
            context.ExecuteQuery();
            List<GenericManualProperies> pages = new List<GenericManualProperies>();
            foreach (ListItem listItem in items)
            {

                if (listItem.FileSystemObjectType == FileSystemObjectType.File)
                {

                    GenericManualProperies spp;
                    spp.WikiContent = (listItem["WikiField"] == null) ? "" : listItem["WikiField"].ToString();

                    if (g.ContentTypeName == "RegresManual" ||
                        g.ContentTypeName == "BeredskabManual" ||
                        g.ContentTypeName == "StorskadeManual")
                    {
                        // Der er ingen kategori i Regreshåndbogen
                        spp.Gruppe = null;
                    }
                    else if (g.ContentTypeName == "AnsvarManual")
                    {
                        spp.Gruppe = (listItem["kATEGORI"] == null) ? "" : listItem["kATEGORI"].ToString();
                    }
                    else if (g.ContentTypeName == "HundManual")
                    {
                        spp.Gruppe = (listItem["kategori"] == null) ? "" : listItem["kategori"].ToString();
                    }
                    else if (g.ContentTypeName == "ScalePointManual")
                    {
                        spp.Gruppe = (listItem["L_x00f8_sning"] == null) ? "" : listItem["L_x00f8_sning"].ToString();
                    }
                    else if (g.ContentTypeName == "SkybrudsManual")
                    {
                        spp.Gruppe = (listItem["Emne"] == null) ? "" : listItem["Emne"].ToString();
                    }
                    else
                    {
                        spp.Gruppe = (listItem["Kategori"] == null) ? "" : listItem["Kategori"].ToString();
                    }


                    if (g.ContentTypeName != "HundManual" &&
                        g.ContentTypeName != "RetshjælpManual" &&
                        g.ContentTypeName != "GerningsmandManual" &&
                        g.ContentTypeName != "ScalePointManual" &&
                        g.ContentTypeName != "StorskadeManual" &&
                        g.ContentTypeName != "RejseManual" &&
                        g.ContentTypeName != "BeredskabManual" &&
                        g.ContentTypeName != "BilManual" &&
                        g.ContentTypeName != "SkybrudsManual")
                    {
                        spp.UnderGruppe = (listItem["Omr_x00e5_de"] == null) ? "" : listItem["Omr_x00e5_de"].ToString();
                    }
                    else if (g.ContentTypeName == "SkybrudsManual")
                    {
                        spp.UnderGruppe = (listItem["Forklaring"] == null) ? "" : listItem["Forklaring"].ToString();
                    }
                    else
                    {
                        spp.UnderGruppe = null;
                    }

                    spp.Title = listItem["FileLeafRef"].ToString().Split('.')[0];
                    spp.FileName = listItem["FileLeafRef"].ToString();

                    pages.Add(spp);
                }
            }
            return pages;
        }



        public static List<GenericManualProperies> GetSourceFilesFromCSV(string sourceFilesFilePath)
        {
            List<GenericManualProperies> pages = new List<GenericManualProperies>();
            using (TextFieldParser parser = new TextFieldParser(sourceFilesFilePath))
            {
                parser.TextFieldType = Microsoft.VisualBasic.FileIO.FieldType.Delimited;
                parser.SetDelimiters(";");
                string[] fields = parser.ReadFields();
                while (!parser.EndOfData)
                {
                    GenericManualProperies page;
                    //Process row
                    //string[] fields = parser.ReadFields();

                    string line = parser.ReadLine();
                    page.FileName = line.Split(';')[0];
                    page.Gruppe = line.Split(';')[1];
                    page.UnderGruppe = null;
                    page.WikiContent = "[TODO]";
                    page.Title= line.Split(';')[0].Split('.')[0];

                    Console.WriteLine(page.Title);
                    pages.Add(page);
                }
            }
            return pages;
            
            //    List<GenericManualProperies> pages = new List<GenericManualProperies>();
            //using (var reader = new StreamReader(@"C:\Git\LBIntranet\SPOApp\SPOApp\SPOApp\importfiles\SharePointToExcel_Bil.csv"))
            //{

            //    while (!reader.EndOfStream)
            //    {
            //        GenericManualProperies page;
            //        var line = reader.ReadLine();
            //        page.FileName = line;
            //        pages.Add(page);

            //    }
            //}
            //List sourceSitePagesLibrary = context.Web.Lists.GetByTitle(g.SourceLibrary);

            //CamlQuery query = CamlQuery.CreateAllItemsQuery();
            //ListItemCollection items = sourceSitePagesLibrary.GetItems(query);
            //context.Load(items);
            //context.ExecuteQuery();
            
            //foreach (ListItem listItem in items)
            //{

            //    if (listItem.FileSystemObjectType == FileSystemObjectType.File)
            //    {

            //        GenericManualProperies spp;
            //        spp.WikiContent = (listItem["WikiField"] == null) ? "" : listItem["WikiField"].ToString();

            //        if (g.ContentTypeName == "RegresManual" ||
            //            g.ContentTypeName == "BeredskabManual" ||
            //            g.ContentTypeName == "StorskadeManual")
            //        {
            //            // Der er ingen kategori i Regreshåndbogen
            //            spp.Gruppe = null;
            //        }
            //        else if (g.ContentTypeName == "AnsvarManual")
            //        {
            //            spp.Gruppe = (listItem["kATEGORI"] == null) ? "" : listItem["kATEGORI"].ToString();
            //        }
            //        else if (g.ContentTypeName == "HundManual")
            //        {
            //            spp.Gruppe = (listItem["kategori"] == null) ? "" : listItem["kategori"].ToString();
            //        }
            //        else if (g.ContentTypeName == "ScalePointManual")
            //        {
            //            spp.Gruppe = (listItem["L_x00f8_sning"] == null) ? "" : listItem["L_x00f8_sning"].ToString();
            //        }
            //        else if (g.ContentTypeName == "SkybrudsManual")
            //        {
            //            spp.Gruppe = (listItem["Emne"] == null) ? "" : listItem["Emne"].ToString();
            //        }
            //        else
            //        {
            //            spp.Gruppe = (listItem["Kategori"] == null) ? "" : listItem["Kategori"].ToString();
            //        }


            //        if (g.ContentTypeName != "HundManual" &&
            //            g.ContentTypeName != "RetshjælpManual" &&
            //            g.ContentTypeName != "GerningsmandManual" &&
            //            g.ContentTypeName != "ScalePointManual" &&
            //            g.ContentTypeName != "StorskadeManual" &&
            //            g.ContentTypeName != "RejseManual" &&
            //            g.ContentTypeName != "BeredskabManual" &&
            //            g.ContentTypeName != "BilManual" &&
            //            g.ContentTypeName != "SkybrudsManual")
            //        {
            //            spp.UnderGruppe = (listItem["Omr_x00e5_de"] == null) ? "" : listItem["Omr_x00e5_de"].ToString();
            //        }
            //        else if (g.ContentTypeName == "SkybrudsManual")
            //        {
            //            spp.UnderGruppe = (listItem["Forklaring"] == null) ? "" : listItem["Forklaring"].ToString();
            //        }
            //        else
            //        {
            //            spp.UnderGruppe = null;
            //        }

            //        spp.Title = listItem["FileLeafRef"].ToString().Split('.')[0];
            //        spp.FileName = listItem["FileLeafRef"].ToString();

            //        pages.Add(spp);
            //    }
            //}
            //return pages;
        }

        //public static void CreateModernSitePages(ClientContext context, List<GenericManualProperies> pages, GenericConfiguration g)
        //{
        //    int counter = 1;
        //    foreach (var p in pages)
        //    {
        //        Console.WriteLine("Creating " + counter + " of " + pages.Count);
        //        Console.WriteLine("Start creating " + p.FileName);
        //        CreatePages(context, p, g.ContentTypeName);
        //        //if (p.FileName.Equals("1 eller 2 selvrisikobeløb.aspx"))
        //        //{
        //        //    Console.WriteLine("Creating " + counter + " of " + pages.Count);
        //        //    Console.WriteLine("Start creating " + p.FileName);
        //        //    CreatePages(context, p, g.ContentTypeName);
        //        //}

        //    }
        //}

        //private static void CreatePages(ClientContext context, GenericManualProperies p, string targetContentTypeName)
        //{
        //    try
        //    {
        //        string ManualName = "";
        //        string ManualImage = "";
        //        switch (targetContentTypeName)
        //        {
        //            default:
        //                break;
        //        }
        //        ClientSidePage page = context.Web.AddClientSidePage(p.FileName, true);

        //        //ClientSideText txt1 = new ClientSideText() { Text = p.WikiContent };
        //        ClientSideText txt1 = new ClientSideText() { Text = "[TODO]" };

        //        page.AddControl(txt1, -1);

        //        Microsoft.SharePoint.Client.ContentType newContentType = context.Web.GetContentTypeByName(targetContentTypeName);
        //        context.Load(newContentType);
        //        context.ExecuteQuery();

        //        ListItem item = page.PageListItem;

        //        context.Load(item);
        //        context.ExecuteQuery();

        //        item.Properties["ContentTypeId"] = newContentType.Id.StringValue;
        //        item["ContentTypeId"] = newContentType.Id;

        //        item.Update();

        //        if (!string.IsNullOrEmpty(p.Gruppe))
        //        {
        //            SPOUtility.SetMetadataField(context, item, p.Gruppe, "Gruppe");
        //            item.Update();
        //        }
        //        if (!string.IsNullOrEmpty(p.UnderGruppe))
        //        {
        //            SPOUtility.SetMetadataField(context, item, p.UnderGruppe, "Undergruppe");
        //            item.Update();
        //        }

        //        SPOUtility.SetMetadataField(context, item, "Hest", "Håndbog");



        //        page.Save();
        //        page.Publish();

        //        context.ExecuteQuery();
        //        string newFilePrefix = Program.IsPageCoincidence(p.FileName);
        //        if (!string.IsNullOrEmpty(newFilePrefix))
        //        {
        //            Program.RenameFile(newFilePrefix + p.FileName);
        //        }

        //    }
        //    catch (Exception ex)
        //    {
        //        Console.WriteLine(p.FileName);
        //        Console.WriteLine(ex);

        //    }
        //}




    }
}
