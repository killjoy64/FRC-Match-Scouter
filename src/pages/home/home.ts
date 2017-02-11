import {Component} from '@angular/core';
import {File, FileEntry, Metadata, Entry} from 'ionic-native';
import {AlertController, ToastController, Platform} from 'ionic-angular';

declare var cordova: any;

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  IS_BROWSER: boolean;

  mode: string;

  scouter_name: string;

  team_number: number;
  team_alliance: boolean;
  team_alliance_string: string;
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

  fs: string;
  p: string;

  scouting_files: any;

  constructor(private platform: Platform, private alertCtrl: AlertController, private toastCtrl: ToastController) {
    this.mode = "scouting";

    this.resetFields();

    if (typeof cordova == 'undefined') {
      this.IS_BROWSER = true;

      console.log("BROWSER DETECTED. NATIVE FEATURES DISABLED.");
    } else {
      this.IS_BROWSER = false;

      if (this.platform.is("android")) {
        this.fs = cordova.file.externalDataDirectory;
        this.p = "ANDROID";
      } else if (this.platform.is("ios")) {
        this.fs = cordova.file.documentsDirectory;
        this.p = "ANDROID";
      } else if (this.platform.is("windows")) {
        this.fs = cordova.file.dataDirectory;
        this.p = "WINDOWS";
      }

      console.log("MAPPED DIRECTORIES FOR " + this.p);
    }

    this.scouting_files = null;

  }

  ionViewWillEnter() {
    this.getScoutingForms();
  }

  resetFields() {
    this.scouter_name = null;

    this.team_number = null;
    this.team_alliance = false;
    this.team_alliance_string = "red";
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

    let msg = null;

    if (!this.scouter_name) {
      msg = "you must enter your name.";
      this.presentAlert("Missing Fields", "There are empty fields on the form, " + msg);
      return;
    }

    if (!this.team_number) {
      msg = "you must enter a team number.";
      this.presentAlert("Missing Fields", "There are empty fields on the form, " + msg);
      return;
    }

    if (!this.match_number) {
      msg = "you must enter a match number.";
      this.presentAlert("Missing Fields", "There are empty fields on the form, " + msg);
      return;
    }

    if (!this.auto_gear) {
      msg = "you must choose an option for the gear in autonomous. ";
      this.presentAlert("Missing Fields", "There are empty fields on the form, " + msg);
      return;
    }

    if (!this.tele_climb) {
      msg = "you must choose an option for climbing in teleop.";
      this.presentAlert("Missing Fields", "There are empty fields on the form, " + msg);
      return;
    }

    if (!this.driver_rating) {
      msg = "you must choose a driver rating. Remember to be honest!";
      this.presentAlert("Missing Fields", "There are empty fields on the form, " + msg);
      return;
    }

    if (!this.driver_defense_rating) {
      msg = "you must choose a driver defense rating.";
      this.presentAlert("Missing Fields", "There are empty fields on the form, " + msg);
      return;
    }

    this.exportForm().then((file_name) => {
      let toast = this.toastCtrl.create({
        message: 'Successfully exported scouting form ' + file_name,
        duration: 3000,
        showCloseButton: true
      });

      toast.present().then(() => {
        this.resetFields();
        this.mode = "exporting";
      });
    }).catch((err) => {
      console.log("Error exporting form. " + err.message + " " + err.code);
      this.resetFields();
      this.mode = "exporting";
    });

  }

  presentAlert(title, msg) {
    let alert = this.alertCtrl.create({
      title: title,
      message: msg,
      buttons: [
        {
          text: 'Dismiss',
          role: 'cancel',
          handler: () => {}
        }
      ]
    });
    alert.present();
  }

  getScoutingForms() {
    this.getFiles().then((entries:FileEntry[]) => {
      this.scouting_files = entries;
      for (let i = 0; i < entries.length; i++) {
        entries[i].getMetadata((metadata:Metadata) => {
          this.scouting_files[i].size = metadata.size;
          this.scouting_files[i].modificationTime = metadata.modificationTime;
          console.log(this.scouting_files[i]);
        }, (err) => {
          console.log(this.scouting_files[i] + " error getting metadata. " + err.message);
        });
      }
      console.log(this.scouting_files.length + " scouting forms found.");
    }).catch((err) => {
      console.log("Error getting scouting forms. " + err.message + " " + err.code);
    });
  }

  openForm(entry: Entry) {
    this.readFile(entry).then((data: string) => {
      let scouting_form = JSON.parse(data);
      
      console.log(scouting_form);
      
      this.scouter_name = scouting_form.general.name;

      this.team_number = scouting_form.general.team_number;
      this.team_alliance = scouting_form.general.team_alliance == "red" ? false : true;
      this.team_alliance_string = this.team_alliance ? "red" : "blue";
      this.match_number = scouting_form.general.match_number;

      this.auto_gear = scouting_form.autonomous.gear;
      this.auto_baseline = scouting_form.autonomous.baseline;
      this.auto_high_fuel = scouting_form.autonomous.high_fuel;
      this.auto_low_fuel = scouting_form.autonomous.low_fuel;

      this.tele_gears = scouting_form.teleop.gears;
      this.tele_high_fuel = scouting_form.teleop.high_fuel;
      this.tele_low_fuel = scouting_form.teleop.low_fuel;
      this.tele_climb = scouting_form.teleop.climb;

      this.driver_rating = scouting_form.driver_rating;
      this.driver_defense_rating = scouting_form.driver_defense_rating;
      this.comments = scouting_form.comments;

      let toast = this.toastCtrl.create({
        message: 'Successfully loaded scouting form ' + entry.name,
        duration: 3000,
        showCloseButton: true
      });

      toast.present().then(() => {
        this.mode = "scouting";
      });
      
    }).catch((err) => {
      console.log("Error reading scouting form. " + err.message + " " + err.code);
    });
  }

  exportForm() {

    if (this.team_alliance) {
      this.team_alliance_string = "blue";
    } else {
      this.team_alliance_string = "red";
    }

    let scouting_form = {
      general: {
        name: this.scouter_name,
        team_number: this.team_number,
        team_alliance: this.team_alliance_string,
        match_number: this.match_number
      },
      autonomous: {
        gear: this.auto_gear,
        baseline: this.auto_baseline,
        high_fuel: this.auto_high_fuel,
        low_fuel: this.auto_low_fuel
      },
      teleop: {
        gears: this.tele_gears,
        high_fuel: this.tele_high_fuel,
        low_fuel: this.tele_low_fuel,
        climb: this.tele_climb
      },
      driver_rating: this.driver_rating,
      driver_defense_rating: this.driver_defense_rating,
      comments: this.comments
    };

    console.log(scouting_form);

    if (!this.IS_BROWSER) {
      return new Promise((resolve, reject) => {
        File.writeFile(this.fs, this.match_number + "-" + this.team_number + ".json", JSON.stringify(scouting_form), {replace: true}).then((entry) => {
          console.log("Successfully created file " + entry.name);
          this.getScoutingForms();
          resolve(entry.name);
        }, (err) => {
          reject(err);
        });
      });
    } else {
      return new Promise((resolve, reject) => {
        reject({
          code: "APP_BROWSER_MODE_ON",
          message: "Could not write file. Browser detected. Native features have been disabled."
        });
      });
    }
  }

  readFile(entry: Entry) {
    if (!this.IS_BROWSER) {
      return new Promise((resolve, reject) => {
        File.readAsText(this.fs, entry.name).then((data) => {
          console.log("Successfully read text from " + entry.name);
          resolve(data);
        }).catch((err) => {
          reject(err);
        });
      });
    } else {
      return new Promise((resolve, reject) => {
        reject({
          code: "APP_BROWSER_MODE_ON",
          message: "Could not write file. Browser detected. Native features have been disabled."
        });
      });
    }
  }

  getFiles() {
    if (!this.IS_BROWSER) {
      return File.listDir(this.fs, "");
    } else {
      return new Promise((resolve, reject) => {
        setTimeout(() => {
          reject({
            code: "APP_CONFIG_BROWSER_MODE",
            message: "Could not list directory contents. Browser detected. Native features have been disabled."
          });
        }, 100);
      });
    }
  }

}
