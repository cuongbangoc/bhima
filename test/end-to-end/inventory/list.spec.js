/* global element, by */

const GU = require('../shared/GridUtils');
const FU = require('../shared/FormUtils');
const helpers = require('../shared/helpers');
const components = require('../shared/components');

const Filters = require('../shared/components/bhFilters');

describe('Inventory List', () => {
  // navigate to the page
  before(() => helpers.navigate('#/inventory'));
  const filters = new Filters();
  const currentDate = new Date();
  const uniqueIdentifier = currentDate.getTime().toString();

  // inventory list items
  const metadata = {
    code  : uniqueIdentifier,
    text  : '[E2E] Inventory Article',
    price : 7.57,
    group : 'Injectable',
    type  : 'Article',
    unit  : 'Act',
    unit_weight : 1,
    unit_volume : 1,
  };

  const metadataUpdate = {
    code : uniqueIdentifier.concat('_updated'),
    text : '[E2E] Inventory Article Updated',
    price : 7.77,
    group : 'Injectable',
    type  : 'Service',
    unit  : 'Pill',
    unit_weight : 7,
    unit_volume : 7,
  };

  const metadataSearch = {
    label : 'Quinine',
    group : 'Injectable',
    type  : 'Article',
  };

  it('successfully creates a new inventory item (metadata)', () => {
    FU.buttons.create();
    FU.input('$ctrl.item.label', metadata.text);
    FU.input('$ctrl.item.code', metadata.code);
    element(by.model('$ctrl.item.consumable')).click();
    FU.input('$ctrl.item.price', metadata.price);
    FU.select('$ctrl.item.group_uuid', metadata.group);
    FU.select('$ctrl.item.type_id', metadata.type);
    FU.select('$ctrl.item.unit_id', metadata.unit);
    FU.input('$ctrl.item.unit_weight', metadata.unit_weight);
    FU.input('$ctrl.item.unit_volume', metadata.unit_volume);
    FU.modal.submit();
    components.notification.hasSuccess();
  });

  const CODE_TO_UPDATE = '100001';
  it('successfully updates an existing inventory item (metadata)', () => {
    const row = $(`[data-row-item="${CODE_TO_UPDATE}"]`);
    row.$('[data-method="action"]').click();
    element(by.css(`[data-edit-metadata="${CODE_TO_UPDATE}"]`)).click();

    FU.input('$ctrl.item.label', metadataUpdate.text);
    FU.input('$ctrl.item.code', metadataUpdate.code);
    element(by.model('$ctrl.item.consumable')).click();
    FU.input('$ctrl.item.price', metadataUpdate.price);
    FU.select('$ctrl.item.group_uuid', metadataUpdate.group);
    FU.select('$ctrl.item.type_id', metadataUpdate.type);
    FU.select('$ctrl.item.unit_id', metadataUpdate.unit);
    FU.input('$ctrl.item.unit_weight', metadataUpdate.unit_weight);
    FU.input('$ctrl.item.unit_volume', metadataUpdate.unit_volume);

    FU.modal.submit();
    components.notification.hasSuccess();
  });

  // demonstrates that filtering works
  it(`should find one Inventory with Label "${metadataSearch.label}"`, () => {
    element(by.id('research')).click();

    FU.input('ModalCtrl.searchQueries.text', metadataSearch.label);
    FU.modal.submit();

    GU.expectRowCount('inventoryListGrid', 2);
    filters.resetFilters();
  });


  // demonstrates that filtering works
  it(`should find three Inventory with Group "${metadataSearch.group}" and Type "${metadataSearch.type}"`, () => {
    element(by.id('research')).click();

    components.inventoryGroupSelect.set(metadataSearch.group);
    components.inventoryTypeSelect.set(metadataSearch.type);
    FU.modal.submit();

    GU.expectRowCount('inventoryListGrid', 1);
    filters.resetFilters();
  });


  it('dont creates a new inventory item (metadata) for invalid data', () => {
    FU.buttons.create();
    FU.input('$ctrl.item.label', metadata.text);
    FU.input('$ctrl.item.unit_weight', metadata.unit_weight);
    FU.input('$ctrl.item.unit_volume', metadata.unit_volume);
    FU.modal.submit();

    // check validations
    FU.validation.ok('$ctrl.item.label');
    FU.validation.ok('$ctrl.item.unit_weight');
    FU.validation.ok('$ctrl.item.unit_volume');
    FU.validation.error('$ctrl.item.code');
    FU.validation.error('$ctrl.item.price');
    FU.validation.error('$ctrl.item.group_uuid');
    FU.validation.error('$ctrl.item.type_id');
    FU.validation.error('$ctrl.item.unit_id');
    FU.buttons.cancel();
  });
});
