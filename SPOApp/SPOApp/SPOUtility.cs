using Microsoft.SharePoint.Client;
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
            //return am.GetSharePointOnlineAuthenticatedContextTenant(url, "nicd@lboffice365.onmicrosoft.com", "MandM1974");
            return am.GetSharePointOnlineAuthenticatedContextTenant(url, userName, passWord);
        }


        private static SecureString GetSecureString(string label)

        {
            var data = "MandM1974";
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
                if (listItem.FileSystemObjectType == FileSystemObjectType.File)
                {
                    listItem.File.PublishFileToLevel(FileLevel.Published);
                }
            }
            context.ExecuteQuery();

        }
        
    }
}
