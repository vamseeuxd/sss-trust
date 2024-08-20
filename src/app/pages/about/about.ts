import { Component } from "@angular/core";

@Component({
  selector: "page-about",
  templateUrl: "about.html",
  styleUrls: ["./about.scss"],
})
export class AboutPage {
  location = "madison";
  conferenceDate = "2047-05-17";
  currrentImage = 0;

  selectOptions = {
    header: "Select a Location",
  };

  constructor() {
    setInterval(() => {
      this.nextImage();
    }, 5000);
  }

  nextImage() {
    this.currrentImage = this.currrentImage + 1;
    if (this.currrentImage > 3) {
      this.currrentImage = 0;
    }
  }
}
