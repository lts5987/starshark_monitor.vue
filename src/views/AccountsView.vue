<template>
  <div class="row row-cols-1 row-cols-md-2 g-3">
    <div class="col">
      <div class="card" :class="{ 'hide-body': !showcardbody[0] }">
        <div class="card-header" @click="showcardbody[0] = !showcardbody[0]">
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
    <div class="col">
      <div class="card" :class="{ 'hide-body': !showcardbody[1] }">
        <div class="card-header" @click="showcardbody[1] = !showcardbody[1]">
          Method 1 - Add Address (no token)<br />
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
            <button type="button" class="btn btn-primary" @click="addAddress()">
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
    <div class="col order-md-3">
      <div class="card" :class="{ 'hide-body': !showcardbody[2] }">
        <div class="card-header" @click="showcardbody[2] = !showcardbody[2]">
          Method 2 - Import Address (has token)
        </div>
        <div class="card-body">
          <div
            id="upload-container"
            @dragover="dragoverFile"
            @drop="dropFile"
            @click="$refs.iFile.click()"
          >
            <i class="fa-solid fa-cloud-upload"></i>
            <p aria-hidden="true" id="choose">
              <strong>Choose a the file that fetch from bookmark </strong>
            </p>
            <p aria-hidden="true">or drag and drop to import</p>
            <input type="file" @change="inputFile" :value="file" ref="iFile" />
          </div>
        </div>
      </div>
    </div>
    <div class="col order-md-2">
      <div class="card">
        <div class="card-header">Accounts List</div>
        <div class="card-body">
          <div class="list-group">
            <div
              class="list-group-item"
              v-for="(sa, index) in savedAddress"
              :key="sa.address"
            >
              <div class="account-header d-flex justify-content-between">
                <div class="account-name">{{ sa.name }}</div>
                <div class="account-button d-flex">
                  <div
                    class="move-up"
                    title="Move Up"
                    v-show="index != 0"
                    @click="moveUpAddress(sa.address)"
                  >
                    <i class="fa-solid fa-angles-up fa-fw"></i>
                  </div>
                  <div
                    class="move-down"
                    title="Move Down"
                    v-show="index != savedAddress.length - 1"
                    @click="moveDownAddress(sa.address)"
                  >
                    <i class="fa-solid fa-angles-down fa-fw"></i>
                  </div>
                  <div
                    class="remove"
                    title="Remove"
                    @click="removeAddress(sa.address)"
                  >
                    <i class="fa-solid fa-xmark fa-fw"></i>
                  </div>
                </div>
              </div>
              <div class="account-body">
                <div class="account-address">
                  <span class="spanaddr">{{ sa.address }}</span>
                </div>
                <div
                  class="account-jwt-info"
                  v-if="sa.authorization == undefined"
                >
                  No token setup.
                </div>
                <div class="account-jwt-info" v-else>
                  Token {{ checkSAExpired(sa) }}.
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import moment from "moment";
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
      showcardbody: [true, true, true],
    };
  },
  computed: {
    savedAddress() {
      return this.$store.getters.savedAddressDecode;
    },
  },
  mounted() {},
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
    },
    moveUpAddress(address) {
      this.$store.commit("moveUpSA", address);
    },
    moveDownAddress(address) {
      this.$store.commit("moveDownSA", address);
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
    checkSAExpired(sa) {
      let exp = sa.exp * 1000;
      if (Date.now() >= exp) return "expired";
      else return "will expire " + moment(exp).fromNow();
    },
  },
};
</script>

<style>
p {
  margin-top: 0;
  margin-bottom: 0.5rem;
}
.fa-cloud-upload {
  font-size: 3rem;
  margin-bottom: 0.5rem;
  color: #0066b9;
}
#upload-container {
  border: 2px solid #0066b9;
  border-radius: 18px;
  width: calc(100% - 40px);
  height: 330px;
  margin: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  cursor: pointer;
}
#upload-container:focus-within #choose {
  color: #fff;
  background-color: #012a4c;
}
#upload-container:focus-within {
  background-color: #eff6fb33;
}
#upload-container:hover {
  background-color: #eff6fb33;
}
#choose {
  color: #0066b9;
  padding: 0.22em;
  font-size: 1.125rem;
}
input[type="file"] {
  opacity: 0;
}
</style>