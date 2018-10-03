using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

using Microsoft.Azure; // Namespace for CloudConfigurationManager
using Microsoft.Azure.Storage; // Namespace for StorageAccounts
using Microsoft.Azure.CosmosDB.Table; // Namespace for Table storage types


namespace AzureTableStorageImport
{
    class Program
    {
        static void Main(string[] args)
        {
            // Retrieve the storage account from the connection string.
            CloudStorageAccount storageAccount = CloudStorageAccount.Parse(
                CloudConfigurationManager.GetSetting("StorageConnectionString"));

            // Create the table client.
            CloudTableClient tableClient = storageAccount.CreateCloudTableClient();

            // Create the CloudTable object that represents the "people" table.
            CloudTable table = tableClient.GetTableReference("TestTable");

            // Create a new customer entity.
            ClaimControlEntity customer1 = new ClaimControlEntity("Harp", "Walter");
            customer1.BatchID= "Walter@contoso.com";
            customer1.ClaimID= "425-555-0101";

            // Create the TableOperation object that inserts the customer entity.
            TableOperation insertOperation = TableOperation.Insert(customer1);

            // Execute the insert operation.
            table.Execute(insertOperation);
        }
    }

    public class ClaimControlEntity : TableEntity
    {
        public ClaimControlEntity(string lastName, string firstName)
        {
            this.PartitionKey = lastName;
            this.RowKey = firstName;
        }

        public ClaimControlEntity() { }

        public string ClaimID { get; set; }

        public string BatchID{ get; set; }
    }
}
