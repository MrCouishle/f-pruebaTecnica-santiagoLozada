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
                <v-row class="pa-0 d-flex" no-gutters>
                  <v-col cols="7" class="pa-0">
                    <UiTextField
                      prepend-inner-icon="mdi-account"
                      placeholder="Digite el nombre"
                      label="Nombre de usuario"
                      :disabled="disableUser"
                      v-model="user.name"
                      type="text"
                    />
                  </v-col>
                  <v-col cols="5" class="px-1">
                    <UiMoneyField
                      placeholder="Digite el monto inicial"
                      v-model="data.initialBalance"
                      prepend-icon="mdi-cash"
                      label="Crédito inicial"
                      :disabled="disableUser"
                    />
                  </v-col>
                </v-row>
                <v-row class="pa-0 d-flex" no-gutters>
                  <v-col cols="6" class="px-1">
                    <UiMoneyField
                      prepend-icon="mdi-cash-multiple"
                      v-model="data.actualBalance"
                      background-color="#C7C7C7"
                      label="Crédito actual"
                      :readonly="true"
                    />
                  </v-col>
                  <v-col cols="6" class="px-1">
                    <UiMoneyField
                      prepend-icon="mdi-account-cash"
                      :disabled="disableInputBet"
                      v-model="data.betValue"
                      label="Apuesta"
                    />
                  </v-col>
                </v-row>
                <v-col cols="12">
                  <v-row class="pa-0 d-flex justify-center">
                    <UiButton
                      prependIcon="mdi-account-cash"
                      color="amber-lighten-2"
                      :disabled="disableUser"
                      text="Validar usuario"
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
    <DialogResult
      @closeSave="(userSave: IUser) => clearBets(true, userSave)"
      @close="(userSave: IUser) => clearBets(false, userSave)"
      v-model:visible="showDialog"
      :result="result"
    />
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
const disableInputBet = ref(false);
const disableUser = ref(false);
const isSpinning = ref(false);
const showDialog = ref(false);
const onSpin = ref(false);

const data = ref({
  initialBalance: 0,
  actualBalance: 0,
  betValue: 0,
});

const bets = ref({
  selectedColor: false as "red" | "black" | "green" | false,
  colorAutocomplete: null as string | null,
  evenOdd: false as "even" | "odd" | false,
  selectedNumber: null as number | null,
  colorEvenOdd: null as string | null,
  labelAutocomplete: "#" as string,
});

watch(
  () => [bets.value.selectedColor, bets.value.evenOdd, data.value.betValue, onSpin.value],
  ([selectedColor, evenOdd, betValue, onSpin]) => {
    if (data.value.betValue <= 0) {
      bets.value.selectedNumber = null;
      bets.value.selectedColor = false;
      bets.value.evenOdd = false;
      setTimeout(() => {
        disableAutocomplete.value = true;
        disableCheckboxes.value = true;
        isSpinning.value = true;
      }, 100);
    } else {
      disableAutocomplete.value = onSpin == true ? true : false;
      disableCheckboxes.value = onSpin == true ? true : false;
      isSpinning.value = onSpin == true ? true : false;
    }

    disableAutocomplete.value = selectedColor != false || evenOdd != false;
  }
);

watch(
  () => [bets.value.selectedNumber],
  ([selectedNumber]) => {
    if (selectedNumber != null) {
      const numberValue = parseInt(selectedNumber as unknown as string, 10);
      bets.value.colorAutocomplete = rouletteNumbers.value[numberValue] ?? null;
      bets.value.labelAutocomplete = numberValue % 2 === 0 ? "Par" : "Impar";
      disableCheckboxes.value = true;
    } else {
      bets.value.colorAutocomplete = null;
      bets.value.labelAutocomplete = "";
      disableCheckboxes.value = false;
    }
  }
);

onMounted(() => {
  disableAutocomplete.value = true;
  disableCheckboxes.value = true;
  disableInputBet.value = true;
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
      disableInputBet.value = false;
      disableUser.value = true;
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

  const noBetsPlaced =
    bets.value.selectedColor === false &&
    bets.value.evenOdd === false &&
    bets.value.selectedNumber === null;

  if (noBetsPlaced) {
    return $callNotification({
      message:
        "Debes seleccionar al menos un tipo de apuesta (color, par/impar o número).",
    });
  }

  data.value.actualBalance -= data.value.betValue;

  disableAutocomplete.value = true;
  disableInputBet.value = true;
  onSpin.value = true;
};

const handleSpinEnd = (result: any) => {
  disableAutocomplete.value = false;
  rouletteResult.value = result;
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
      resultNumber: rouletteResult.value.resultNumber,
    };

    if (bets.value.selectedNumber !== null) {
      payload.betNumber = bets.value.selectedNumber;
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

const clearBets = (save: boolean, userSave: IUser) => {
  if (userSave != null) {
    data.value.actualBalance = userSave.balance;
  }

  bets.value = {
    colorAutocomplete: null,
    labelAutocomplete: "",
    selectedNumber: null,
    selectedColor: false,
    colorEvenOdd: null,
    evenOdd: false,
  };
  disableInputBet.value = false;
  isSpinning.value = true;
  data.value.betValue = 0;
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
