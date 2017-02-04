import { Component } from '@angular/core';

import { NavController } from 'ionic-angular';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  mode: string;

  scouter_name: string;

  team_number: number;
  team_alliance: boolean;
  match_number: number;

  auto_baseline: boolean;
  auto_gear: any;
  auto_high_fuel: number;
  auto_low_fuel: number;

  tele_gears: number;
  tele_high_fuel: number;
  tele_low_fuel: number;
  tele_climb: any;

  driver_rating: any;
  driver_defense_rating: any;

  comments: string;

  constructor(public navCtrl: NavController) {
    this.mode = "scouting";

    this.resetFields();
  }

  resetFields() {
    this.scouter_name = null;

    this.team_number = null;
    this.team_alliance = false;
    this.match_number = null;

    this.auto_gear = null;
    this.auto_baseline = false;
    this.auto_high_fuel = 0;
    this.auto_low_fuel = 0;

    this.tele_gears = 0;
    this.tele_high_fuel = 0;
    this.tele_low_fuel = 0;
    this.tele_climb = null;

    this.driver_rating = null;
    this.driver_defense_rating = null;
    this.comments = null;
  }

  addHighFuel() {
    this.auto_high_fuel++;
  }

  addLowFuel() {
    this.auto_low_fuel++;
  }

  removeHighFuel() {
    if (this.auto_high_fuel > 0) {
      this.auto_high_fuel--;
    }
  }

  removeLowFuel() {
    if (this.auto_low_fuel > 0) {
      this.auto_low_fuel--;
    }
  }

  addTeleGear() {
    this.tele_gears++;
  }

  removeTeleGear() {
    if (this.tele_gears > 0) {
      this.tele_gears--;
    }
  }

  addTeleHighFuel() {
    this.tele_high_fuel++;
  }

  addTeleLowFuel() {
    this.tele_low_fuel++;
  }

  removeTeleHighFuel() {
    if (this.tele_high_fuel > 0) {
      this.tele_high_fuel--;
    }
  }

  removeTeleLowFuel() {
    if (this.tele_low_fuel > 0) {
      this.tele_low_fuel--;
    }
  }

  submitForm() {
    console.log("CONGRATULATIONS YOU SUBMITTED A FORM IM SO PROUD OF YOU I HATE MY LIFE AND THIS PROGRAM");
    this.resetFields();
    setTimeout(() => {
      this.mode = "exporting";
    }, 100);
  }

}
