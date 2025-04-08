<template>
  <q-dialog v-model="base.active" persistent class="">
    <q-card class="min-w-[320px] custom-border" :style="{ borderColor: TypeColor }">
      <q-card-section align="center">
        <img :src="TypeImage" class="h-40" />
      </q-card-section>
      <q-card-section align="center">
        <div class="flex flex-row justify-center text-center">
          <div class="pl-4">
            <div class="text-bold text-2xl" :class="`text-${TypeColor}`">
              {{ base.title }}
            </div>
            <div class="text-1xl" v-html="base.message"></div>
          </div>
        </div>
      </q-card-section>
      <q-card-actions align="center">
        <UiButton
          @click="() => base.cancel && base.cancel()"
          v-if="!['email'].includes(base.type)"
          label="Cancelar"
          v-close-popup
          color="red"
          size="sm"
          flat
        />
        <UiButton
          @click="() => base.ok && base.ok()"
          :color="TypeColor"
          label="Continuar"
          v-close-popup
          size="sm"
        />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script setup lang="ts">
const { $closeConfirmation, $useConfirmation } = useNuxtApp();

const base = reactive($useConfirmation.base);
const images = import.meta.glob("@/assets/images/confirmation/*.svg", {
  eager: true,
});
const confirmationFlag = ref(true);

watch(confirmationFlag, (newVal) => !newVal && $closeConfirmation());

const TypeColor: ComputedRef<string> = computed(() => {
  const type = base.type as keyof typeof typeColors;
  const typeColors = {
    warning: "orange",
    success: "green",
    email: "orange",
    info: "info",
    error: "red",
  };
  return typeColors[type];
});
const TypeImage: ComputedRef<string | undefined> = computed(() => {
  const type = base.type;
  const matchedImage = images[`/assets/images/confirmation/${type}.svg`] as
    | { default: string }
    | "";

  return matchedImage ? (matchedImage as any).default : undefined;
});
</script>

<style scoped>
.custom-border {
  border-left: 4px solid #305f93;
  border-radius: 12px;
}
</style>
