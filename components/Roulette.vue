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
            v-for="(num, index) in numbers"
            :key="num"
            :class="['number', numberColors[num]]"
            :style="getRotationStyle(index)"
          >
            <label>
              <input type="radio" name="pit" :value="num" />
              <span class="pit">{{ num }}</span>
            </label>
          </li>
        </ul>
      </div>
      <div class="text-center">
        {{ centerText }}
      </div>
      <div>
        <Results :results="previousResults" />
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, watch } from "vue";

const props = defineProps({
  onSpin: {
    type: Boolean,
    default: false,
  },
});

watch(
  () => props.onSpin,
  (newVal) => {
    if (newVal) {
      spin();
    }
  }
);

const numbers = [
  0, 32, 15, 19, 4, 21, 2, 25, 17, 34, 6, 27, 13, 36, 11, 30, 8, 23, 10, 5, 24, 16, 33, 1,
  20, 14, 31, 9, 22, 18, 29, 7, 28, 12, 35, 3, 26,
];

const numberColors = {
  0: "green",
  1: "red",
  2: "black",
  3: "red",
  4: "black",
  5: "red",
  6: "black",
  7: "red",
  8: "black",
  9: "red",
  10: "black",
  11: "black",
  12: "red",
  13: "black",
  14: "red",
  15: "black",
  16: "red",
  17: "black",
  18: "red",
  19: "red",
  20: "black",
  21: "red",
  22: "black",
  23: "red",
  24: "black",
  25: "red",
  26: "black",
  27: "red",
  28: "black",
  29: "black",
  30: "red",
  31: "black",
  32: "red",
  33: "black",
  34: "red",
  35: "black",
  36: "red",
};

const plate = ref(null);
const isResting = ref(false);
const isSpinning = ref(false);
const spinto = ref(null);
const resultNumber = ref("00");
const resultColor = ref("red");
const previousResults = ref([]);
const currentRotation = ref(0);
const centerText = ref("Hagan sus apuestas");

const spin = () => {
  centerText.value = `No más apuestas...`;
  const randIndex = Math.floor(Math.random() * numbers.length);
  const selectedNumber = numbers[randIndex];

  const anglePerNumber = 360 / numbers.length;
  const extraRotations = 5;

  // 1. Ángulo donde debería terminar el número sorteado
  const targetAngle = 360 - anglePerNumber * randIndex;

  // 2. Ángulo actual (mod 360 para quedarnos con la fracción de vuelta)
  const currentAngle = currentRotation.value % 360;

  // 3. Cuántos grados faltan desde el ángulo actual al número objetivo
  const angleDiff = (targetAngle - currentAngle + 360) % 360;

  // 4. Le sumamos las vueltas extra completas
  const totalRotation = 360 * extraRotations + angleDiff;

  // 5. Aplicamos la rotación acumulada
  currentRotation.value += totalRotation;

  plate.value.style.transition = "transform 4s cubic-bezier(0.33, 1, 0.68, 1)";
  plate.value.style.transform = `rotate(${currentRotation.value}deg)`;

  isResting.value = false;

  resultNumber.value = selectedNumber;
  resultColor.value = numberColors[selectedNumber];
  setTimeout(() => {
    isResting.value = true;
    centerText.value = `Resultado: ${resultNumber.value}`;

    previousResults.value.push({
      number: selectedNumber,
      color: resultColor.value,
    });
    if (previousResults.value.length > 10) {
      previousResults.value.shift();
    }
  }, 4000);
};

const reset = () => {
  resultNumber.value = "00";
  resultColor.value = "red";
  previousResults.value = [];
  spinto.value = null;
  isResting.value = false;
  currentRotation.value = 0;

  if (plate.value) {
    plate.value.style.transition = "none";
    plate.value.style.transform = "rotate(0deg)";
  }
};

const getRotationStyle = (index) => {
  const angle = (360 / numbers.length) * index;
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
  font-family: "Playfair Display", serif;
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

.text-center {
  position: absolute;
  top: 45%;
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

.arrow-pointer {
  position: absolute;
  left: 50%;
  transform: translateX(-50%);
  width: 0;
  height: 0;
  border-left: 14px solid transparent;
  border-right: 14px solid transparent;
  border-top: 24px solid #ffd23d; // dorado como el borde
  z-index: 3;
  filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.5));
}
</style>
