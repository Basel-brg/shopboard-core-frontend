import type * as THREE from 'three';
import { PRODUCTS } from '../modules/products/products.api';
import type { CartManager } from '../modules/cart/cart.state';
import type { DeskSceneItemUserData } from './types';

export interface SetupCartResult {
  totalItems: number;
  uniqueProducts: number;
  totalAmount: number;
}

export function calculateSetupTotal(placedInstances: THREE.Object3D[] = []): number {
  return placedInstances.reduce((sum, inst) => {
    const data = inst.userData as Partial<DeskSceneItemUserData>;
    return sum + (data?.price || 0);
  }, 0);
}

export function addSetupToCart(
  placedInstances: THREE.Object3D[] = [],
  cartManager?: CartManager | null
): SetupCartResult {
  if (!placedInstances.length || !cartManager) {
    return { totalItems: 0, uniqueProducts: 0, totalAmount: 0 };
  }

  // Count instances per productId
  const counts = new Map<number, number>();
  for (const inst of placedInstances) {
    const data = inst.userData as Partial<DeskSceneItemUserData>;
    const pId = data?.productId;
    if (pId) {
      counts.set(pId, (counts.get(pId) || 0) + 1);
    }
  }

  let totalItems = 0;
  let totalAmount = 0;

  for (const [productId, quantity] of counts.entries()) {
    const product = PRODUCTS.find((p) => p.id === productId);
    if (product) {
      cartManager.addItem(product, quantity);
      totalItems += quantity;
      totalAmount += product.price * quantity;
    }
  }

  return {
    totalItems,
    uniqueProducts: counts.size,
    totalAmount
  };
}
