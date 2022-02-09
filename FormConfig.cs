using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace Power.RGY.Public.Models
{
    //Widget Menu,MenuWidget
    public class Widget {
        public Guid Id { get; set; }
        public String Name { get; set; }
        public String HtmlPath { get; set; }
        public Guid? OpenFormId{get;set;}
    }   
    public class MenuWidget
    {
        public Guid MenuId { get; set; }
        public Guid WidgetId { get; set; }
    }
    public class FormConfig
    {
        public Config config=new Config();
    }
    public class Config
    {
        public string keyword { get; set; }
        public Guid? openformid { get; set; }
    }
    public class MainMenu
    {
        public Guid Id { get; set; }
        public Guid ParentId { get; set; }
        public string Name { get; set; }
    }
}
