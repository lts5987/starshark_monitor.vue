<template>
  <nav class="navbar navbar-expand-lg navbar-dark bg-black" ref="navbar">
    <div class="container-fluid">
      <router-link :to="{ name: 'accounts' }" class="navbar-brand">
        StarSharks Monitor
      </router-link>
      <button
        class="navbar-toggler"
        type="button"
        data-bs-toggle="collapse"
        data-bs-target="#navbarSupportedContent"
        aria-controls="navbarSupportedContent"
        aria-expanded="false"
        aria-label="Toggle navigation"
      >
        <span class="navbar-toggler-icon"></span>
      </button>
      <div class="collapse navbar-collapse" id="navbarSupportedContent">
        <ul class="navbar-nav me-auto mb-2 mb-lg-0">
          <li class="nav-item">
            <router-link
              :to="{ name: 'accounts' }"
              class="nav-link"
              :class="{ active: $route.name == 'accounts' }"
              >Accounts</router-link
            >
          </li>
          <li class="nav-item">
            <router-link
              :to="{ name: 'monitor' }"
              class="nav-link"
              :class="{ active: $route.name == 'monitor' }"
              >Monitor</router-link
            >
          </li>
        </ul>
      </div>
    </div>
  </nav>
  <div
    class="container-fluid pt-3 pb-3"
    style="min-height: calc(100vh - 112px)"
  >
    <router-view />
  </div>
  <footer class="text-white bg-black">
    <div class="container-fluid d-flex pt-3 pb-3 justify-content-between">
      <div>StarSharks Monitor @ 2022</div>
      <div>v{{ $store.getters.appVersion }}</div>
    </div>
  </footer>
</template>
<script>
export default {
  data() {
    return {};
  },
  mounted() {
    this.$store.commit("initSA");
    document.body.classList.add("bg-dark");
  },
  // watch: {
  //   $route(to) {
  //     document.title = `${to.meta.title} | StarSharks Monitor`;
  //   },
  // },
};
</script>
<style>
:root {
  --bs-blue: #0d6efd;
  --bs-indigo: #6610f2;
  --bs-purple: #6f42c1;
  --bs-pink: #d63384;
  --bs-red: #dc3545;
  --bs-orange: #fd7e14;
  --bs-yellow: #ffc107;
  --bs-green: #198754;
  --bs-teal: #20c997;
  --bs-cyan: #0dcaf0;
  --bs-white: #fff;
  --bs-gray: #6c757d;
  --bs-gray-dark: #343a40;
  --bs-gray-100: #f8f9fa;
  --bs-gray-200: #e9ecef;
  --bs-gray-300: #dee2e6;
  --bs-gray-400: #ced4da;
  --bs-gray-500: #adb5bd;
  --bs-gray-600: #6c757d;
  --bs-gray-700: #495057;
  --bs-gray-800: #343a40;
  --bs-gray-900: #212529;
  --bs-primary: #0d6efd;
  --bs-secondary: #6c757d;
  --bs-success: #198754;
  --bs-info: #0dcaf0;
  --bs-warning: #ffc107;
  --bs-danger: #dc3545;
  --bs-light: #f8f9fa;
  --bs-dark: #212529;
  --bs-primary-rgb: 13, 110, 253;
  --bs-secondary-rgb: 108, 117, 125;
  --bs-success-rgb: 25, 135, 84;
  --bs-info-rgb: 13, 202, 240;
  --bs-warning-rgb: 255, 193, 7;
  --bs-danger-rgb: 220, 53, 69;
  --bs-light-rgb: 248, 249, 250;
  --bs-dark-rgb: 33, 37, 41;
  --bs-white-rgb: 255, 255, 255;
  --bs-black-rgb: 0, 0, 0;
  --bs-body-color-rgb: 33, 37, 41;
  --bs-body-bg-rgb: 255, 255, 255;
  --bs-font-sans-serif: system-ui, -apple-system, "Segoe UI", Roboto,
    "Helvetica Neue", Arial, "Noto Sans", "Liberation Sans", sans-serif,
    "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol", "Noto Color Emoji";
  --bs-font-monospace: SFMono-Regular, Menlo, Monaco, Consolas,
    "Liberation Mono", "Courier New", monospace;
  --bs-gradient: linear-gradient(
    180deg,
    rgba(255, 255, 255, 0.15),
    rgba(255, 255, 255, 0)
  );
  --bs-body-font-family: var(--bs-font-monospace);
  --bs-body-font-size: 1rem;
  --bs-body-font-weight: 400;
  --bs-body-line-height: 1.5;
  --bs-body-color: #212529;
  --bs-body-bg: #fff;
}
body {
  -webkit-touch-callout: none; /* iOS Safari */
  -webkit-user-select: none; /* Safari */
  -khtml-user-select: none; /* Konqueror HTML */
  -moz-user-select: none; /* Old versions of Firefox */
  -ms-user-select: none; /* Internet Explorer/Edge */
  user-select: none; /* Non-prefixed version, currently supported by Chrome, Edge, Opera and Firefox */
}
.bg-dark .card {
  background-color: rgba(var(--bs-dark-rgb), var(--bs-bg-opacity));
  border-color: var(--bs-white);
  color: var(--bs-white);
}
.bg-dark .card .card-header {
  background-color: var(--bs-dark);
  border-color: var(--bs-white);
}
.bg-dark .list-group .list-group-item {
  background-color: rgba(var(--bs-dark-rgb), var(--bs-bg-opacity));
  color: var(--bs-white);
  border-color: var(--bs-white);
}
.spanaddr {
  text-overflow: ellipsis;
  white-space: nowrap;
  width: 100%;
  overflow: hidden;
  display: inline-block;
  font-size: 0.8em;
}
.alert {
  transition: height 0.3s, padding 0.3s, opacity 0.3s, margin 0.3s;
}
.alert.hide {
  opacity: 0;
  height: 0;
  padding: 0;
  margin-top: 0 !important;
}
.remove-border-bottom-for-card {
  border-radius: 0.25rem;
  border-bottom: 0;
}
</style>
