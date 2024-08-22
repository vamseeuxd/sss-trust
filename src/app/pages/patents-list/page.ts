import { Component, inject } from "@angular/core";
import {
  AlertController,
  IonItemSliding,
  LoadingController,
  ToastController,
} from "@ionic/angular";
import { NgForm } from "@angular/forms";
import { AngularFirestore } from "@angular/fire/compat/firestore";

export interface IPatent {
  id: string;
  name: string;
  gender: string;
  specialize: string;
}

@Component({
  selector: "page-patents-list",
  template: `
    <ion-header>
      <ion-toolbar>
        <ion-buttons slot="start">
          <ion-menu-button></ion-menu-button>
        </ion-buttons>
        <ion-title>{{ pageTitle }}</ion-title>
      </ion-toolbar>
    </ion-header>

    <ion-content [fullscreen]="isFullscreen">
      <ion-header collapse="condense">
        <ion-toolbar>
          <ion-title size="large">{{ pageTitle }}</ion-title>
        </ion-toolbar>
      </ion-header>

      <ion-list>
        <ng-container *ngFor="let Item of items$ | async">
          <ion-item-sliding
            #itemOptions
            [attr.track]="Item.specialize | lowercase"
          >
            <ion-item-options side="start">
              <ion-item-option (click)="editItem(Item, itemOptions)" expandable>
                {{ editButtonText }}
                <ion-icon
                  [style.fontSize.px]="iconSize"
                  slot="start"
                  name="link"
                ></ion-icon>
              </ion-item-option>
            </ion-item-options>

            <ion-item>
              <ion-label class="main-label">
                <h2>{{ controlNameLabel }}: {{ Item.name }}</h2>
                <p>
                  {{ controlGenderLabel }}:
                  <ion-icon
                    *ngIf="Item.gender === genderMale"
                    name="man"
                  ></ion-icon>
                  <ion-icon
                    *ngIf="Item.gender === genderFemale"
                    name="woman"
                  ></ion-icon>
                  {{ Item.gender }}
                </p>
                <p>{{ controlSpecializationLabel }}: {{ Item.specialize }}</p>
              </ion-label>
            </ion-item>

            <ion-item-options side="end">
              <ion-item-option
                color="danger"
                (ionSwipe)="deleteItem(Item, itemOptions)"
                expandable
                (click)="deleteItem(Item, itemOptions)"
              >
                {{ deleteButtonText }}
                <ion-icon
                  [style.fontSize.px]="iconSize"
                  slot="end"
                  name="trash"
                ></ion-icon>
              </ion-item-option>
            </ion-item-options>
          </ion-item-sliding>
        </ng-container>
      </ion-list>

      <ion-fab slot="fixed" vertical="bottom" horizontal="end">
        <ion-fab-button (click)="setOpen(true)">
          <ion-icon name="add"></ion-icon>
        </ion-fab-button>
      </ion-fab>

      <ion-modal
        [isOpen]="isModalOpen"
        (didDismiss)="isModalOpen = false"
        [initialBreakpoint]="modalInitialBreakpoint"
        [keepContentsMounted]="true"
        [breakpoints]="modalBreakpoints"
      >
        <ng-template>
          <ion-header>
            <ion-toolbar>
              <ion-title>{{ modalTitle }}</ion-title>
              <ion-buttons slot="end">
                <ion-button (click)="setOpen(false)">{{
                  closeButtonText
                }}</ion-button>
              </ion-buttons>
            </ion-toolbar>
          </ion-header>
          <ion-content class="ion-padding">
            <form #controlForm="ngForm">
              <input type="hidden" name="id" [ngModel]="defaultFormValue.id" />
              <ion-input
                class="mb-2"
                required
                [label]="controlNameLabel"
                name="name"
                [ngModel]="defaultFormValue.name"
                label-placement="floating"
                fill="outline"
                [placeholder]="controlNamePlaceholder"
              ></ion-input>
              <ion-select
                class="mb-2"
                required
                [label]="controlGenderLabel"
                label-placement="floating"
                fill="outline"
                name="gender"
                [ngModel]="defaultFormValue.gender"
              >
                <ion-select-option [value]="genderFemale">{{
                  genderFemale
                }}</ion-select-option>
                <ion-select-option [value]="genderMale">{{
                  genderMale
                }}</ion-select-option>
              </ion-select>
              <ion-select
                class="mb-2"
                required
                [label]="controlSpecializationLabel"
                name="specialize"
                [ngModel]="defaultFormValue.specialize"
                label-placement="floating"
                fill="outline"
              >
                <ion-select-option
                  *ngFor="let specialization of specializations"
                  [value]="specialization"
                  >{{ specialization }}</ion-select-option
                >
              </ion-select>
              <ion-button
                fill="solid"
                [disabled]="controlForm.invalid"
                (click)="addItem(controlForm)"
                class="mt-3"
                expand="full"
              >
                {{ saveButtonText }}
              </ion-button>
            </form>
          </ion-content>
        </ng-template>
      </ion-modal>
    </ion-content>
  `,
  styleUrls: ["./page.scss"],
})
export class Page {
  pageTitle = "Patents";
  editButtonText = "Edit";
  deleteButtonText = "Delete";
  saveButtonText = "Save";
  closeButtonText = "Close";
  modalTitle = "Add New Patent";
  isFullscreen = true;
  iconSize = 24;
  controlNameLabel = "Patent Name";
  controlGenderLabel = "Patent Gender";
  controlSpecializationLabel = "Patent Specialization";
  controlIconLabel = "Patent Icon";
  controlNamePlaceholder = "Enter Patent Name";
  controlIconPlaceholder = "Enter Patent Icon";
  genderMale = "Male";
  genderFemale = "Female";
  modalInitialBreakpoint = 0.75;
  modalBreakpoints = [0, 0.25, 0.5, 0.75];
  specializations = [
    "Gynecologist",
    "Cardiologist",
    "Nephrologist",
    "Ophthalmologist",
    "Dentist",
  ];

  private static readonly COLLECTION_NAME = "patents";
  private static readonly DELETE_CONFIRMATION_HEADER = "Delete Confirmation";
  private static readonly DELETE_CONFIRMATION_MESSAGE =
    "Are you sure! Do you want to delete Patent?";
  private static readonly CANCEL_BUTTON_TEXT = "Cancel";
  private static readonly CONFIRM_BUTTON_TEXT = "OK";
  private static readonly LOADING_DELETE_MESSAGE =
    "Please wait Deleting Patent";
  private static readonly DOCTOR_DELETED_MESSAGE =
    "Patent Deleted Successfully";
  private static readonly SUCCESS_ICON = "thumbs-up";
  private static readonly SUCCESS_COLOR = "success";
  private static readonly TOAST_DURATION = 1500;
  private static readonly TOAST_POSITION = "bottom";
  private static readonly LOADING_ADD_MESSAGE = "Please wait Adding Patent";
  private static readonly LOADING_UPDATE_MESSAGE =
    "Please wait Updating Patent";
  private static readonly DOCTOR_ADDED_MESSAGE = "Patent Added Successfully";
  private static readonly DOCTOR_UPDATED_MESSAGE =
    "Patent Updated Successfully";

  firestore: AngularFirestore = inject(AngularFirestore);
  itemsCollection = this.firestore.collection(Page.COLLECTION_NAME);
  items$ = this.itemsCollection.valueChanges({ idField: "id" });
  isModalOpen = false;
  isEdit = false;
  defaultFormValue: IPatent = {
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

  async deleteItem(patent: IPatent, itemOptions: IonItemSliding) {
    const alert = await this.alertController.create({
      header: Page.DELETE_CONFIRMATION_HEADER,
      message: Page.DELETE_CONFIRMATION_MESSAGE,
      buttons: [
        {
          text: Page.CANCEL_BUTTON_TEXT,
          role: "cancel",
          handler: async () => {
            console.log("Alert canceled");
            await itemOptions.close();
          },
        },
        {
          text: Page.CONFIRM_BUTTON_TEXT,
          role: "confirm",
          handler: async () => {
            const loading = await this.loadingCtrl.create({
              message: Page.LOADING_DELETE_MESSAGE,
            });
            await loading.present();
            const doctorId = patent.id;
            await this.itemsCollection.doc(doctorId).delete();
            await itemOptions.close();
            const toast = await this.toastController.create({
              message: Page.DOCTOR_DELETED_MESSAGE,
              swipeGesture: "vertical",
              icon: Page.SUCCESS_ICON,
              color: Page.SUCCESS_COLOR,
              duration: Page.TOAST_DURATION,
              position: Page.TOAST_POSITION,
            });
            await toast.present();
            await loading.dismiss();
          },
        },
      ],
    });
    await alert.present();
  }

  editItem(item: IPatent, itemOptions: IonItemSliding) {
    this.defaultFormValue = item;
    this.isEdit = true;
    this.isModalOpen = true;
    itemOptions.close();
  }

  async addItem(patent: NgForm) {
    const loadingMessage = this.isEdit
      ? Page.LOADING_UPDATE_MESSAGE
      : Page.LOADING_ADD_MESSAGE;
    const loading = await this.loadingCtrl.create({ message: loadingMessage });
    await loading.present();
    if (this.isEdit) {
      const doctorId = patent.value.id;
      delete patent.value.id;
      await this.itemsCollection.doc(doctorId).update(patent.value);
    } else {
      delete patent.value.id;
      await this.itemsCollection.add(patent.value);
    }
    this.setOpen(false);
    const toastMessage = this.isEdit
      ? Page.DOCTOR_UPDATED_MESSAGE
      : Page.DOCTOR_ADDED_MESSAGE;
    const toast = await this.toastController.create({
      message: toastMessage,
      swipeGesture: "vertical",
      icon: Page.SUCCESS_ICON,
      color: Page.SUCCESS_COLOR,
      duration: Page.TOAST_DURATION,
      position: Page.TOAST_POSITION,
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
    patent.resetForm(this.defaultFormValue);
  }
}
