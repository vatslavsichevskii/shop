/*
 * SPDX-License-Identifier: Apache-2.0
 */

import { ShopContract } from './shop/shop-contract';
export { ShopContract } from './shop/shop-contract';
import { CategoryContract } from './category/category-contracts';
export { CategoryContract } from './category/category-contracts';

export const contracts: any[] = [ ShopContract, CategoryContract];
