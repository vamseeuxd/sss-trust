import { Component } from "@angular/core";
import { ConferenceData } from "../../providers/conference-data";
import {
  AlertController,
  IonItemOptions,
  IonItemSliding,
  ToastController,
} from "@ionic/angular";
import { NgForm } from "@angular/forms";

export interface IDoctor {
  id: string;
  name: string;
  gender: string;
  specialize: string;
  icon: string;
}

@Component({
  selector: "page-doctors-list",
  templateUrl: "doctors-list.html",
  styleUrls: ["./doctors-list.scss"],
})
export class DoctorsListPage {
  isModalOpen = false;
  isEdit = false;
  defaultFormValue: IDoctor = {
    id: new Date().getTime().toString(),
    name: "",
    gender: "",
    specialize: "",
    icon: "",
  };

  setOpen(isOpen: boolean) {
    this.isModalOpen = isOpen;
  }
  doctors: IDoctor[] = [
    {
      icon: "heart",
      id: "test1",
      name: "Vamsee Kalyan",
      gender: "Male",
      specialize: "Cardiologist",
    },
    {
      icon: "eye",
      id: "test2",
      name: "Vamsee Kalyan",
      gender: "Male",
      specialize: "Ophthalmologist",
    },
    {
      icon: "analytics",
      id: "test3",
      name: "Krishna Sukanya",
      gender: "Female",
      specialize: "Nephrologist",
    },
    {
      icon: "walk",
      id: "test4",
      name: "Krishna Sukanya",
      gender: "Female",
      specialize: "Gynecologist",
    },
  ];

  constructor(
    private toastController: ToastController,
    private alertController: AlertController
  ) {}

  async deleteDoctor(item: IDoctor, itemOptions: IonItemSliding) {
    const alert = await this.alertController.create({
      header: "Delete Confirmation",
      message: "Are you sure! Do you want to delete Doctor?",
      buttons: [
        {
          text: "Cancel",
          role: "cancel",
          handler: async () => {
            console.log("Alert canceled");
            await itemOptions.close();
          },
        },
        {
          text: "OK",
          role: "confirm",
          handler: async () => {
            this.doctors = this.doctors.filter((d) => d.id != item.id);
            await itemOptions.close();
            const toast = await this.toastController.create({
              message: "Doctor Deleted Successfully",
              swipeGesture: "vertical",
              icon: "thumbs-up",
              color: "success",
              duration: 1500,
              position: "bottom",
            });
            await toast.present();
          },
        },
      ],
    });

    await alert.present();
  }

  editDoctor(item: IDoctor, itemOptions: IonItemSliding) {
    this.defaultFormValue = item;
    this.isEdit = true;
    this.isModalOpen = true;
    itemOptions.close();
  }

  async addDoctor(doctor: NgForm) {
    if (this.isEdit) {
      this.doctors = this.doctors.map((d) => {
        return d.id === doctor.value.id ? doctor.value : d;
      });
    } else {
      this.doctors.push(doctor.value);
    }
    this.setOpen(false);
    const toast = await this.toastController.create({
      message: this.isEdit
        ? "Doctor Updated Successfully"
        : "Doctor Added Successfully",
      swipeGesture: "vertical",
      icon: "thumbs-up",
      color: "success",
      duration: 1500,
      position: "bottom",
    });
    await toast.present();
    this.isEdit = false;
    this.defaultFormValue = {
      id: new Date().getTime().toString(),
      name: "",
      gender: "",
      specialize: "",
      icon: "",
    };
    doctor.resetForm(this.defaultFormValue);
  }
}
