import { CallConfirmation, CloseConfirmation, ConfirmationData } from "./confirmation";
import { CallNotification, OffNotification } from "./notifications";

declare module "#app" {
  interface NuxtApp {
    $callNotification: CallNotification;
    $offNotification: OffNotification;
  }
}

declare module "vue" {
  interface ComponentCustomProperties {
    $callNotification: CallNotification;
    $offNotification: OffNotification;
  }
}
declare module "#app" {
  interface NuxtApp {
    $useConfirmation: ReturnType<typeof useConfirmation>;
    $dataConfirmation: ConfirmationData;
    $callConfirmation: CallConfirmation;
    $closeConfirmation: CloseConfirmation;
  }
}

declare module "vue" {
  interface ComponentCustomProperties {
    $useConfirmation: ReturnType<typeof useConfirmation>;
    $dataConfirmation: ConfirmationData;
    $callConfirmation: CallConfirmation;
    $closeConfirmation: CloseConfirmation;
  }
}
declare module "#app" {
  interface NuxtApp {
    $apiRoulette: typeof apiRoulette;
  }
}
