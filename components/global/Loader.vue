<template>
  <div v-if="showLoader" class="loader-overlay">
    <span class="loader"></span>
  </div>
</template>

<script setup lang="ts">
const loaderStore = useLoader();
const showLoader = ref(false);

let timer: number | null = null;

watch(
  () => loaderStore.loader,
  (newVal: any) => {
    if (newVal) {
    } else {
      if (timer) {
        clearTimeout(timer);
        timer = null;
      }
      showLoader.value = false;
    }
  },
  { immediate: true }
);
</script>

<style scoped>
.loader-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 9999;
}

.loader {
  width: 10px;
  height: 10px;
  border-radius: 50%;
  display: block;
  margin: 15px auto;
  position: relative;
  color: #fff;
  left: -100px;
  box-sizing: border-box;
  animation: shadowRolling 2s linear infinite;
}

@keyframes shadowRolling {
  0% {
    box-shadow: 0px 0 rgba(255, 255, 255, 0), 0px 0 rgba(255, 255, 255, 0),
      0px 0 rgba(255, 255, 255, 0), 0px 0 rgba(255, 255, 255, 0);
  }
  12% {
    box-shadow: 100px 0 #c70d0d, 0px 0 rgba(255, 255, 255, 0),
      0px 0 rgba(255, 255, 255, 0), 0px 0 rgba(255, 255, 255, 0);
  }
  25% {
    box-shadow: 110px 0 #c70d0d, 100px 0 #c70d0d, 0px 0 rgba(255, 255, 255, 0),
      0px 0 rgba(255, 255, 255, 0);
  }
  36% {
    box-shadow: 120px 0 #c70d0d, 110px 0 #c70d0d, 100px 0 #c70d0d,
      0px 0 rgba(255, 255, 255, 0);
  }
  50% {
    box-shadow: 130px 0 #c70d0d, 120px 0 #c70d0d, 110px 0 #c70d0d, 100px 0 #c70d0d;
  }
  62% {
    box-shadow: 200px 0 rgba(255, 255, 255, 0), 130px 0 #c70d0d, 120px 0 #c70d0d,
      110px 0 #c70d0d;
  }
  75% {
    box-shadow: 200px 0 rgba(255, 255, 255, 0), 200px 0 rgba(255, 255, 255, 0),
      130px 0 #c70d0d, 120px 0 #c70d0d;
  }
  87% {
    box-shadow: 200px 0 rgba(255, 255, 255, 0), 200px 0 rgba(255, 255, 255, 0),
      200px 0 rgba(255, 255, 255, 0), 130px 0 #c70d0d;
  }
  100% {
    box-shadow: 200px 0 rgba(255, 255, 255, 0), 200px 0 rgba(255, 255, 255, 0),
      200px 0 rgba(255, 255, 255, 0), 200px 0 rgba(255, 255, 255, 0);
  }
}
</style>
