<template>
  <v-dialog
    @update:modelValue="emit('update:visible', $event)"
    v-model="dialog"
    max-width="500"
    persistent
  >
    <v-card class="dialog-card py-6 px-4">
      <div class="relative mb-4">
        <!-- Animación Lottie -->
        <div ref="animationContainer" class="lottie-box mx-auto" />

        <!-- Texto encima de la animación -->
        <div
          class="overlay-text absolute left-1/2 transform -translate-x-1/2 text-center"
        >
          <div v-if="result.winner" class="wave-text mb-2">
            <span v-for="(char, index) in 'Ganaste'" :key="index">{{ char }}</span>
          </div>
          <div v-else class="drop-text mb-2">Sigue intentándolo 😢</div>

          <!-- Datos -->
          <div v-if="result.winner">
            <div class="text-h6 mt-2">Recompensa: {{ result.profit }}$</div>
            <div class="text-subtitle-1">Nuevo saldo: {{ result.currentBalance }}$</div>
          </div>
          <div v-else>
            <div class="text-h6 mt-2">Apuesta: {{ result.betValue }}$</div>
            <div class="text-subtitle-1">Nuevo saldo: {{ result.currentBalance }}$</div>
          </div>
        </div>
      </div>

      <v-row class="justify-center pt-6 pb-6">
        <UiButton
          prependIcon="mdi-content-save-all"
          color="amber-lighten-2"
          text="Guardar apuesta"
          @click="saveResult"
        />
        <UiButton
          prependIcon="mdi-close-box"
          color="amber-lighten-2"
          @click="close(false)"
          text="Cerrar"
          class="ml-4"
        />
      </v-row>
    </v-card>
  </v-dialog>
</template>

<script setup lang="ts">
import type { AnimationItem } from "lottie-web";
import { nextTick, ref, watch, reactive } from "vue";
import { User } from "~/types";

const { $callNotification } = useNuxtApp();
const apiResult = useResult();

const userSave = reactive(User.create());

const props = defineProps({
  visible: { type: Boolean },
  result: { type: Object as PropType<IResult>, required: true },
});

const emit = defineEmits(["update:visible", "close", "closeSave"]);

const animationInstance = ref<AnimationItem | null>(null);
const animationContainer = ref<HTMLElement | null>(null);
const dialog = ref(false);

watch(
  () => props.visible,
  async (val) => {
    dialog.value = val;
    if (val && process.client) {
      setTimeout(() => {
        loadAnimation();
      }, 300);
    }
  }
);

const loadAnimation = async () => {
  if (!animationContainer.value) return;

  const lottie = await import("lottie-web");

  if (animationInstance.value) {
    animationInstance.value.destroy();
  }

  const animationPath = props.result.winner
    ? "/animations/winner.json"
    : "/animations/loser.json";

  animationInstance.value = lottie.default.loadAnimation({
    container: animationContainer.value,
    renderer: "svg",
    loop: true,
    autoplay: true,
    path: animationPath,
  });
};

const saveResult = async () => {
  if (!props.result) {
    return $callNotification({
      message: "No se lograrón cargar los datos del resultado",
    });
  }
  try {
    const response = await apiResult.create({ result: props.result });
    Object.assign(userSave, response.user);
    return close(true);
  } catch (error) {
    console.error(error);
    return $callNotification({ message: error });
  }
};

const close = (save: boolean) => {
  dialog.value = false;
  emit("update:visible", false);
  save ? emit("closeSave", userSave) : emit("close", props.result.user);
};
</script>

<style scoped>
.dialog-card {
  background: radial-gradient(circle at center, #2c2c2c 0%, #1e1e1e 60%, #0f0f0f 100%);
  color: #fff;
  border-radius: 16px;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.6);
}

.lottie-box {
  transform: scale(1.4);
  transform-origin: top center;
  max-height: 250px;
  height: 250px;
  width: 100%;
  overflow: hidden;
}

.wave-text span {
  display: inline-block;
  font-size: 5rem;
  animation: wave 2s ease-in-out infinite;
  color: #4caf50;
}
.wave-text span:nth-child(1) {
  animation-delay: 0s;
}
.wave-text span:nth-child(2) {
  animation-delay: 0.1s;
}
.wave-text span:nth-child(3) {
  animation-delay: 0.2s;
}
.wave-text span:nth-child(4) {
  animation-delay: 0.3s;
}
.wave-text span:nth-child(5) {
  animation-delay: 0.4s;
}
.wave-text span:nth-child(6) {
  animation-delay: 0.5s;
}
.wave-text span:nth-child(7) {
  animation-delay: 0.6s;
}
.wave-text span:nth-child(8) {
  animation-delay: 0.7s;
}

.wave-text {
  margin-top: -70px;
}

@keyframes wave {
  0%,
  100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-20px);
  }
}

.drop-text {
  font-size: 2.5rem;
  color: #ff5252;
  animation: drop 2s ease-in-out;
  z-index: 10;
  position: relative;
}

@keyframes drop {
  0% {
    opacity: 0;
    transform: translateY(-60px);
  }
  100% {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>
