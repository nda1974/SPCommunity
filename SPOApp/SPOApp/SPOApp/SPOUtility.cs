using Microsoft.SharePoint.Client;
using Microsoft.SharePoint.Client.Taxonomy;
using OfficeDevPnP.Core;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Security;
using System.Text;
using System.Threading.Tasks;

namespace SPOApp
{
    public static class SPOUtility
    {
        public static ClientContext Authenticate(string url, string userName, string passWord) {
            AuthenticationManager am = new AuthenticationManager();
            return am.GetWebLoginClientContext(url, null);
            //SecureString ss = GetSecureString(passWord);
            //return am.GetSharePointOnlineAuthenticatedContextTenant(url, userName, ss);

            //return am.GetSharePointOnlineAuthenticatedContextTenant(url, userName, ss);
        }


        private static SecureString GetSecureString(string label)

        {
            var data = label;
            SecureString secure = new SecureString();
            foreach (var character in data.ToCharArray())
                secure.AppendChar(character);
            SecureString sStrPwd = new SecureString();
            sStrPwd = secure;
            return sStrPwd;

            
        }

        public static void CheckInAllDocuments(ClientContext context, string documentLibraryUrl)
        {
            List sourceSitePagesLibrary = context.Web.Lists.GetByTitle(documentLibraryUrl);

            CamlQuery query = CamlQuery.CreateAllItemsQuery();
            ListItemCollection items = sourceSitePagesLibrary.GetItems(query);
            context.Load(items);
            context.ExecuteQuery();
            
            foreach (ListItem listItem in items)
            {
                try
                {
                    

                        if (listItem.FieldValues["ContentTypeId"].ToString() == "0x0101009D1CB255DA76424F860D91F20E6C4118003547E51ACD90E14980D58AF37F7253291000F87F21B783C0CB43B9694B28192B178B" && listItem.FileSystemObjectType == FileSystemObjectType.File)
                        {
                            listItem.File.PublishFileToLevel(FileLevel.Published);
                        }
                }
                catch (Exception)
                {


                }
                
            }
            context.ExecuteQuery();

        }


        public static void SetMetadataField(ClientContext ctx, ListItem item, string term,string taxFieldInternalName)
        {
            List sitePagesList = ctx.Web.Lists.GetByTitle("Webstedssider");
            
            //Field field = sitePagesList.Fields.GetFieldByInternalName("IndboManualCategory");
            Field field = sitePagesList.Fields.GetFieldByInternalName(taxFieldInternalName);

            ctx.Load(field);
            ctx.ExecuteQuery();

            TaxonomyField txField = ctx.CastTo<TaxonomyField>(field);

            string termId = GetTermIdForTerm(term, txField.TermSetId, ctx);
            
            if (!string.IsNullOrEmpty(termId))
            {
                TaxonomyFieldValue termValue = new TaxonomyFieldValue();
                termValue.Label = term;
                termValue.TermGuid = termId;
                termValue.WssId = -1;
                txField.SetFieldValueByValue(item, termValue);
            }
        }

        

        public static string GetTermIdForTerm(string term, Guid termSetId, ClientContext clientContext)
        {
            string termId = string.Empty;

            TaxonomySession tSession = TaxonomySession.GetTaxonomySession(clientContext);
            TermStore ts = tSession.GetDefaultSiteCollectionTermStore();
            TermSet tset = ts.GetTermSet(termSetId);

            LabelMatchInformation lmi = new LabelMatchInformation(clientContext);

            lmi.Lcid = 1033;
            lmi.TrimUnavailable = true;
            lmi.TermLabel = term;

            //TermCollection termMatches = tset.GetTerms(lmi);
            TermCollection termMatches = tset.GetTerms(lmi);


            //tset.CreateTerm()
            clientContext.Load(tSession);
            clientContext.Load(ts);
            clientContext.Load(tset);
            clientContext.Load(termMatches);


            clientContext.ExecuteQuery();

            if (termMatches != null && termMatches.Count() > 0)
            {
                termId = termMatches.First().Id.ToString();
            }
            else
            {
                Term TermAdd = tset.CreateTerm(term, 1033, Guid.NewGuid());
                clientContext.ExecuteQuery();
                clientContext.Load(TermAdd);
                clientContext.ExecuteQuery();
                termId = TermAdd.Id.ToString();

            }


            return termId;

        }
    }
}
