<template>
  <div class="row row-cols-1 row-cols-md-2 g-3">
    <div class="col">
      <div class="card">
        <div
          class="card-header bg-white bg-opacity-10"
          @click="showcardbody[0] = !showcardbody[0]"
          :class="{ 'remove-border-bottom-for-card': !showcardbody[0] }"
        >
          About token
        </div>
        <ul class="list-group list-group-flush">
          <li class="list-group-item" v-if="showcardbody[0]">
            Token is use for the api to get SEA In Game
            <br />
            <span class="text-danger">* not sure will get baned or not</span>
          </li>
          <li
            class="list-group-item bg-white bg-opacity-10"
            v-if="showcardbody[0]"
          >
            Tutorial to get the file to import accounts (Method 2)
          </li>
          <li class="list-group-item" v-if="showcardbody[0]">
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
            <span class="text-danger">
              * The bookmark will only get the accounts that connected before.
            </span>
          </li>
        </ul>
      </div>
    </div>
    <div class="col">
      <div class="card">
        <div
          class="card-header bg-white bg-opacity-10"
          @click="showcardbody[1] = !showcardbody[1]"
          :class="{ 'remove-border-bottom-for-card': !showcardbody[1] }"
        >
          Method 1 - Add Address (no token)<br />
          <span class="text-danger"
            >* cant get game sea amount with this method</span
          >
        </div>
        <div class="card-body" v-show="showcardbody[1]">
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
      <div class="card">
        <div
          class="card-header bg-white bg-opacity-10"
          @click="showcardbody[2] = !showcardbody[2]"
          :class="{ 'remove-border-bottom-for-card': !showcardbody[2] }"
        >
          Method 2 - Import Address (has token)
        </div>
        <div class="card-body" v-show="showcardbody[2]">
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
        <div
          class="card-header bg-white bg-opacity-10"
          @click="showcardbody[3] = !showcardbody[3]"
          :class="{ 'remove-border-bottom-for-card': !showcardbody[3] }"
        >
          Accounts List
        </div>
        <div class="card-body" v-show="showcardbody[3]">
          <div class="list-group">
            <div
              class="list-group-item"
              v-for="(sa, index) in savedAddress"
              :key="sa.address"
            >
              <div class="account-header d-flex justify-content-between">
                <div class="account-name" v-show="editName[index]">
                  {{ sa.name }}
                  <i
                    class="fa-solid fa-pen-to-square fa-fw"
                    @click="(editName[index] = false), focusEditName(index)"
                  ></i>
                </div>
                <div class="account-name-edit" v-show="!editName[index]">
                  <input
                    type="text"
                    :value="editNameText[index]"
                    @blur="
                      (event) => {
                        (editName[index] = true),
                          updateName(index, event.target.value);
                      }
                    "
                    @keyup.enter="
                      (event) => {
                        (editName[index] = true),
                          (editNameText[index] = event.target.value);
                      }
                    "
                    ref="editName"
                  />
                </div>
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
                    @click="removeAddress(sa.address, sa.name)"
                  >
                    <i class="fa-solid fa-xmark fa-fw"></i>
                  </div>
                </div>
              </div>
              <div class="account-body">
                <div class="account-address">
                  <span class="spanaddr"
                    ><a
                      :href="`https://bscscan.com/address/${sa.address}`"
                      target="_blank"
                      >{{ sa.address }}</a
                    ></span
                  >
                </div>
                <div class="account-jwt-info d-flex justify-content-between">
                  <div>{{ checkSAToken(sa) }}</div>
                  <div
                    v-if="sa.authorization !== undefined"
                    class="text-decoration-underline"
                    @click="removeToken(index, sa)"
                  >
                    Remove Token
                  </div>
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
      showcardbody: [true, true, true, true],
      editName: [],
      editNameText: [],
    };
  },
  computed: {
    savedAddress() {
      return this.$store.getters.savedAddressDecode;
    },
  },
  mounted() {
    this.loadEditName(this.savedAddress);
  },
  watch: {
    savedAddress(data) {
      this.loadEditName(data);
    },
  },
  methods: {
    focusEditName(index) {
      setTimeout(() => {
        this.$refs.editName[index].focus();
      }, 100);
    },
    loadEditName(data) {
      this.editName = [];
      this.editNameText = [];
      for (let i = 0; i < data.length; i++) {
        this.editName.push(true);
        this.editNameText.push(data[i].name);
      }
    },
    updateName(index, name) {
      let data = this.savedAddress[index];
      if (data.name != name) {
        data.name = name;
        this.$store.commit("updateSA", {
          index: index,
          data: data,
        });
        this.editNameText[index] = name;
      }
    },
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
    removeAddress(address, name) {
      if (
        confirm(
          `Are you sure you want to delete this account.\nName:     ${name}\nAddress: ${address}`
        )
      ) {
        this.$store.commit("removeSA", address);
      }
    },
    removeToken(index, sa) {
      if (
        confirm(
          `Are you sure you want to remove token from this account.\nName:     ${sa.name}\nAddress: ${sa.address}`
        )
      ) {
        this.$store.commit("updateSA", {
          index: index,
          data: {
            address: sa.address,
            name: sa.name,
          },
        });
      }
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
    checkSAToken(sa) {
      if (sa.authorization == undefined) return "No token setup.";
      let exp = sa.exp * 1000;
      if (Date.now() >= exp) return "Token expired.";
      else return `Token will expire ${moment(exp).fromNow()}.`;
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
  padding: 3rem 0;
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
#upload-container > p {
  max-width: 80%;
  text-align: center;
}
input[type="file"] {
  display: none;
}
</style>