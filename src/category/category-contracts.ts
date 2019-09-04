/*
 * SPDX-License-Identifier: Apache-2.0
 */

import { Context, Contract, Info, Returns, Transaction } from 'fabric-contract-api';
import { Category } from './category';

@Info({title: 'CategoryContract', description: 'My Smart Contract' })
export class CategoryContract extends Contract {

    @Transaction(false)
    @Returns('boolean')
    public async categoryExists(ctx: Context, categoryId: string): Promise<boolean> {
        const buffer = await ctx.stub.getState(categoryId);
        return (!!buffer && buffer.length > 0);
    }

    @Transaction()
    public async createCategory(ctx: Context, categoryId: string, name: string, slug: string): Promise<void> {
        const exists = await this.categoryExists(ctx, categoryId);
        if (exists) {
            throw new Error(`The shop ${categoryId} already exists`);
        }
        const category = new Category();
        category.name = name;
        category.slug = slug;
        const buffer = Buffer.from(JSON.stringify(category));
        await ctx.stub.putState(categoryId, buffer);
    }

    @Transaction(false)
    @Returns('Category')
    public async readCategory(ctx: Context, categoryId: string): Promise<Category> {
        const exists = await this.categoryExists(ctx, categoryId);
        if (!exists) {
            throw new Error(`The shop ${categoryId} does not exist`);
        }
        const buffer = await ctx.stub.getState(categoryId);
        const category = JSON.parse(buffer.toString()) as Category;
        return category;
    }

    @Transaction()
    public async updateCategory(ctx: Context, categoryId: string, newName?: string, newSlug?: string): Promise<void> {
        const exists = await this.categoryExists(ctx, categoryId);
        if (!exists) {
            throw new Error(`The shop ${categoryId} does not exist`);
        }
        const category = new Category();
        if (newName) {
            category.name = newName;
        }
        if (newSlug) {
            category.slug = newSlug;
        }
        const buffer = Buffer.from(JSON.stringify(category));
        await ctx.stub.putState(categoryId, buffer);
    }

    @Transaction()
    public async deleteCategory(ctx: Context, categoryId: string): Promise<void> {
        const exists = await this.categoryExists(ctx, categoryId);
        if (!exists) {
            throw new Error(`The shop ${categoryId} does not exist`);
        }
        await ctx.stub.deleteState(categoryId);
    }

}
