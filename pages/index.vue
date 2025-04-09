<template>
  <div class="background-container">
    <div class="content-container">
      <div class="roulette-container mb-4">
        <Roulette
          :roulette-numbers="rouletteNumbers"
          @spin-end="handleSpinEnd"
          :on-spin="onSpin"
        />
      </div>
      <div class="controls-container">
        <v-container class="mt-8 ml-11 pa-0" fluid>
          <v-row
            style="gap: 20px; min-width: 1300px; margin: 0 auto"
            class="d-flex justify-center"
            no-gutters
          >
            <v-col cols="12" md="4" class="px-2">
              <v-row class="d-flex flex-column" style="gap: 10px">
                <v-col cols="12" class="pa-0">
                  <UiTextField
                    prepend-inner-icon="mdi-account"
                    placeholder="Digite el nombre"
                    label="Nombre de usuario"
                    :disabled="flagUser"
                    v-model="user.name"
                    type="text"
                  />
                </v-col>
                <v-row class="pa-0 d-flex" no-gutters>
                  <v-col cols="4" class="px-1">
                    <UiMoneyField
                      placeholder="Digite el monto inicial"
                      v-model="data.initialBalance"
                      prepend-icon="mdi-cash"
                      label="Crédito inicial"
                      :disabled="flagUser"
                    />
                  </v-col>
                  <v-col cols="4" class="px-1">
                    <UiMoneyField
                      prepend-icon="mdi-cash-multiple"
                      v-model="data.actualBalance"
                      label="Crédito actual"
                      :readonly="true"
                    />
                  </v-col>
                  <v-col cols="4" class="px-1">
                    <UiMoneyField
                      prepend-icon="mdi-account-cash"
                      v-model="data.betValue"
                      :disabled="isSpinning"
                      label="Apuesta"
                    />
                  </v-col>
                </v-row>
                <v-col cols="12">
                  <v-row class="pa-0 d-flex justify-center">
                    <UiButton
                      prependIcon="mdi-account-cash"
                      text="Validar usuario"
                      color="amber-lighten-2"
                      :disabled="flagUser"
                      @click="createUser"
                    />
                  </v-row>
                </v-col>
              </v-row>
            </v-col>
            <v-col cols="12" md="7" class="px-12">
              <v-row class="pb-2">
                <v-card class="pt-1 pb-2">
                  <v-row class="pl-4 pt-1 pr-6">
                    <v-col cols="auto" class="pa-0">
                      <UiCheckbox
                        :disabled="disableCheckboxes"
                        v-model="bets.selectedColor"
                        label="Rojo"
                        value="red"
                        color="red"
                      />
                    </v-col>
                    <v-col cols="auto" class="pa-0">
                      <UiCheckbox
                        :disabled="disableCheckboxes"
                        v-model="bets.selectedColor"
                        label="Negro"
                        value="black"
                        color="black"
                      />
                    </v-col>
                    <v-col cols="auto" class="pa-0">
                      <UiCheckbox
                        :disabled="disableCheckboxes"
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
                        :disabled="disableCheckboxes"
                        v-model="bets.evenOdd"
                        color="orange"
                        value="even"
                        label="Par"
                      />
                    </v-col>
                    <v-col cols="auto" class="pa-0">
                      <UiCheckbox
                        :disabled="disableCheckboxes"
                        v-model="bets.evenOdd"
                        color="orange"
                        label="Impar"
                        value="odd"
                      />
                    </v-col>
                  </v-row>
                </v-card>
              </v-row>

              <v-row class="align-center" style="gap: 12px">
                <v-col cols="2" class="pa-0">
                  <UiAutocomplete
                    :bg-color="bets.colorAutocomplete"
                    :disabled="disableAutocomplete"
                    :label="bets.labelAutocomplete"
                    v-model="bets.selectedNumber"
                    placeholder="#"
                  />
                </v-col>
                <v-col cols="auto" class="pa-0">
                  <UiButton
                    prependIcon="mdi-poker-chip"
                    color="amber-lighten-2"
                    :disabled="isSpinning"
                    text="Apostar"
                    @click="spin"
                  />
                </v-col>
                <v-col cols="auto" class="pa-0">
                  <UiButton
                    prependIcon="mdi-cash-sync"
                    color="amber-lighten-2"
                    text="Limpiar apuesta"
                    :disabled="isSpinning"
                    @click="clearBets"
                  />
                </v-col>
              </v-row>
            </v-col>
          </v-row>
        </v-container>
      </div>
    </div>
    <DialogResult v-model:visible="showDialog" :result="result" />
  </div>
</template>
<script setup lang="ts">
import { User, Result } from "~/types";

const { $callNotification } = useNuxtApp();

const apiRouletteNumber = useRouletteNumber();
const apiResult = useResult();
const apiUser = useUser();

const result = reactive(Result.create());
const user = reactive(User.create());

const rouletteResult = ref<{ resultNumber: number; resultColor: string } | null>(null);
const rouletteNumbers = ref<Record<number, "red" | "black" | "green">>({});
const disableAutocomplete = ref(false);
const disableCheckboxes = ref(false);
const isSpinning = ref(false);
const showDialog = ref(false);
const flagUser = ref(false);
const onSpin = ref(false);

const data = ref({
  initialBalance: 0 as number | 0,
  actualBalance: 0 as number | 0,
  betValue: 0 as number | 0,
});

const bets = ref({
  selectedColor: false as "red" | "black" | "green" | false,
  specificColor: null as "red" | "black" | null,
  evenOddColor: null as "red" | "black" | null,
  evenOdd: null as "even" | "odd" | null,
  colorAutocomplete: null as string | null,
  labelAutocomplete: "#" as string,
  selectedNumber: null as number | null,
  colorEvenOdd: null as string | null,
  specific: null as string | null,
  number: null as number | null,
  color: null as string | null,
});

watch(
  () => [bets.value.selectedColor, bets.value.evenOdd],
  ([selectedColor, evenOdd]) => {
    disableAutocomplete.value = selectedColor !== false || evenOdd !== false;
  }
);

watch(
  () => bets.value.selectedNumber,
  async (selectedNumber) => {
    disableCheckboxes.value = selectedNumber !== null;

    if (selectedNumber != null) {
      const numberValue = parseInt(selectedNumber as unknown as string, 10);
      bets.value.colorAutocomplete = rouletteNumbers.value[numberValue] ?? null;
      bets.value.labelAutocomplete = numberValue % 2 === 0 ? "Par" : "Impar";
    } else {
      bets.value.colorAutocomplete = null;
      bets.value.labelAutocomplete = "";
    }
  }
);

onMounted(() => {
  disableAutocomplete.value = true;
  disableCheckboxes.value = true;
  isSpinning.value = true;
  getRouletteNumbers();
});

const getRouletteNumbers = async () => {
  try {
    const response = await apiRouletteNumber.getRouletteNumbers();
    if (response) {
      rouletteNumbers.value = response;
    }
  } catch (error) {
    console.error(error);
    $callNotification({
      message: "Error al obtener el número de la ruleta.",
      type: "error",
    });
  }
};

const createUser = async () => {
  user.balance = data.value.initialBalance;
  let validationError = user.validate();
  if (validationError) {
    return $callNotification({ message: validationError });
  }
  try {
    const response = await apiUser.create({ user: user });
    if (response) {
      Object.assign(user, response);
      data.value.actualBalance = response.balance;
      disableAutocomplete.value = false;
      disableCheckboxes.value = false;
      isSpinning.value = false;
      flagUser.value = true;
    }
  } catch (error) {
    console.error(error);
    return $callNotification({ message: error });
  }
};

const spin = () => {
  if (isSpinning.value) return;

  if (data.value.betValue <= 0) {
    return $callNotification({ message: "El valor de apuesta debe ser mayor a 0" });
  }

  if (data.value.betValue > data.value.actualBalance) {
    return $callNotification({ message: "El crédito no es suficiente" });
  }

  isSpinning.value = true;
  onSpin.value = true;

  setTimeout(() => {
    onSpin.value = false;
    isSpinning.value = false;
  }, 100);
};

const handleSpinEnd = (result: any) => {
  rouletteResult.value = result;
  isSpinning.value = false;
  onSpin.value = false;
  validateResult();
};

const validateResult = async () => {
  if (!rouletteResult.value) {
    return $callNotification({ message: "No se ha girado la ruleta aún." });
  }

  try {
    const payload: any = {
      userId: user.id,
      betValue: data.value.betValue,
      betNumber: rouletteResult.value.resultNumber,
    };

    if (bets.value.selectedNumber !== null) {
      payload.resultNumber = bets.value.selectedNumber;
    }

    if (bets.value.selectedColor !== false) {
      payload.betColor = bets.value.selectedColor;
    }

    if (bets.value.evenOdd !== null) {
      payload.evenOdd = bets.value.evenOdd;
    }

    const response = await apiResult.getValidateResult(payload);

    if (response) {
      Object.assign(result, response);

      data.value.actualBalance = response.remainingBalance;
      showDialog.value = true;
    }
  } catch (error) {
    console.error(error);
    $callNotification({ message: error });
  }
};

const clearBets = () => {
  bets.value = {
    color: null,
    selectedColor: false,
    colorEvenOdd: null,
    evenOddColor: null,
    evenOdd: null,
    specific: null,
    number: null,
    specificColor: null,
    selectedNumber: null,
    colorAutocomplete: null,
    labelAutocomplete: "",
  };
  disableAutocomplete.value = false;
  data.value.betValue = 0;

  return $callNotification({
    message: "Campos de apuesta limpiados.",
    type: "success",
  });
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
