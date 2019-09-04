/*
 * SPDX-License-Identifier: Apache-2.0
 */

import { Context, Contract, Info, Returns, Transaction } from 'fabric-contract-api';
import { Shop } from './shop';

@Info({title: 'ShopContract', description: 'My Smart Contract' })
export class ShopContract extends Contract {

    @Transaction(false)
    @Returns('boolean')
    public async shopExists(ctx: Context, shopId: string): Promise<boolean> {
        const buffer = await ctx.stub.getState(shopId);
        return (!!buffer && buffer.length > 0);
    }

    @Transaction()
    public async createShop(ctx: Context, shopId: string, value: string): Promise<void> {
        const exists = await this.shopExists(ctx, shopId);
        if (exists) {
            throw new Error(`The shop ${shopId} already exists`);
        }
        const shop = new Shop();
        shop.value = value;
        const buffer = Buffer.from(JSON.stringify(shop));
        await ctx.stub.putState(shopId, buffer);
    }

    @Transaction(false)
    @Returns('Shop')
    public async readShop(ctx: Context, shopId: string): Promise<Shop> {
        const exists = await this.shopExists(ctx, shopId);
        if (!exists) {
            throw new Error(`The shop ${shopId} does not exist`);
        }
        const buffer = await ctx.stub.getState(shopId);
        const shop = JSON.parse(buffer.toString()) as Shop;
        return shop;
    }

    @Transaction()
    public async updateShop(ctx: Context, shopId: string, newValue: string): Promise<void> {
        const exists = await this.shopExists(ctx, shopId);
        if (!exists) {
            throw new Error(`The shop ${shopId} does not exist`);
        }
        const shop = new Shop();
        shop.value = newValue;
        const buffer = Buffer.from(JSON.stringify(shop));
        await ctx.stub.putState(shopId, buffer);
    }

    @Transaction()
    public async deleteShop(ctx: Context, shopId: string): Promise<void> {
        const exists = await this.shopExists(ctx, shopId);
        if (!exists) {
            throw new Error(`The shop ${shopId} does not exist`);
        }
        await ctx.stub.deleteState(shopId);
    }

}
