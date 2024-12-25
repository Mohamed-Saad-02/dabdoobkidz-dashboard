interface TranslatedText {
    en: string;
    ar: string;
  }
  
  interface Widget {
    text: TranslatedText;
    widgetType: string;
    replacer: string;
  }
  
  interface Element {
    title: TranslatedText;
    description: TranslatedText;
    image: string;
    order: number;
    widgets: Widget[];
  }
  
 export  interface Banner {
    name: TranslatedText;
    isActive: boolean;
    elements: Element[];
  }
  