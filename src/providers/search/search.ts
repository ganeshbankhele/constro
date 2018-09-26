import { Injectable } from '@angular/core';
import { ModalController, /*NavController, NavParams,*/ LoadingController, ToastController } from 'ionic-angular';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { CommonClass } from '../commonclass'

@Injectable()
export class SearchProvider {
  public showSearchbar: boolean = false;
  public showSearchButton: boolean = false;
  priceRangeLower:number=null;
  priceRangeUpper:number=null;
  Price:any =[];
  Moq:any =[];
  Other:any =[];
  sellectedVariantCount = [];
  getQuoteids: any = [];
  getQuoteidsCompanyPage: any = [];
  canleave:boolean = false;
  cloneFilter123 = {};
  countFil: number;
  moqRange: number=null;
  Filters = [];
  selectedFilter =[];
  selectedFilterString =[];
  resetFilter:boolean = true;
  gotoSearch: boolean = false;
  location: string="";
  searchForType: string ="Product/Service";
  product_text: string="";
  getQuote: any;
  data: any;
  datas: any;
  error: any;
  keyword: string;
  product_search: any = {
    SearchForType: "Product/Service",
    User_Id: 0,
    city_id: 0,
    country_id: 1,
    end_limit: 25,
    externalsearch: "",
    filters: [],
    location_id: 0,
    search_text: "",
    Location_Name:"",
    sort_order: "ASC",
    start_limit: 0,
    state_id: 0,
    token: "",
    userType: "Buyer",
    requestFrom:"App"
  };

  searchSelect: any =[
    {"type":"Product/Service","status":true},
    {"type":"Company","status":false},
    {"type":"Brand","status":false}
  ];
  mainUrl = "";
  constructor(public modalCtrl: ModalController,
    public loadingCtrl: LoadingController,
    public toastCtrl: ToastController,public com:CommonClass,  
    public http: HttpClient) {
      this.mainUrl = this.com.url;
  }
  search_tool(search_status) {
    if (search_status == false) {
      this.showSearchbar = true;
    } else {
      this.showSearchbar = false;
    }
  }
  

  changeSelect(line: string) {
    this.searchForType = line;
    this.product_search.SearchForType = this.searchForType;
    this.searchSelect.forEach(element => {
      if(element.type==line){
        element.status=true;
      }else{
        element.status=false;
      }
    });
    console.log(this.searchSelect);
  }

  searchLocation(value) {
    this.keyword = value;
    const search_loc = this.mainUrl + "Search/searchLocationKey";
    var headers = new HttpHeaders();
    headers.append("Accept", "application/json");
    let postParams = {
      keyword: this.keyword,
      requestFrom: "App",
      token: ""
    };
    return new Promise(resolve => {
      return this.http.post(search_loc, JSON.stringify(postParams), { headers: headers }).subscribe(data => {
        this.data = data;
        if (this.data.response.status == 'success') {
          this.data = this.data.response.responseListObject;
          resolve(this.data);
        }
      }, err => {
        console.log(err);
      });
    });
  }

  searchCompanyLocation(value) {
    this.keyword = value;
    const search_loc = this.mainUrl + "Search/getexactlocation";
    var headers = new HttpHeaders();
    headers.append("Accept", "application/json");
    let postParams = {
      keyword: this.keyword,
      requestFrom: "App",
      token: ""
    };
    return new Promise(resolve => {
      return this.http.post(search_loc, JSON.stringify(postParams), { headers: headers }).subscribe(data => {
        this.data = data;
        if (this.data.response.status == 'success') {
          this.data = this.data.response.responseListObject;
          resolve(this.data);
        }
      }, err => {
        console.log(err);
      });
    });
  }

  product(value) {
    this.keyword = value;
    const search_loc = this.mainUrl + "Search/getSearchSuggession";
    var headers = new HttpHeaders();
    headers.append("Accept", "application/json");
    let postParams = {
      search_text: this.keyword,
      search_type: this.searchForType,
      requestFrom: "App",
      token: ""
    };

    return new Promise(resolve => {
      return this.http.post(search_loc, JSON.stringify(postParams), { headers: headers }).subscribe(data => {
        this.data = data;
        if (this.data.response.status == 'success') {
          this.data = this.data.response.responseListObject;
          resolve(this.data); 
        }else{
          let blankData = [];
          resolve(blankData);
        }
      }, err => {
        console.log(err);
        
      });
    });
  }

  postRequireproduct(value) {
    this.keyword = value;
    const search_loc = this.mainUrl + "PostRequirement/getProducts";
    var headers = new HttpHeaders();
    headers.append("Accept", "application/json");
    let postParams = {
      keyword: this.keyword,
      requestFrom: "App",
      token: ""
    };

    return new Promise(resolve => {
      return this.http.post(search_loc, JSON.stringify(postParams), { headers: headers }).subscribe(data => {
        this.data = data;
        if (this.data.response.status == 'success') {
          this.data = this.data.response.responseListObject.productslist;
          resolve(this.data); 
        }else{
          let blankData = [];
          resolve(blankData);
        }
      }, err => {
        console.log(err);
        
      });
    });
  }

  search() {
    const search_product = this.mainUrl + "Search/buyerSearch";
    var headers = new HttpHeaders();
    headers.append("Accept", "application/json");
    return new Promise(resolve => {
      return this.http.post(search_product, JSON.stringify(this.product_search), { headers: headers }).subscribe(data => {
        let searchResult:any = data;
        if (searchResult.response.status == 'Success') {
          let searchResultProduct = searchResult.response.responseListObject.Products;
          resolve(searchResultProduct);
        }

      }, err => {
        console.log(err);
      });
    });
  }

  filter() {
    const search_product = this.mainUrl + "Search/buyerFilters";
    var headers = new HttpHeaders();
    headers.append("Accept", "application/json");
    return new Promise(resolve => {
      return this.http.post(search_product, JSON.stringify(this.product_search), { headers: headers }).subscribe(data => {
        let searchResult:any = data;
        if (searchResult.response.status == 'Success') {
          let searchResultProduct = searchResult.response.responseListObject;
          resolve(searchResultProduct);
        }
      }, err => {
        console.log(err);
      });
    });
  }

  

  checkEmaptyProfileInsert(para) {
    const search_product = this.mainUrl + "Search/checkmandetaoryfieldsInsert";
    var headers = new HttpHeaders();
    headers.append("Accept", "application/json");
    return new Promise(resolve => {
      return this.http.post(search_product, JSON.stringify(para), { headers: headers }).subscribe(data => {
          resolve(data);
      }, err => {
        console.log(err);
      });
    });
  }

  getContact(para) {
    const search_product = this.mainUrl + "search/getcontactdetailssellers";
    var headers = new HttpHeaders();
    headers.append("Accept", "application/json");
    return new Promise(resolve => {
      return this.http.post(search_product, JSON.stringify(para), { headers: headers }).subscribe(data => {
          resolve(data);
      }, err => {
        console.log(err);
      });
    });
  }

  loadHomePage() {
    let para = {
      "requestFrom":"App"
    }
    const search_product =  this.mainUrl + "/Dashboard/getUserDashboard";
    var headers = new HttpHeaders();
    headers.append("Accept", "application/json");
    return new Promise(resolve => {
      return this.http.post(search_product, JSON.stringify(para), { headers: headers }).subscribe(data => {
          resolve(data);
      }, err => {
        console.log(err);
      });
    });
  }


  selectedFilterStringCal(val){
    var setFil = "";
    var count = 0;
    val.forEach((element, index) => {
       
      if (count != 0) {
        if (count < 2) {
          if(element.length > 10){ 
            setFil += ", " + element.substring(0,10) + "...";
          }else{
            setFil += ", " + element;
          }
         }
        } else {
          
          if(element.length > 10){ 
            setFil +=  element.substring(0,10) + "...";
          }else{
            setFil +=  element;
          }
            
          
        }
        count++;
      
    });
    if (setFil != "") {
      if (count > 2) { return setFil + " & " + (count-2)+ " more"; }
      else{ return  setFil; }
    }
    else { return ""; }
  }
}
