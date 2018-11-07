using Microsoft.VisualBasic.FileIO;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SPOApp
{
    public static class PoliceManualApp
    {
        public static void ReadImportFile()
        {
            List<string> repairFiles = new List<string>();
            var sourceFilesFilePath = @"C:\Git\LBIntranet\SPOApp\SPOApp\SPOApp\PoliceManuals\PoliceCSV.CSV";




            //using (var reader = new StreamReader(sourceFilesFilePath))
            //{

            //    while (!reader.EndOfStream)
            //    {

            //        var line = reader.ReadLine();
            //        Console.WriteLine(line.Split(';')[0]);
            //        Console.WriteLine(line.Split(';')[1]);
            //        Console.WriteLine(line.Split(';')[2]);
            //        Console.WriteLine(line.Split(';')[3]);
            //        Console.WriteLine("--------------------------------------");

            //    }
            //}
            using (TextFieldParser parser = new TextFieldParser(sourceFilesFilePath))
            {
                parser.TextFieldType = Microsoft.VisualBasic.FileIO.FieldType.Delimited;
                
                parser.SetDelimiters(";");
                string[] fields = parser.ReadFields();
                while (!parser.EndOfData)
                {
                    //Process row
                    //string[] fields = parser.ReadFields();

                    string line = parser.ReadLine();
                    Console.WriteLine(line.Split(';')[0]);
                    Console.WriteLine(line.Split(';')[1]);
                    Console.WriteLine(line.Split(';')[2]);
                    Console.WriteLine(line.Split(';')[3]);
                }


            }
        }
    }
}


