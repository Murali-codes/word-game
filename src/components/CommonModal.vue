<template>
    <div>
        <button
            ref="commanModalRef"
            id="modal-trigger-10"
            class="chi-button chi-modal__trigger"
            data-target="#modal-10"
        >
            Launch Common modal
        </button>
        <div class="chi-backdrop -closed -center " :class="modalBody==='customerServiceDetails'?'resize':modalBody==='needLOA'?'needLOAPopup': ''" >
            <div class="chi-backdrop__wrapper">
                <section
                    id="modal-10"
                    class="chi-modal -portal"
                    role="dialog"
                    aria-label="Modal description"
                    aria-modal="true"
                >
                    <header class="chi-modal__header">
                        <h2
                            class="chi-modal__title"
              :style="modalBody==='customerServiceDetails' ? 'margin-left: 7px !important;' : ''"
                        >
                            {{ modalTitle }}
                        </h2>
                        <button
                            v-if="showCloseIcon"
                            class="chi-button -icon -close"
                            @click="buttonClickInCommonModel('close')"
                            data-dismiss="modal"
                            aria-label="Close"
                        >
                            <div class="chi-button__content">
                                <i class="chi-icon icon-x"></i>
                            </div>
                        </button>
                    </header>
                    <div class="chi-modal__content">
                        <!-- <div
                            v-if="modalBody !== 'customerServiceDetails' && modalBody !== 'needLOA'"
                            v-html="modalBody"
                        ></div> -->
                        <div v-if="modalBody==='customerServiceDetails'">
                            <CustomerServiceGridView
                                :customerName="endCustomerName"
                                :customerNumber="endCustomerNumber"
                                :partnerAccount="endPartner"
                            ></CustomerServiceGridView>
                        </div>
                        <div v-else-if="modalBody==='needLOA'">
                            <LoaRequestForm
                                :customerName="customerName"
                                :customerNumber="customerNumber"
                                :validEmail="validEmail"
                                :errorMessage="errorMessage"
                                @emitEmail="emitEmail"
                            ></LoaRequestForm>
                        </div>
                        <div v-else v-html="modalBody"></div>
                    </div>
                    <footer class="chi-modal__footer align-btn-center">
                        <button v-show="displayOkBtn"
                        :class="okBtnCss"
                        @click="buttonClickInCommonModel('OK')">
                            OK
                        </button>
                        <button
                            v-show="displayButtonSubmit"
                            class="chi-button -primary"
                            @click="buttonClickInCommonModel('SUCCESS')"
                        >
                            SUCCESS
                        </button>
                        <button
                            v-show="displayButtonProceed"
                            class="chi-button -primary"
                            @click="buttonClickInCommonModel('PROCEED')"
                        >
                            PROCEED
                        </button>
                        <button
                            v-show="displayButtonConfirm"
                            class="chi-button -primary"
                            @click="buttonClickInCommonModel('CONFIRM')"
                        >
                            CONFIRM
                        </button>
                        <button
                            v-show="displayButtonCancel"
                            class="chi-button"
                            @click="buttonClickInCommonModel('CANCEL')"
                        >
                            CANCEL
                        </button>
                    </footer>
                </section>
            </div>
        </div>
    </div>
</template>
<script lang="ts">
import {
  Component, Emit, Prop, Vue,
} from 'vue-property-decorator';

const Api = {
  needLOARequest: (a, b, c) => Promise.resolve({
    status: 200, a, b, c,
  }),
};
const Http = { getInstance: () => { console.log('in function'); } };
const PARTNER_LOA_ERROR_MSG = 'some error messga';
/* eslint-disable class-methods-use-this */
@Component({
  components: {
    // CustomerServiceGridView: () =>
    //     import(
    //
    //     ),
    // LoaRequestForm: () =>
    // AttachErrorModal: () =>

  },
})
export default class CommonModal extends Vue {
    @Prop({ required: true }) commonModalConfigData;

    @Prop({ required: false }) customerName!: string;

    @Prop({ required: false }) customerNumber!: string;

    @Prop({ required: false }) partnerAccount!: string;

    private endPartner = '';

    private endCustomerName = '';

    private endCustomerNumber = '';

    private chiInstance = { modal: (a) => { console.log(a); } };

    private isValidConfigData = false;

    private userPassword!: string;

    private modalTitle = '';

    private modalBody = '';

    private showCloseIcon = true;

    private displayOkBtn = false;

    private okBtnCss = '';

    private displayButtonSubmit = false;

    private displayButtonProceed = false;

    private displayButtonConfirm = false;

    private displayButtonCancel = false;

    private customerEmails = '';

    private http = Http.getInstance();

    // added for Reuest LOA error handling
    private title = 'LOA Request';

    private body = '';

    showPdfErrModal = false;

    private validEmail = false;

    private errorMessage = '';

    private danger = true;

    private buttonConfigData = {
      showOkButton: false,
      showSubmitButton: false,
      showProceedButton: false,
      showCancelButton: false,
    };

    public $refs!: {
        commanModalRef: HTMLButtonElement;
    };

    // Need LOA error model
    // closePdfErrModalEmit(): void {
    //     this.showPdfErrModal = false;
    // }
    // closePdfErrModal(value: boolean): void {
    //     this.showPdfErrModal = value;
    // }
    mounted() {
      this.isValidConfigData = this.validateCommonModalConfigData();
      this.endPartner = this.partnerAccount;
      this.endCustomerName = this.customerName;
      this.endCustomerNumber = this.customerNumber;
      if (this.isValidConfigData) {
        this.chiInstance.modal(document.getElementById('modal-trigger-10'));
        // this.configureCommonModel();
        this.$refs.commanModalRef.style.visibility = 'hidden';
        this.$refs.commanModalRef.click();
      } else {
        this.enableCommonModel('No proper configuration received to display the Model');
      }
    }

    emitEmail(emails: string) {
      this.customerEmails = emails;
    }

    private configureCommonModel(): void {
      const commonModalObj = document.getElementById('modal-trigger-10');
      if (commonModalObj) {
        commonModalObj.style.visibility = 'hidden';
        commonModalObj.click();
      }
    }

    private validateCommonModalConfigData() {
      const buttonsObj = this.commonModalConfigData.buttons;
      this.modalTitle = this.commonModalConfigData.Title;
      this.modalBody = this.commonModalConfigData.bodyContent;
      this.showCloseIcon = !!this.commonModalConfigData.showCloseIcon;
      if (
        this.modalTitle === 'undefined'
            || this.modalTitle === ''
            || this.modalBody === 'undefined'
            || this.modalBody === ''
            || Object.keys(buttonsObj).length === 0
            || buttonsObj === 'undefined'
      ) {
        return false;
      }
      this.displayOkBtn = !!buttonsObj.showOkButton;
      this.displayButtonSubmit = !!buttonsObj.showSubmitButton;
      this.displayButtonProceed = !!buttonsObj.showProceedButton;
      this.displayButtonConfirm = !!buttonsObj.showConfirmButton;
      this.displayButtonCancel = !!buttonsObj.showCancelButton;

      this.okBtnCss = buttonsObj.okBtnCss ? buttonsObj.okBtnCss : 'chi-button -primary';
      return true;
    }

    @Emit('enableCommonModel_Event')
    private enableCommonModel(eventData) { console.log(eventData); }

    private buttonClickInCommonModel(buttonClicked) {
      if (buttonClicked === 'OK' && this.modalBody === 'needLOA') {
        let validEmail = true;
        const filteredEmails: string[] = [];
        if (this.customerEmails !== null && this.customerEmails !== undefined) {
          const pattern = /^\S+@\S+\.\S+$/;
          const customerEmailSarray: string[] = this.customerEmails.split(',');
          if (customerEmailSarray.length > 1) {
            for (let i = 0; i < customerEmailSarray.length; i += 1) {
              const email = customerEmailSarray[i].replace(/(\r\n|\n|\r)/gm, '').trim();
              filteredEmails.push(email);
              if (!email.match(pattern)) {
                validEmail = false;
                break;
              } else if (email.indexOf('@') !== email.lastIndexOf('@')) {
                validEmail = false;
                break;
              }
            }
          } else if (/\s/.test(this.customerEmails)) {
            validEmail = false;
          } else {
            if (!this.customerEmails.match(pattern)) {
              validEmail = false;
            } else if (this.customerEmails.indexOf('@') !== this.customerEmails.lastIndexOf('@')) {
              validEmail = false;
            }
            filteredEmails.push(this.customerEmails);
          }

          if (validEmail) {
            this.sendLOARequest(filteredEmails, buttonClicked);
          } else {
            this.validEmail = false;
            this.errorMessage = 'Please enter valid email address/es.';
          }
        } else {
          this.validEmail = false;
          this.errorMessage = 'Please enter valid email address/es.';
        }
      } else {
        this.enableCommonModel({ buttonClicked });
      }
    }

    sendLOARequest(emails: string[], buttonClicked) {
      const emailJsonObject = `{ "emailAddresses":["${emails}"]}`;
      Api.needLOARequest(this.partnerAccount, this.customerNumber, emailJsonObject)
        .then((response: {status:number}) => {
          if (response.status.toString() === '202') {
            this.body = `Your request has been submitted successfully for Customer number ${
              this.customerNumber
            } and you will get a confirmation email.`;
            this.danger = false;
          } else {
            this.body = `Error processing your LOA request for Customer number ${this.customerNumber}.`;
          }
        })
        .catch((error) => {
          console.log(error);
          this.body = PARTNER_LOA_ERROR_MSG;
        })
        .finally(() => {
          // this.closePdfErrModal(true);
          this.enableCommonModel({
            buttonClicked,
            title: this.title,
            body: this.body,
            modalBody: 'needLOA',
            danger: this.danger,
          });
        });
    }

    get showOkButton() {
      return this.buttonConfigData.showOkButton;
    }
}
</script>
