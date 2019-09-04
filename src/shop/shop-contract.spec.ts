/*
 * SPDX-License-Identifier: Apache-2.0
 */

import { Context } from 'fabric-contract-api';
import { ChaincodeStub, ClientIdentity } from 'fabric-shim';
import { ShopContract } from '..';

import * as chai from 'chai';
import * as chaiAsPromised from 'chai-as-promised';
import * as sinon from 'sinon';
import * as sinonChai from 'sinon-chai';
import winston = require('winston');

chai.should();
chai.use(chaiAsPromised);
chai.use(sinonChai);

class TestContext implements Context {
    public stub: sinon.SinonStubbedInstance<ChaincodeStub> = sinon.createStubInstance(ChaincodeStub);
    public clientIdentity: sinon.SinonStubbedInstance<ClientIdentity> = sinon.createStubInstance(ClientIdentity);
    public logging = {
        getLogger: sinon.stub().returns(sinon.createStubInstance(winston.createLogger().constructor)),
        setLevel: sinon.stub(),
     };
}

describe('ShopContract', () => {

    let contract: ShopContract;
    let ctx: TestContext;

    beforeEach(() => {
        contract = new ShopContract();
        ctx = new TestContext();
        ctx.stub.getState.withArgs('1001').resolves(Buffer.from('{"value":"shop 1001 value"}'));
        ctx.stub.getState.withArgs('1002').resolves(Buffer.from('{"value":"shop 1002 value"}'));
    });

    describe('#shopExists', () => {

        it('should return true for a shop', async () => {
            await contract.shopExists(ctx, '1001').should.eventually.be.true;
        });

        it('should return false for a shop that does not exist', async () => {
            await contract.shopExists(ctx, '1003').should.eventually.be.false;
        });

    });

    describe('#createShop', () => {

        it('should create a shop', async () => {
            await contract.createShop(ctx, '1003', 'shop 1003 value');
            ctx.stub.putState.should.have.been.calledOnceWithExactly('1003', Buffer.from('{"value":"shop 1003 value"}'));
        });

        it('should throw an error for a shop that already exists', async () => {
            await contract.createShop(ctx, '1001', 'myvalue').should.be.rejectedWith(/The shop 1001 already exists/);
        });

    });

    describe('#readShop', () => {

        it('should return a shop', async () => {
            await contract.readShop(ctx, '1001').should.eventually.deep.equal({ value: 'shop 1001 value' });
        });

        it('should throw an error for a shop that does not exist', async () => {
            await contract.readShop(ctx, '1003').should.be.rejectedWith(/The shop 1003 does not exist/);
        });

    });

    describe('#updateShop', () => {

        it('should update a shop', async () => {
            await contract.updateShop(ctx, '1001', 'shop 1001 new value');
            ctx.stub.putState.should.have.been.calledOnceWithExactly('1001', Buffer.from('{"value":"shop 1001 new value"}'));
        });

        it('should throw an error for a shop that does not exist', async () => {
            await contract.updateShop(ctx, '1003', 'shop 1003 new value').should.be.rejectedWith(/The shop 1003 does not exist/);
        });

    });

    describe('#deleteShop', () => {

        it('should delete a shop', async () => {
            await contract.deleteShop(ctx, '1001');
            ctx.stub.deleteState.should.have.been.calledOnceWithExactly('1001');
        });

        it('should throw an error for a shop that does not exist', async () => {
            await contract.deleteShop(ctx, '1003').should.be.rejectedWith(/The shop 1003 does not exist/);
        });

    });

});
