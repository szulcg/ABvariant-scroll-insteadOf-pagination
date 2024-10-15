import { applyVariant } from "./variation/variation";
import { waiter } from "./utils/utils";

waiter('.collection .kb-product')
  .then(applyVariant)
  .catch(e => console.log('error while starting variation: ', e))
