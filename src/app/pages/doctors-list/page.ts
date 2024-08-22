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

export interface IDynamicFormControl {
  id: string;
  type: "number" | "text" | "select" | "multiSelect" | "hidden";
  required: boolean;
  label: string;
  name: string;
  min?: number;
  max?: number;
  options?: { id: string; name: string }[];
  placeholder: string;
}

@Component({
  selector: "page-doctors-list",
  templateUrl: "page.html",
  styleUrls: ["./page.scss"],
})
export class Page {
  pageConfig: {
    pageTitle: string;
    formAddTitle: string;
    collection: string;
    loadingDeleteMessage: string;
    deletedMessage: string;
    successIcon: string;
    successColor: string;
    toastDuration: number;
    toastPosition: "bottom" | "top" | "middle";
    loadingAddMessage: string;
    loadingUpdateMessage: string;
    addedMessage: string;
    updatedMessage: string;
    deleteConfirmationHeader: string;
    deleteConfirmationMessage: string;
    formControls: IDynamicFormControl[];
    formDefaultValues: any;
  } = {
    formControls: [
      {
        id: "id",
        type: "hidden",
        required: true,
        label: "",
        name: "id",
        placeholder: "",
      },
      {
        id: "name",
        type: "text",
        required: true,
        label: "Doctor Name",
        name: "name",
        placeholder: "Enter Doctor Name",
      },
      {
        id: "gender",
        type: "select",
        required: true,
        label: "Doctor Gender",
        name: "gender",
        placeholder: "Select Doctor Gender",
        options: [
          { id: "Male", name: "Male" },
          { id: "Female", name: "Female" },
        ],
      },
      {
        id: "specialize",
        type: "select",
        required: true,
        label: "Doctor Specialization",
        name: "specialize",
        placeholder: "Select Doctor Specialization",
        options: [
          { id: "Gynecologist", name: "Gynecologist" },
          { id: "Cardiologist", name: "Cardiologist" },
          { id: "Nephrologist", name: "Nephrologist" },
          { id: "Ophthalmologist", name: "Ophthalmologist" },
          { id: "Dentist", name: "Dentist" },
        ],
      },
    ],
    formDefaultValues: {
      id: new Date().getTime().toString(),
      name: "",
      gender: "",
      specialize: "",
    },
    formAddTitle: "Add New Doctor",
    pageTitle: "Doctors",
    collection: "doctors",
    deleteConfirmationHeader: "Delete Confirmation",
    deleteConfirmationMessage: "Are you sure! Do you want to delete Doctor?",
    loadingDeleteMessage: "Please wait Deleting Doctor",
    deletedMessage: "Doctor Deleted Successfully",
    successIcon: "thumbs-up",
    successColor: "success",
    toastDuration: 1500,
    toastPosition: "bottom",
    loadingAddMessage: "Please wait Adding Doctor",
    loadingUpdateMessage: "Please wait Updating Doctor",
    addedMessage: "Doctor Added Successfully",
    updatedMessage: "Doctor Updated Successfully",
  };

  firestore: AngularFirestore = inject(AngularFirestore);
  collection = this.firestore.collection(this.pageConfig.collection);
  items$ = this.collection.valueChanges({ idField: "id" });
  isModalOpen = true;
  isEdit = false;

  setOpen(isOpen: boolean) {
    this.isModalOpen = isOpen;
  }

  constructor(
    private toastController: ToastController,
    private alertController: AlertController,
    private loadingCtrl: LoadingController
  ) {}

  async deleteItem(item: IDoctor, itemOptions: IonItemSliding) {
    const alert = await this.alertController.create({
      header: this.pageConfig.deleteConfirmationHeader,
      message: this.pageConfig.deleteConfirmationMessage,
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
          text: "Ok",
          role: "confirm",
          handler: async () => {
            const loading = await this.loadingCtrl.create({
              message: this.pageConfig.loadingDeleteMessage,
            });
            await loading.present();
            const itemId = item.id;
            await this.collection.doc(itemId).delete();
            await itemOptions.close();
            const toast = await this.toastController.create({
              message: this.pageConfig.deletedMessage,
              swipeGesture: "vertical",
              icon: this.pageConfig.successIcon,
              color: this.pageConfig.successColor,
              duration: this.pageConfig.toastDuration,
              position: this.pageConfig.toastPosition,
            });
            await toast.present();
            await loading.dismiss();
          },
        },
      ],
    });
    await alert.present();
  }

  editItem(item: IDoctor, itemOptions: IonItemSliding) {
    this.pageConfig.formDefaultValues = item;
    this.isEdit = true;
    this.isModalOpen = true;
    itemOptions.close();
  }

  async addItem(itemForm: NgForm) {
    const loadingMessage = this.isEdit
      ? this.pageConfig.loadingUpdateMessage
      : this.pageConfig.loadingAddMessage;
    const loading = await this.loadingCtrl.create({ message: loadingMessage });
    await loading.present();
    if (this.isEdit) {
      const itemId = itemForm.value.id;
      delete itemForm.value.id;
      await this.collection.doc(itemId).update(itemForm.value);
    } else {
      delete itemForm.value.id;
      await this.collection.add(itemForm.value);
    }
    this.setOpen(false);
    const toastMessage = this.isEdit
      ? this.pageConfig.updatedMessage
      : this.pageConfig.addedMessage;
    const toast = await this.toastController.create({
      message: toastMessage,
      swipeGesture: "vertical",
      icon: this.pageConfig.successIcon,
      color: this.pageConfig.successColor,
      duration: this.pageConfig.toastDuration,
      position: this.pageConfig.toastPosition,
    });
    await toast.present();
    await loading.dismiss();
    this.isEdit = false;
    this.pageConfig.formDefaultValues = {
      id: new Date().getTime().toString(),
      name: "",
      gender: "",
      specialize: "",
    };
    itemForm.resetForm(this.pageConfig.formDefaultValues);
  }
}
