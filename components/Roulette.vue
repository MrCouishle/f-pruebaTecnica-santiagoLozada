<template>
  <div class="roulette-container">
    <div class="roulette-table-bg">
      <div class="wood-edge"></div>
    </div>

    <div class="main">
      <div class="arrow-pointer"></div>
      <div class="plate" :class="{ rest: isResting }" ref="plate">
        <div class="plate-center-text"></div>
        <ul :data-spinto="spinto">
          <li
            v-for="(num, index) in numbersOrder"
            :class="['number', rouletteNumbers[num]]"
            :style="getRotationStyle(index)"
            :key="num"
          >
            <label>
              <input type="radio" name="pit" :value="num" />
              <span class="pit">{{ num }}</span>
            </label>
          </li>
        </ul>
      </div>
      <div :class="textCenterClass">
        {{ centerText }}
      </div>
      <div class="results-overlay">
        <Results :results="previousResults" />
      </div>
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  rouletteNumbers: {
    type: Object,
    default: false,
  },
  onSpin: {
    type: Boolean,
    default: false,
  },
  onReset: {
    type: Boolean,
    default: false,
  },
});

const emit = defineEmits(["spin-end"]);

const { $callNotification } = useNuxtApp();

const apiRouletteNumber = useRouletteNumber();

const centerText = ref("Hagan sus apuestas");
const previousResults = ref([]);
const currentRotation = ref(0);
const resultNumber = ref("00");
const resultColor = ref("red");
const isResting = ref(false);
const spinSound = ref(null);
const spinto = ref(null);
const plate = ref(null);

const numbersOrder = [
  0, 32, 15, 19, 4, 21, 2, 25, 17, 34, 6, 27, 13, 36, 11, 30, 8, 23, 10, 5, 24, 16, 33, 1,
  20, 14, 31, 9, 22, 18, 29, 7, 28, 12, 35, 3, 26,
];

const textCenterClass = computed(() => {
  return centerText.value.includes("Resultado") ? "text-center result" : "text-center";
});

watch(
  () => [props.onSpin, props.onReset],
  ([spinVal, resetVal]) => {
    if (spinVal) {
      spin();
    }
    if (resetVal) {
      reset();
    }
  }
);

onMounted(() => {
  spinSound.value = new Audio("/sounds/roulette-spin.mp3");
});

const spin = async () => {
  centerText.value = "No más apuestas...";
  isResting.value = false;

  try {
    const response = await apiRouletteNumber.getRandomNumber();

    const selectedNumber = response.id;
    const selectedColor = response.color;
    // const selectedNumber = 1; // Para dialog ganador
    // const selectedColor = "red"; // Para dialog ganador

    const randIndex = numbersOrder.findIndex((n) => Number(n) === selectedNumber);
    if (randIndex === -1) {
      return $callNotification({ message: "Número inválido retornado por la API" });
    }

    const anglePerNumber = 360 / numbersOrder.length;
    const extraRotations = 5;

    const targetAngle = 360 - anglePerNumber * randIndex;
    const currentAngle = currentRotation.value % 360;
    const angleDiff = (targetAngle - currentAngle + 360) % 360;
    const totalRotation = 360 * extraRotations + angleDiff;

    currentRotation.value += totalRotation;

    spinSound.value.currentTime = 0;
    spinSound.value.play();

    plate.value.style.transition = "transform 4s cubic-bezier(0.33, 1, 0.68, 1)";
    plate.value.style.transform = `rotate(${currentRotation.value}deg)`;

    resultNumber.value = selectedNumber;
    resultColor.value = selectedColor;

    const dataReturn = {
      resultNumber: resultNumber.value,
      resultColor: resultColor.value,
    };

    setTimeout(() => {
      spinSound.value.pause();
      spinSound.value.currentTime = 0;

      isResting.value = true;
      centerText.value = `Resultado: ${resultNumber.value}`;
      previousResults.value.push({
        number: resultNumber.value,
        color: resultColor.value,
      });
      if (previousResults.value.length > 10) {
        previousResults.value.shift();
      }
      emit("spin-end", dataReturn);
    }, 4000);
  } catch (error) {
    isResting.value = true;
    console.error(error);
    $callNotification({ message: "Error al obtener el número de la ruleta." });
  }
};

const reset = () => {
  previousResults.value = [];
  resultNumber.value = "00";
  resultColor.value = "red";
  currentRotation.value = 0;
  isResting.value = false;
  spinto.value = null;

  if (plate.value) {
    plate.value.style.transition = "none";
    plate.value.style.transform = "rotate(0deg)";
  }
};

const getRotationStyle = (index) => {
  const angle = (360 / numbersOrder.length) * index;
  return {
    transform: `rotateZ(${angle}deg)`,
  };
};
</script>

<style scoped lang="scss">
@use "sass:math";
@use "sass:color";

$platesize: 350px;
$pitwidth: 32px;
$rotate: math.div(360, 37);
$rimsize: 6px;
$trim: gold;
$trimSecondary: silver;
$spinButton: green;
$resetButton: darkgreen;

body {
  background-color: #300;
  background-size: 100px 100px;
  overflow: hidden;
}

.roulette-container {
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 40px 0;
  width: 100%;
}

.roulette-table-bg {
  position: absolute;
  bottom: 0;
  width: 100%;
  height: 35vh;
  background: radial-gradient(
    ellipse at bottom center,
    #2ecc71 0%,
    #27ae60 40%,
    #145a32 100%
  );
  z-index: 0;

  .wood-edge {
    width: 100%;
    height: 30px;
    background: linear-gradient(to bottom, #a0522d 0%, #8b4513 40%, #5a2e0e 100%);
    border-top-left-radius: 10px;
    border-top-right-radius: 10px;
    box-shadow: 0 -4px 8px rgba(0, 0, 0, 0.4);
  }
}

.main {
  width: $platesize + 24px;
  margin: 0 auto;
  position: relative;
  z-index: 1;
}

.arrow-pointer {
  position: absolute;
  left: 50%;
  transform: translateX(-50%);
  width: 0;
  height: 0;
  border-left: 14px solid transparent;
  border-right: 14px solid transparent;
  border-top: 24px solid #ffd23d;
  z-index: 3;
  filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.5));
}

@import url("https://fonts.googleapis.com/css2?family=Cinzel&display=swap");

.plate,
.plate * {
  font-family: "Cinzel", serif;
}

.plate {
  background-color: gray;
  width: $platesize;
  height: $platesize;
  margin: $rimsize * 2;
  border-radius: 50%;
  position: relative;

  &::after,
  &::before {
    content: "";
    display: block;
    position: absolute;
    border-radius: 50%;
  }

  &::after {
    top: -$rimsize;
    right: -$rimsize;
    bottom: -$rimsize;
    left: -$rimsize;
    border: $rimsize solid $trim;
  }

  &::before {
    background: rgba(0, 0, 0, 0.65);
    border: 1px solid $trimSecondary;
    top: 12%;
    left: 12%;
    right: 12%;
    bottom: 12%;
    z-index: 1;
  }
}

@keyframes spinAndBounce {
  0% {
    transform: rotate(0deg);
  }
  92% {
    transform: rotate(1440deg);
  }
  98% {
    transform: rotate(1435deg);
  }
  100% {
    transform: rotate(1440deg);
  }
}

.plate-center-text {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 130px;
  height: 130px;
  border-radius: 50%;
  background: linear-gradient(
    135deg,
    #fff8dc 0%,
    #f7d774 20%,
    #d4af37 50%,
    #b8860b 80%,
    #fff8dc 100%
  );
  color: #3c2f00;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 16px;
  font-weight: bold;
  text-align: center;
  padding: 12px;
  box-shadow: inset 0 0 6px rgba(255, 255, 255, 0.3),
    inset 0 0 16px rgba(255, 215, 0, 0.2), 0 4px 8px rgba(0, 0, 0, 0.5),
    0 0 12px rgba(255, 215, 0, 0.3);
  text-shadow: 1px 1px 1px rgba(255, 255, 255, 0.5), -1px -1px 1px rgba(128, 96, 0, 0.4);
  z-index: 2;
}

.number {
  width: $pitwidth;
  height: math.div($platesize, 2);
  display: inline-block;
  text-align: center;
  position: absolute;
  top: 0;
  left: calc(50% - math.div($pitwidth, 2));
  transform-origin: 50% 100%;
  background-color: transparent;
  border-left: math.div($pitwidth, 2) solid transparent;
  border-right: math.div($pitwidth, 2) solid transparent;
  border-top-width: math.div($platesize, 2);
  border-top-style: solid;
}

.red {
  border-top-color: #d32f2f !important;
}

.black {
  border-top-color: #212121 !important;
}

.green {
  border-top-color: #388e3c !important;
}

.pit {
  color: #fff;
  padding-top: 12px;
  width: $pitwidth;
  display: inline-block;
  font-size: 12px;
  transform: scale(1, 1.8);
  position: absolute;
  top: -(math.div($platesize, 2));
  left: -(math.div($pitwidth, 2));
}

.text-center {
  position: absolute;
  top: 48%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 130px;
  height: 130px;

  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 16px;
  font-weight: bold;
  text-align: center;
  padding: 12px;
  text-shadow: 1px 1px 1px rgba(255, 255, 255, 0.5), -1px -1px 1px rgba(128, 96, 0, 0.4);
  z-index: 2;
}

.text-center.result {
  top: 50%;
}

.results-overlay {
  position: absolute;
  bottom: -60px;
  left: 50%;
  transform: translateX(-50%);
  z-index: 10;
  pointer-events: none;
}
</style>
