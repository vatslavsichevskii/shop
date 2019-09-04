/*
 * SPDX-License-Identifier: Apache-2.0
 */

import { Object, Property } from 'fabric-contract-api';

@Object()
export class Category {

    @Property()
    public name?: string;

    @Property()
    public slug?: string;
}
