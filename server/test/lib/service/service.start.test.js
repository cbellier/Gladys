const { expect } = require('chai');
const sinon = require('sinon');

const { fake, assert } = sinon;

const Service = require('../../../lib/service');
const StateManager = require('../../../lib/state');
const db = require('../../../models');
const { SERVICE_STATUS } = require('../../../utils/constants');

const services = {};
const serviceName = 'fake-service';

describe('service.start', () => {
  let serviceImpl;
  let stateManager;
  let service;

  beforeEach(async () => {
    serviceImpl = {
      selector: serviceName,
      name: serviceName,
      version: '0.1.0',
    };

    stateManager = new StateManager();
    stateManager.setState('service', serviceName, serviceImpl);
    service = new Service(services, stateManager);

    await db.Service.create(serviceImpl);
  });

  afterEach(async () => {
    const serviceInDb = await db.Service.findOne({
      where: {
        name: serviceName,
      },
    });

    await serviceInDb.destroy();

    sinon.reset();
  });

  it('should start a service, and set status to READY', async () => {
    serviceImpl.start = fake.resolves(null);

    await service.start(serviceName);

    const serviceInDb = await db.Service.findOne({
      where: {
        name: serviceName,
      },
    });

    expect(serviceInDb.status).eq(SERVICE_STATUS.READY);
    assert.calledOnce(serviceImpl.start);
  });

  it('should fail starting a service, and set status to ERROR', async () => {
    serviceImpl.start = fake.rejects(null);

    await service.start(serviceName);

    const serviceInDb = await db.Service.findOne({
      where: {
        name: serviceName,
      },
    });

    expect(serviceInDb.status).eq(SERVICE_STATUS.ERROR);
    assert.calledOnce(serviceImpl.start);
  });

  it('should not start service, and not change status', async () => {
    serviceImpl.start = fake.resolves(null);

    let serviceInDb = await db.Service.findOne({
      where: {
        name: serviceName,
      },
    });
    serviceInDb.update({ status: SERVICE_STATUS.LOADING });

    await service.start(serviceName);

    serviceInDb = await db.Service.findOne({
      where: {
        name: serviceName,
      },
    });

    expect(serviceInDb.status).eq(SERVICE_STATUS.LOADING);
    assert.notCalled(serviceImpl.start);
  });
});
