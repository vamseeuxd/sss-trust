import { Component, inject } from "@angular/core";
import {
  AlertController,
  IonItemSliding,
  LoadingController,
  ToastController,
} from "@ionic/angular";
import { NgForm } from "@angular/forms";
import { AngularFirestore } from "@angular/fire/compat/firestore";

export interface IDoctor {
  id: string;
  name: string;
  gender: string;
  specialize: string;
}

@Component({
  selector: "page-doctors-list",
  templateUrl: "doctors-list.html",
  styleUrls: ["./doctors-list.scss"],
})
export class DoctorsListPage {
  pageTitle = "Doctors";
  editButtonText = "Edit";
  deleteButtonText = "Delete";
  saveButtonText = "Save";
  closeButtonText = "Close";
  modalTitle = "Add New Doctor";
  isFullscreen = true;
  iconSize = 24;
  doctorNameLabel = "Doctor Name";
  doctorGenderLabel = "Doctor Gender";
  doctorSpecializationLabel = "Doctor Specialization";
  doctorIconLabel = "Doctor Icon";
  doctorNamePlaceholder = "Enter Doctor Name";
  doctorIconPlaceholder = "Enter Doctor Icon";
  genderMale = "Male";
  genderFemale = "Female";
  modalInitialBreakpoint = 0.75;
  modalBreakpoints = [0, 0.25, 0.5, 0.75];
  specializations = [
    "Gynecologist",
    "Cardiologist",
    "Nephrologist",
    "Ophthalmologist",
    "Dentist"
  ];

  private static readonly DOCTORS_COLLECTION = "doctors";
  private static readonly DELETE_CONFIRMATION_HEADER = "Delete Confirmation";
  private static readonly DELETE_CONFIRMATION_MESSAGE = "Are you sure! Do you want to delete Doctor?";
  private static readonly CANCEL_BUTTON_TEXT = "Cancel";
  private static readonly CONFIRM_BUTTON_TEXT = "OK";
  private static readonly LOADING_DELETE_MESSAGE = "Please wait Deleting Doctor";
  private static readonly DOCTOR_DELETED_MESSAGE = "Doctor Deleted Successfully";
  private static readonly SUCCESS_ICON = "thumbs-up";
  private static readonly SUCCESS_COLOR = "success";
  private static readonly TOAST_DURATION = 1500;
  private static readonly TOAST_POSITION = "bottom";
  private static readonly LOADING_ADD_MESSAGE = "Please wait Adding Doctor";
  private static readonly LOADING_UPDATE_MESSAGE = "Please wait Updating Doctor";
  private static readonly DOCTOR_ADDED_MESSAGE = "Doctor Added Successfully";
  private static readonly DOCTOR_UPDATED_MESSAGE = "Doctor Updated Successfully";

  firestore: AngularFirestore = inject(AngularFirestore);
  doctorsCollection = this.firestore.collection(DoctorsListPage.DOCTORS_COLLECTION);
  doctors$ = this.doctorsCollection.valueChanges({ idField: "id" });
  isModalOpen = false;
  isEdit = false;
  defaultFormValue: IDoctor = {
    id: new Date().getTime().toString(),
    name: "",
    gender: "",
    specialize: "",
  };

  setOpen(isOpen: boolean) {
    this.isModalOpen = isOpen;
  }

  constructor(
    private toastController: ToastController,
    private alertController: AlertController,
    private loadingCtrl: LoadingController
  ) {}

  async deleteDoctor(doctor: IDoctor, itemOptions: IonItemSliding) {
    const alert = await this.alertController.create({
      header: DoctorsListPage.DELETE_CONFIRMATION_HEADER,
      message: DoctorsListPage.DELETE_CONFIRMATION_MESSAGE,
      buttons: [
        {
          text: DoctorsListPage.CANCEL_BUTTON_TEXT,
          role: "cancel",
          handler: async () => {
            console.log("Alert canceled");
            await itemOptions.close();
          },
        },
        {
          text: DoctorsListPage.CONFIRM_BUTTON_TEXT,
          role: "confirm",
          handler: async () => {
            const loading = await this.loadingCtrl.create({ message: DoctorsListPage.LOADING_DELETE_MESSAGE });
            await loading.present();
            const doctorId = doctor.id;
            await this.doctorsCollection.doc(doctorId).delete();
            await itemOptions.close();
            const toast = await this.toastController.create({
              message: DoctorsListPage.DOCTOR_DELETED_MESSAGE,
              swipeGesture: "vertical",
              icon: DoctorsListPage.SUCCESS_ICON,
              color: DoctorsListPage.SUCCESS_COLOR,
              duration: DoctorsListPage.TOAST_DURATION,
              position: DoctorsListPage.TOAST_POSITION,
            });
            await toast.present();
            await loading.dismiss();
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
    const loadingMessage = this.isEdit
      ? DoctorsListPage.LOADING_UPDATE_MESSAGE
      : DoctorsListPage.LOADING_ADD_MESSAGE;
    const loading = await this.loadingCtrl.create({ message: loadingMessage });
    await loading.present();
    if (this.isEdit) {
      const doctorId = doctor.value.id;
      delete doctor.value.id;
      await this.doctorsCollection.doc(doctorId).update(doctor.value);
    } else {
      delete doctor.value.id;
      await this.doctorsCollection.add(doctor.value);
    }
    this.setOpen(false);
    const toastMessage = this.isEdit
      ? DoctorsListPage.DOCTOR_UPDATED_MESSAGE
      : DoctorsListPage.DOCTOR_ADDED_MESSAGE;
    const toast = await this.toastController.create({
      message: toastMessage,
      swipeGesture: "vertical",
      icon: DoctorsListPage.SUCCESS_ICON,
      color: DoctorsListPage.SUCCESS_COLOR,
      duration: DoctorsListPage.TOAST_DURATION,
      position: DoctorsListPage.TOAST_POSITION,
    });
    await toast.present();
    await loading.dismiss();
    this.isEdit = false;
    this.defaultFormValue = {
      id: new Date().getTime().toString(),
      name: "",
      gender: "",
      specialize: "",
    };
    doctor.resetForm(this.defaultFormValue);
  }
}
