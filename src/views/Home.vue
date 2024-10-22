<template>
  <div class="roulette-table">
    <div class="roulette-wheel" :style="{ transform: `rotate(${rotation}deg)` }"></div>

    <q-slide-transition>
      <div v-show="winningColor">
        <div style="border-radius: 4px" :class="`bg-${winningColor || 'accent'}`" class="text-white q-pa-sm">
          {{ winningNumber % 2 == 0 ? 'Numero par' : 'Numero impar' }}
        </div>
      </div>
    </q-slide-transition>
    <q-card class="row" style="width: 450px; border-radius: 0.8rem">
      <div class="col-12 q-py-md text-center">
        <div class="q-ma-sm">
          <div class="row q-col-gutter-xs">
            <Subtitle_ class="col-12" text="Información requerida del usuario" icon="person_outline" />
            <q-input class="col-6" label="Nombre" v-model="userBet.name" dense filled />
            <q-input v-model="userBet.credit" label="Crédito" class="col-6" prefix="$" filled dense />
            <div class="col-12 text-center">
              <Button_
                icon-right="price_change"
                class="botone q-mx-sm"
                label="Cargar saldo"
                @click="getUser"
                color="accent"
                dense
              />
              <Button_
                label="Guardar Usuario"
                class="botone q-mx-sm"
                @click="createUser"
                icon-right="save"
                color="green-10"
                dense
              />
            </div>
            <Subtitle_ class="col-12" text="Información de la apuesta" icon="receipt_long" />
            <q-input
              mask="###,###,###,###,###"
              v-model="userBet.betAmount"
              label="Valor apostado"
              reverse-fill-mask
              unmasked-value
              class="col-8"
              prefix="$"
              filled
              dense
            />
          </div>
          <Toggle_
            class="text-white"
            true-value="red"
            false-value="black"
            :class="evaluateColor"
            v-model="selectedColor"
            :label="evaluateLabelColor"
          />
          <Toggle_
            color="accent"
            :true-value="true"
            :false-value="false"
            v-model="selectedEven"
            :label="evaluateLabelisEven"
          />
        </div>
      </div>
      <q-card-actions class="col-12 text-primary text-end" align="center">
        <Button_
          label="Girar Ruleta"
          @click="spinWheel"
          icon-right="cached"
          class="botone q-mx-sm"
          :show_loader="true"
        />
        <Button_ label="limpiar jugada" @click="cleanPlay" icon-right="delete" class="botone q-mx-sm" color="red-10" />
      </q-card-actions>
    </q-card>
    <div class="board">
      <div v-for="(row, rowIndex) in boardNumbers" :key="rowIndex" class="row">
        <div
          v-for="(cell, cellIndex) in row"
          :class="['cell', getCellClass(cell), getCellWinner(cell)]"
          @click="selectNumber(cell)"
          :key="cellIndex"
        >
          {{ cell }}
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import Button_ from '@/components/global/Button';
import Toggle_ from '@/components/global/Toggle';

import Subtitle_ from '@/components/ui/Subtitle';

import { ref, computed, watch } from 'vue';
import { apiAxios } from '@/api';
import { Notify } from 'quasar';

const boardNumbers = ref([
  [0],
  [3, 6, 9, 12, 15, 18, 21, 24, 27, 30, 33, 36],
  [2, 5, 8, 11, 14, 17, 20, 23, 26, 29, 32, 35],
  [1, 4, 7, 10, 13, 16, 19, 22, 25, 28, 31, 34],
]);

const selectedNumber = ref(null);
const winningNumber = ref(null);
const winningColor = ref(null);
const isNegative = ref(false);
const rotation = ref(0);

const selectedColor = ref(null);
const selectedEven = ref(null);
const userBet = ref({
  betAmount: null,
  credit: null,
  name: '',
});

watch(
  () => selectedNumber.value,
  (new_value) => new_value !== null && (selectedEven.value = null)
);
watch(
  () => selectedEven.value,
  (new_value) => new_value !== null && (selectedNumber.value = null)
);

const evaluateLabelisEven = computed(() => {
  return { true: 'Numeros pares', false: 'Numeros impares' }[selectedEven.value] || 'Elige una opción';
});
const evaluateLabelColor = computed(() => {
  return { red: 'Apostando al rojo', black: 'Apostando al negro' }[selectedColor.value] || 'Elige un color';
});
const evaluateColor = computed(() => {
  return { red: 'bg-red', black: 'bg-black' }[selectedColor.value] || 'bg-accent';
});

const getUser = async () => {
  if (!validateRequiredProperty('name', 'Nombre de usuario')) return;

  try {
    const response = await apiAxios({ method: 'get', url: 'User/get-user', params: { name: userBet.value.name } });
    Object.assign(userBet.value, response.data);
    if (response.success == false) {
      Notify.create({ caption: response.message, message: 'Atencion' });
    }
  } catch (error) {
    console.error(error);
    Notify.create({ caption: error.message, message: 'Atencion' });
  }
};
const createUser = async () => {
  if (!validateRequiredProperty('name', 'Nombre de usuario')) return;
  if (!validateRequiredProperty('credit', 'Crédito')) return;

  try {
    const response = await apiAxios({ method: 'post', url: 'User/create-user', data: userBet.value });
    Notify.create({ caption: response.message, message: 'Atencion' });
  } catch (error) {
    console.error(error);
    Notify.create({ caption: error.message, message: 'Atencion' });
  }
};

const selectNumber = (number) => {
  selectedNumber.value = number;
};

const getCellClass = (number) => {
  if (number === selectedNumber.value) return 'selected';
  if (number === 0) return 'zero';
  return number % 2 === 0 ? 'black' : 'red';
};

const getCellWinner = (number) => {
  if (number === winningNumber.value) return 'selected-winner';
  if (number === 0) return 'zero';
  return number % 2 === 0 ? 'black' : 'red';
};
const cleanPlay = () => {
  selectedNumber.value = null;
  selectedColor.value = null;
  selectedEven.value = null;
};
const isSpinValid = () => {
  if (!validateRequiredProperty('name', 'Nombre de usuario')) return false;
  if (!validateRequiredProperty('betAmount', 'Valor apostado')) return false;
  if (!selectedColor.value && !selectedNumber.value && !selectedColor.value) {
    Notify.create({ caption: 'Elige al menos una opción para iniciar el juego', message: 'Atención' });
    return false;
  }
  return true;
};
const generateRandomRotation = () => {
  const baseRotation = rotation.value % 360;
  return Math.floor(Math.random() * 360) + baseRotation * 10;
};

const spinWheel = async () => {
  if (!isSpinValid()) return;
  rotation.value = generateRandomRotation();

  winningNumber.value = null;
  if (userBet.value.credit < userBet.value.betAmount) {
    isNegative.value == true;
  } else {
    isNegative.value == false;
  }
  userBet.value.credit -= Number(userBet.value.betAmount);
  try {
    const response = await apiAxios({ method: 'get', url: 'Result/ramdom-result' });
    winningNumber.value = response.data.number;
    winningColor.value = response.data.color;
    evaluateWinner(response.data);
  } catch (error) {
    console.error(error);
    Notify.create({ caption: error.message, message: 'Atencion' });
  }
};
const evaluateWinner = async (params) => {
  try {
    const response = await apiAxios({
      method: 'post',
      url: 'Result/validate-result',
      params,
      data: {
        betAmount: userBet.value.betAmount,
        number: selectedNumber.value,
        isEven: selectedEven.value,
        color: selectedColor.value,
      },
    });
    if (response.data.reward != 0) {
      userBet.value.credit += Number(userBet.value.betAmount) + Number(response.data.reward);
      Notify.create({ caption: response.message, message: 'Atencion', iconColor: 'green' });
    } else {
      Notify.create({
        caption: `Has perdido el monto apostado, tu saldo es de ${userBet.value.credit}`,
        message: 'Atencion',
        iconColor: 'red',
      });
    }
  } catch (error) {
    console.error(error);
    Notify.create({ caption: error.message, message: 'Atencion' });
  }
};

const validateRequiredProperty = (nameProperty, nameLabel) => {
  if (!userBet.value[nameProperty]) {
    Notify.create({ caption: `${nameLabel} es requerido para iniciar el juego`, message: 'Atencion' });
    return false;
  }
  return true;
};
</script>

<style scoped>
.roulette-table {
  display: flex;
  flex-direction: column;
  align-items: center;
  height: 100vh;
  justify-content: space-between;
  background-image: url('@/assets/image/background.webp');
  background-position: center center;
  background-size: cover;
  background-attachment: fixed;
  perspective: 1000px;
}

.roulette-wheel {
  width: 220px;
  height: 220px;
  border-radius: 50%;
  border: 3px solid #0c2701;
  background: conic-gradient(
    red 0deg 10deg,
    black 10deg 20deg,
    red 20deg 30deg,
    black 30deg 40deg,
    red 40deg 50deg,
    black 50deg 60deg,
    red 60deg 70deg,
    black 70deg 80deg,
    red 80deg 90deg,
    black 90deg 100deg,
    red 100deg 110deg,
    black 110deg 120deg,
    red 120deg 130deg,
    black 130deg 140deg,
    red 140deg 150deg,
    black 150deg 160deg,
    red 160deg 170deg,
    black 170deg 180deg,
    red 180deg 190deg,
    black 190deg 200deg,
    red 200deg 210deg,
    black 210deg 220deg,
    red 220deg 230deg,
    black 230deg 240deg,
    red 240deg 250deg,
    black 250deg 260deg,
    red 260deg 270deg,
    black 270deg 280deg,
    red 280deg 290deg,
    black 290deg 300deg,
    red 300deg 310deg,
    black 310deg 320deg,
    red 320deg 330deg,
    black 330deg 340deg,
    red 340deg 350deg,
    black 350deg 360deg
  );
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.4);
  transition: transform 3s ease-out;
}

.roulette-wheel::before {
  content: '';
  position: absolute;
  top: 5px;
  left: 5px;
  right: 5px;
  bottom: 5px;
  border-radius: 50%;
  border: 2px solid rgba(255, 255, 255, 0.4);
  background: conic-gradient(
    rgba(255, 255, 255, 0.1) 0deg,
    rgba(255, 255, 255, 0.1) 10deg,
    rgba(255, 255, 255, 0) 10deg,
    rgba(255, 255, 255, 0) 100deg,
    rgba(255, 255, 255, 0.1) 100deg,
    rgba(255, 255, 255, 0.1) 110deg,
    rgba(255, 255, 255, 0) 110deg,
    rgba(255, 255, 255, 0) 360deg
  );
  z-index: -1;
}

.button-container {
  display: flex;
  justify-content: space-around;
  width: 100%;
  max-width: 500px;
}

.board {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 45vh;
  background-color: #006400;
  padding: 10px;
  border-radius: 10px;
  box-shadow: 0 8px 15px rgba(0, 0, 0, 1);
  background-image: url('@/assets/image/background-table.webp');
  background-size: cover;
  transform: rotateX(30deg);
}

.cell {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 70px;
  height: 70px;
  margin: 5px;
  border-radius: 10%;
  font-size: 24px;
  font-weight: bold;
  cursor: pointer;
  transition:
    background-color 0.3s,
    transform 0.2s;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.5);
  transform: translateZ(10px);
}

.red {
  background-color: #c0392b;
  color: white;
}

.black {
  background-color: black;
  color: white;
}

.zero {
  background-color: green;
  color: white;
}

.selected {
  background-color: yellow;
  color: black;
  transform: scale(1.2) translateZ(20px);
}
.selected-winner {
  background-color: #6832cd;
  color: white;
  transform: scale(1.2) translateZ(20px);
  animation: focus-animation 1.5s infinite;
  box-shadow: 0 0 20px rgba(50, 205, 50, 0.6);
}

@keyframes focus-animation {
  0%,
  100% {
    transform: scale(1) translateZ(20px);
  }
  50% {
    transform: scale(0.8) translateZ(10px);
  }
}

.board .cell:hover {
  transform: scale(1.1) translateZ(15px);
}

@media (max-width: 768px) {
  .cell {
    width: 50px;
    height: 50px;
    font-size: 18px;
  }

  .roulette-wheel {
    width: 180px;
    height: 180px;
  }
}

@media (max-width: 480px) {
  .cell {
    width: 35px;
    height: 35px;
    font-size: 14px;
  }

  .roulette-wheel {
    width: 150px;
    height: 150px;
  }
}
</style>
