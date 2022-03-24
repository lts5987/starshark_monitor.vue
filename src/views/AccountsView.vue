<template>
  <div class="container-fluid">
    <div class="row pb-3">
      <div class="col-lg-6">
        <div class="card mb-3">
          <div class="card-header">
            Tutorial to get the file to import accounts
          </div>
          <div class="card-body">
            <ul style="list-style-type: decimal">
              <li>
                Drag the button at below to bookmark bar.<br />
                <a :href="link" class="btn btn-secondary"
                  >Fetch Account From StarShark</a
                >
              </li>
              <li>
                Use the bookmark added at 1st step on starshark official home
                page.
              </li>
            </ul>
            <span class="text-danger"
              >* The bookmark will only get the accounts that connected
              before.</span
            >
          </div>
        </div>
      </div>
      <div class="col-lg-6">
        <div class="card mb-3">
          <div class="card-header">
            Method 1 (add address)<br />
            <span class="text-danger"
              >* cant get game sea amount with this method</span
            >
          </div>
          <div class="card-body">
            <div class="mb-3">
              <label for="address" class="form-label">Account Address</label>
              <input
                type="text"
                class="form-control"
                :value="address"
                @input="(event) => (address = event.target.value)"
              />
            </div>
            <div class="mb-3">
              <label for="name" class="form-label">Account Name</label>
              <input
                type="text"
                class="form-control"
                :value="name"
                @input="(event) => (name = event.target.value)"
              />
            </div>
            <div class="d-grid gap-2\">
              <button
                type="button"
                class="btn btn-primary"
                @click="addAddress()"
              >
                Add Address
              </button>
            </div>
            <div
              class="alert mb-0 mt-3"
              role="alert"
              :class="{
                hide: addAlert == -1,
                'alert-warning': addAlert == 0,
                'alert-success': addAlert == 1,
              }"
            >
              {{ addAlertText }}
            </div>
          </div>
        </div>
      </div>
      <div class="col-lg-6">
        <div class="card mb-3">
          <div class="card-header">Method 2 (import address)</div>
          <div class="card-body">
            <div @dragover="dragoverFile" @drop="dropFile"></div>
            <label class="file">
              <input
                type="file"
                id="file"
                aria-label="File browser example"
                @change="inputFile"
                :value="file"
              />
              <span class="file-custom"></span>
            </label>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "AccountsView",
  data() {
    return {
      address: "",
      name: "",
      addAlert: -1,
      addAlertText: "",
      addTimeout: null,
      file: "",
      link: 'javascript:(t=>{var e=document.createElement("a");e.setAttribute("href","data:text/json;charset=utf-8,"+encodeURIComponent(t)),e.setAttribute("download","starshark_monitor_import_data"),e.style.display="none",document.body.appendChild(e),e.click(),document.body.removeChild(e)})(localStorage.SESSIONS);',
    };
  },
  mounted() {
    console.log(this.$store.state.savedAddress);
  },
  methods: {
    addAddress() {
      let SA = this.$store.state.savedAddress;
      if (
        this.StarShark.web3.utils.isAddress(this.address) &&
        SA.map((d) => d.address).indexOf(this.address) === -1
      ) {
        this.$store.commit("addSA", {
          address: this.address,
          name: this.name,
        });
        this.setAddAlert("Success add account");
        this.address = "";
        this.name = "";
      } else {
        if (!this.StarShark.web3.utils.isAddress(this.address)) {
          this.setAddAlert("Account format wrong", 0);
        } else if (SA.map((d) => d.address).indexOf(this.address) !== -1) {
          this.setAddAlert("Account exist", 0);
        }
      }
    },
    removeAddress(address) {
      this.$store.commit("removeSA", address);
      let newSavedAccounts = [];
      for (const key in this.savedAccounts) {
        if (this.savedAccounts[key].accData.address !== address) {
          newSavedAccounts.push(this.savedAccounts[key]);
        }
      }
      this.savedAccounts = newSavedAccounts;
    },
    setAddAlert(text, type = 1) {
      clearTimeout(this.addTimeout);
      this.addAlertText = text;
      this.addAlert = type;
      if (type == 1) {
        this.addTimeout = setTimeout(() => {
          this.addAlert = -1;
        }, 5000);
      }
    },
    loadImportFile(file) {
      const reader = new FileReader();
      reader.addEventListener("load", async (event) => {
        let data = event.target.result;
        data = JSON.parse(data);
        for (const key in data) {
          let index = this.$store.state.savedAddress
            .map((d) => d.address.toLowerCase())
            .indexOf(key.toLowerCase());
          if (
            index == -1 ||
            this.$store.state.savedAddress[index].authorization == undefined
          ) {
            let accData = await this.StarShark.getBaseAccData(
              data[key].authorization
            );
            accData = accData.data.data;
            if (index == -1) {
              this.$store.commit("addSA", {
                address: accData.account,
                name: accData.name,
                authorization: data[key].authorization,
                qr_code: data[key].qr_code,
              });
            } else {
              this.$store.commit("updateSA", {
                index: index,
                data: {
                  address: accData.account,
                  name: accData.name,
                  authorization: data[key].authorization,
                  qr_code: data[key].qr_code,
                },
              });
            }
          }
        }
      });
      try {
        reader.readAsText(file);
      } catch (error) {
        console.error(error);
      }
    },
    inputFile(event) {
      console.log(event.target.files);
      if (event.target.files.length > 0) {
        this.loadImportFile(event.target.files[0]);
        event.target.value = "";
      }
    },
    dragoverFile(event) {
      event.stopPropagation();
      event.preventDefault();
      event.dataTransfer.dropEffect = "copy";
    },
    dropFile(event) {
      event.stopPropagation();
      event.preventDefault();
      this.loadImportFile(event.dataTransfer.files[0]);
    },
  },
};
</script>

<style>
.file {
  position: relative;
  display: inline-block;
  cursor: pointer;
  height: 2.5rem;
  width: 100%;
}
.file input {
  min-width: 14rem;
  margin: 0;
  filter: alpha(opacity=0);
  opacity: 0;
}
.file-custom {
  position: absolute;
  top: 0;
  right: 0;
  left: 0;
  z-index: 5;
  height: 2.5rem;
  padding: 0.5rem 1rem;
  line-height: 1.5;
  color: #555;
  background-color: #fff;
  border: 0.075rem solid #ddd;
  border-radius: 0.25rem;
  box-shadow: inset 0 0.2rem 0.4rem rgba(0, 0, 0, 0.05);
  -webkit-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
  user-select: none;
}
.file-custom:after {
  content: "Choose file...";
}
.file-custom:before {
  position: absolute;
  top: -0.075rem;
  right: -0.075rem;
  bottom: -0.075rem;
  z-index: 6;
  display: block;
  content: "Browse";
  height: 2.5rem;
  padding: 0.5rem 1rem;
  line-height: 1.5;
  color: #555;
  background-color: #eee;
  border: 0.075rem solid #ddd;
  border-radius: 0 0.25rem 0.25rem 0;
}

/* Focus */
.file input:focus ~ .file-custom {
  box-shadow: 0 0 0 0.075rem #fff, 0 0 0 0.2rem #0074d9;
}
</style>