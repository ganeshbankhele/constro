import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController } from 'ionic-angular';

@IonicPage()
@Component({
  selector: 'page-state-code',
  templateUrl: 'state-code.html',
})
export class StateCodePage {
  data;
  states: any = [];
  filteredStates:any =[];
  keyword:string = "";
  constructor(public navCtrl: NavController,
    public viewCtrl: ViewController,
    public navParams: NavParams) {
    this.states = navParams.get('data');
    this.filteredStates = this.filterItems();
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad StateCodePage');
  }

  updateList(ev) {
    this.keyword = ev.target.value;
    this.filteredStates = this.filterItems();
  }

  filterItems(){
    return this.states.filter((item) => {
        return item.stateName.toLowerCase().indexOf(this.keyword.toLowerCase()) > -1;
    });    
  }

  dismiss() {
    this.viewCtrl.dismiss(null);
  }
  
  slected(data) {
    this.data = data;
    this.viewCtrl.dismiss(this.data);
  }
}
