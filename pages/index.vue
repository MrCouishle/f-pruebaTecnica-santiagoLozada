<template>
  <div class="background-container">
    <div class="content-container">
      <div class="roulette-container">
        <Roulette :onSpin="onSpin" />
      </div>
      <div class="controls-container">
        <v-container class="pa-0" fluid>
          <v-row class="d-flex justify-center" no-gutters style="gap: 20px">
            <v-col cols="12" md="4" class="px-2">
              <v-row class="d-flex flex-column" style="gap: 10px">
                <v-col cols="12" class="pa-0">
                  <UiTextField
                    v-model="user.name"
                    prepend-inner-icon="mdi-account"
                    placeholder="Digite el nombre"
                    label="Nombre de usuario"
                    type="text"
                  />
                </v-col>

                <!-- Monto inicial a la izquierda, monto actual a la derecha -->
                <v-row class="pa-0 d-flex" no-gutters>
                  <v-col cols="6" class="px-1">
                    <UiTextField
                      v-model="user.balance"
                      prepend-inner-icon="mdi-cash"
                      placeholder="Digite el monto inicial"
                      label="Monto inicial"
                      type="currency"
                    />
                  </v-col>
                  <v-col cols="6" class="px-1">
                    <UiTextField
                      v-model="user.balance"
                      prepend-inner-icon="mdi-cash-multiple"
                      label="Monto actual"
                      type="currency"
                    />
                  </v-col>
                </v-row>
                <v-col cols="12" class="pa-0 d-flex justify-center">
                  <UiButton
                    prependIcon="mdi-poker-chip"
                    text="Guardar usuario"
                    color="amber-lighten-2"
                    @click="createUser"
                  />
                </v-col>
              </v-row>
            </v-col>
            <v-col cols="12" md="6" class="px-2">
              <!-- ✅ Card de colores con margen inferior -->
              <v-row class="pb-2">
                <v-card class="pt-1 pb-2">
                  <v-row class="pl-4 pt-1 pr-6">
                    <v-col cols="auto" class="pa-0">
                      <UiCheckbox
                        v-model="bets.selectedColor"
                        label="Rojo"
                        value="red"
                        color="red"
                      />
                    </v-col>
                    <v-col cols="auto" class="pa-0">
                      <UiCheckbox
                        v-model="bets.selectedColor"
                        label="Negro"
                        value="black"
                        color="black"
                      />
                    </v-col>
                    <v-col cols="auto" class="pa-0">
                      <UiCheckbox
                        v-model="bets.selectedColor"
                        label="Verde"
                        value="green"
                        color="green"
                      />
                    </v-col>
                  </v-row>
                </v-card>
                <v-card class="pt-1 ml-2 pb-2">
                  <v-row class="pl-4 pt-1 pr-6">
                    <v-col cols="auto" class="pa-0">
                      <UiCheckbox
                        v-model="bets.even"
                        label="Par"
                        value="even"
                        color="orange"
                      />
                    </v-col>
                    <v-col cols="auto" class="pa-0">
                      <UiCheckbox
                        v-model="bets.odd"
                        label="Impar"
                        value="odd"
                        color="orange"
                      />
                    </v-col>
                  </v-row>
                </v-card>
              </v-row>

              <v-row style="gap: 12px">
                <v-col cols="2" class="pa-0">
                  <UiAutocomplete v-model="bets.selectedNumber" placeholder="Número" />
                </v-col>
                <v-col cols="auto" class="pa-0">
                  <UiButton
                    prependIcon="mdi-poker-chip"
                    text="Apostar"
                    color="amber-lighten-2"
                    :disabled="isSpinning"
                    @click="spin"
                  />
                </v-col>
              </v-row>
            </v-col>
          </v-row>
        </v-container>
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
import { User } from "~/types";

const { $callNotification } = useNuxtApp();
const apiUser = useUser();

const user = reactive(User.create());

const isSpinning = ref(false);
const onSpin = ref(false);

const bets = ref({
  color: null as string | null,
  selectedColor: null as "red" | "black" | null,
  colorEvenOdd: null as string | null,
  evenOddColor: null as "red" | "black" | null,
  even: null as "even" | "odd" | null,
  odd: null as "even" | "odd" | null,
  specific: null as string | null,
  number: null as number | null,
  specificColor: null as "red" | "black" | null,
  selectedNumber: null as number | null,
});

const createUser = async () => {
  let validationError = user.validate();
  console.log("🚀 ~ createUser ~ validationError:", validationError);
  console.log("🚀 ~ createUser ~ user:", user);
  if (validationError) {
    return $callNotification({ message: validationError });
  }

  try {
    const response = await apiUser.create({ user: user });
  } catch (error) {
    console.error(error);
    return $callNotification({ message: error });
  }
};

const spin = () => {
  if (isSpinning.value) return;

  isSpinning.value = true;
  onSpin.value = true;

  setTimeout(() => {
    onSpin.value = false;
    isSpinning.value = false;
  }, 100);
};
</script>

<style scoped>
body {
  border: 2px solid red;
}

.background-container {
  background-image: url("/images/casino3.jpg");
  background-size: cover;
  background-position: center -180px;
  background-repeat: no-repeat;
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
}

.content-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  max-width: 1200px;
  padding: 10px;
  border-radius: 12px;
}

.controls-container {
  width: 100%;
}
</style>
