import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import { calculateKitchenProject } from '../index.ts';

describe('kitchen calculator', () => {
  it('matches the MVP acceptance scenario from the rules file', () => {
    const project = calculateKitchenProject({
      layoutType: 'straight',
      wallLengthMm: 2400,
      ceilingHeightMm: 2600,
      wallCabinetDefaultHeightMm: 720,
      backsplashType: 'client_tile_existing',
      cooktopType: 'gas',
      hasHoodCabinet: true,
      hasBuiltInMicrowave: true,
      hasRecessedLighting: true,
      autoModuleWidthMm: 600,
    });

    assert.equal(project.backsplashHeightMm, 600);
    assert.equal(project.countertopUpstand, false);
    assert.equal(project.baseCabinetDefaultHeightMm, 722);
    assert.deepEqual(project.countertop, {
      lengthMm: 2400,
      depthMm: 600,
      thicknessMm: 38,
    });
    assert.equal(project.unresolvedWidthMm, 0);
    assert.equal(project.ceilingCompletionType, 'filler');
    assert.equal(project.ceilingCompletionMm, 420);
    assert.deepEqual(project.baseCabinets.map((cabinet) => cabinet.id), [
      'lower-1',
      'lower-2',
      'lower-3',
      'lower-4',
    ]);
    assert.deepEqual(project.wallCabinets.map((cabinet) => cabinet.id), [
      'upper-1',
      'upper-2',
      'upper-3',
      'upper-4',
    ]);
    assert.deepEqual(
      project.baseCabinets.map((cabinet) => [
        cabinet.type,
        cabinet.widthMm,
        cabinet.heightMm,
        cabinet.depthMm,
      ]),
      [
        ['sink', 600, 722, 500],
        ['standard', 600, 722, 510],
        ['cooktop', 600, 722, 510],
        ['standard', 600, 722, 510],
      ],
    );
    assert.deepEqual(
      project.wallCabinets.map((cabinet) => [
        cabinet.type,
        cabinet.widthMm,
        cabinet.heightMm,
        cabinet.depthMm,
      ]),
      [
        ['dish_dryer', 600, 720, 330],
        ['standard', 600, 720, 330],
        ['hood', 600, 570, 330],
        ['built_in_microwave', 600, 720, 330],
      ],
    );

    assert.deepEqual(
      project.wallCabinets[0].parts.map((part) => [
        part.kind,
        part.quantity,
        part.widthMm,
        part.depthMm,
      ]),
      [
        ['side', 2, 704, 330],
        ['top', 1, 568, 330],
        ['bottom', 1, 600, 330],
        ['facade', 1, 597, 717],
      ],
    );

    assert.deepEqual(
      project.wallCabinets[2].parts.map((part) => [
        part.kind,
        part.quantity,
        part.widthMm,
        part.depthMm,
      ]),
      [
        ['side', 2, 554, 330],
        ['top', 1, 568, 330],
        ['bottom', 1, 600, 330],
        ['facade', 1, 597, 567],
      ],
    );

    assert.deepEqual(
      project.wallCabinets[3].parts.map((part) => [
        part.kind,
        part.quantity,
        part.widthMm,
        part.depthMm,
      ]),
      [
        ['side', 2, 704, 330],
        ['top', 1, 568, 330],
        ['bottom', 1, 600, 330],
        ['facade', 1, 597, 717],
      ],
    );
  });

  it('uses an external bottom for lower modules by default', () => {
    const project = calculateKitchenProject({
      layoutType: 'straight',
      wallLengthMm: 600,
      hasSinkCabinet: false,
    });

    assert.deepEqual(
      project.baseCabinets[0].parts.map((part) => [
        part.kind,
        part.quantity,
        part.widthMm,
        part.depthMm,
      ]),
      [
        ['side', 2, 706, 510],
        ['bottom', 1, 600, 510],
        ['front_rail', 1, 568, 100],
        ['back_rail', 1, 568, 100],
        ['shelf', 1, 568, 510],
        ['facade', 1, 597, 719],
      ],
    );
  });

  it('uses 500 mm depth for sink lower module by default', () => {
    const project = calculateKitchenProject({
      layoutType: 'straight',
      wallLengthMm: 600,
    });

    assert.equal(project.baseCabinets[0].depthMm, 500);
    assert.deepEqual(
      project.baseCabinets[0].parts.map((part) => [part.kind, part.widthMm, part.depthMm]),
      [
        ['side', 706, 500],
        ['bottom', 600, 500],
        ['front_rail', 568, 100],
        ['back_rail', 568, 100],
        ['facade', 597, 719],
      ],
    );
  });

  it('adds one shelf to a standard lower module by default', () => {
    const project = calculateKitchenProject({
      layoutType: 'straight',
      wallLengthMm: 1200,
      hasSinkCabinet: false,
    });

    const shelf = project.baseCabinets[0].parts.find((part) => part.kind === 'shelf');
    assert.deepEqual(
      shelf && [shelf.quantity, shelf.widthMm, shelf.depthMm],
      [1, 568, 510],
    );
  });

  it('does not add shelves to special lower modules even when a global shelf count is set', () => {
    const project = calculateKitchenProject({
      layoutType: 'straight',
      wallLengthMm: 3000,
      cooktopType: 'electric',
      hasDishwasher: true,
      hasDrawersCabinet: true,
      shelfCount: 1,
    });

    assert.deepEqual(
      project.baseCabinets.map((cabinet) => [
        cabinet.type,
        cabinet.parts.some((part) => part.kind === 'shelf'),
      ]),
      [
        ['sink', false],
        ['dishwasher', false],
        ['cooktop', false],
        ['drawers', false],
        ['standard', true],
      ],
    );
  });

  it('uses full-height facade side and reduced bottom for a left facade side', () => {
    const project = calculateKitchenProject({
      layoutType: 'straight',
      wallLengthMm: 600,
      manualBaseCabinets: [{ widthMm: 600, facadeSide: 'left' }],
    });

    assert.deepEqual(
      project.baseCabinets[0].parts.map((part) => [
        part.name,
        part.kind,
        part.quantity,
        part.widthMm,
        part.depthMm,
      ]),
      [
        ['Left side panel', 'side', 1, 722, 510],
        ['Right side panel', 'side', 1, 706, 510],
        ['Bottom panel', 'bottom', 1, 584, 510],
        ['Front plank', 'front_rail', 1, 568, 100],
        ['Back plank', 'back_rail', 1, 568, 100],
        ['Shelf', 'shelf', 1, 568, 510],
        ['Фасад', 'facade', 1, 597, 719],
      ],
    );
  });

  it('calculates a ball bearing drawer from facade height', () => {
    const project = calculateKitchenProject({
      layoutType: 'straight',
      wallLengthMm: 600,
      manualBaseCabinets: [
        {
          type: 'drawers',
          widthMm: 600,
          drawerSystem: 'ball_bearing_guides',
          drawerFacadeHeightMm: 180,
        },
      ],
    });

    const drawer = project.baseCabinets[0].drawers[0];
    assert.equal(project.baseCabinets[0].parts.some((part) => part.kind === 'shelf'), false);
    assert.deepEqual([drawer.widthMm, drawer.depthMm, drawer.heightMm], [542, 500, 120]);
    assert.deepEqual(
      drawer.parts.map((part) => [
        part.kind,
        part.quantity,
        part.widthMm,
        part.depthMm,
        part.material,
        part.thicknessMm,
      ]),
      [
        ['drawer_side', 2, 500, 120, 'ldsp', 16],
        ['drawer_front', 1, 510, 120, 'ldsp', 16],
        ['drawer_back', 1, 510, 120, 'ldsp', 16],
        ['drawer_bottom', 1, 539, 497, 'hdf', 3],
      ],
    );
    assert.deepEqual(drawer.hardware, [
      { name: 'Шариковые направляющие', quantity: 1, lengthMm: 500 },
    ]);
  });

  it('uses 900 mm base total height when Gola profile is planned', () => {
    const project = calculateKitchenProject({
      layoutType: 'straight',
      wallLengthMm: 600,
      hasGolaProfile: true,
    });

    assert.equal(project.baseTotalHeightMm, 900);
    assert.equal(project.baseCabinetDefaultHeightMm, 762);
  });

  it('uses 920 mm base total height when Gola profile and dishwasher are planned', () => {
    const project = calculateKitchenProject({
      layoutType: 'straight',
      wallLengthMm: 1200,
      hasGolaProfile: true,
      hasDishwasher: true,
    });

    assert.equal(project.baseTotalHeightMm, 920);
    assert.equal(project.baseCabinetDefaultHeightMm, 782);
    assert.equal(project.baseCabinets[1].type, 'dishwasher');
    assert.deepEqual(
      project.baseCabinets[1].parts.map((part) => [
        part.kind,
        part.quantity,
        part.widthMm,
        part.depthMm,
      ]),
      [['facade', 1, 597, 779]],
    );
  });

  it('keeps a planned dishwasher as appliance space without a base cabinet carcass', () => {
    const project = calculateKitchenProject({
      layoutType: 'straight',
      wallLengthMm: 1200,
      hasDishwasher: true,
    });

    const dishwasher = project.baseCabinets[1];
    assert.equal(dishwasher.type, 'dishwasher');
    assert.equal(dishwasher.shelfCount, 0);
    assert.equal(dishwasher.drawers.length, 0);
    assert.deepEqual(
      dishwasher.parts.map((part) => [part.name, part.kind, part.widthMm, part.depthMm]),
      [['Фасад посудомойки', 'facade', 597, 719]],
    );
  });

  it('reports an unresolved remainder when the wall is not divisible by the module width', () => {
    const project = calculateKitchenProject({
      layoutType: 'straight',
      wallLengthMm: 2500,
    });

    assert.equal(project.wallCabinets.length, 4);
    assert.equal(project.unresolvedWidthMm, 100);
    assert.equal(project.remainderResolution, 'distribute');
    // Остаток 100 мм < 200 мм → распределён по модулям
    assert.equal(project.baseCabinets[0].widthMm, 625);
    assert.ok(
      project.appliedRules.some(
        (rule) => rule.code === 'smart-remainder-distribute-equal',
      ),
    );
  });

  it('uses manual cabinet plan when provided', () => {
    const project = calculateKitchenProject({
      layoutType: 'straight',
      wallLengthMm: 1000,
      manualWallCabinets: [
        { widthMm: 450 },
        {
          widthMm: 550,
          hasBuiltInMicrowave: true,
          overrides: { depthMm: 340 },
        },
      ],
    });

    assert.deepEqual(
      project.wallCabinets.map((cabinet) => [cabinet.widthMm, cabinet.depthMm]),
      [
        [450, 330],
        [550, 340],
      ],
    );
  });

  it('uses 330 mm as the default depth for all wall cabinets when a built-in microwave is planned', () => {
    const project = calculateKitchenProject({
      layoutType: 'straight',
      wallLengthMm: 2400,
      hasBuiltInMicrowave: true,
    });

    assert.deepEqual(
      project.wallCabinets.map((cabinet) => [cabinet.type, cabinet.depthMm]),
      [
        ['dish_dryer', 330],
        ['standard', 330],
        ['standard', 330],
        ['built_in_microwave', 330],
      ],
    );
    assert.equal(project.wallCabinetDefaultDepthMm, 330);
  });

  it('calculates wall cabinet height when room height includes stretch ceiling', () => {
    const project = calculateKitchenProject({
      layoutType: 'straight',
      wallLengthMm: 600,
      ceilingHeightMm: 2600,
      roomHeightIncludesStretchCeiling: true,
      ceilingFillerMm: 50,
      backsplashType: 'client_tile_existing',
    });

    assert.equal(project.wallCabinetDefaultHeightMm, 1090);
    assert.equal(project.ceilingCompletionType, 'filler');
    assert.equal(project.ceilingCompletionMm, 50);
  });

  it('calculates wall cabinet height when stretch ceiling is planned', () => {
    const project = calculateKitchenProject({
      layoutType: 'straight',
      wallLengthMm: 600,
      ceilingHeightMm: 2600,
      roomHeightIncludesStretchCeiling: false,
      stretchCeilingPlanned: true,
      stretchCeilingReserveMm: 80,
      ceilingFillerMm: 50,
      backsplashType: 'client_tile_existing',
    });

    assert.equal(project.wallCabinetDefaultHeightMm, 1010);
    assert.equal(project.ceilingCompletionType, 'filler');
    assert.equal(project.ceilingCompletionMm, 50);
    assert.equal(project.stretchCeilingReserveMm, 80);
  });

  it('calculates wall cabinet height without stretch ceiling and without filler', () => {
    const project = calculateKitchenProject({
      layoutType: 'straight',
      wallLengthMm: 600,
      ceilingHeightMm: 2600,
      roomHeightIncludesStretchCeiling: false,
      stretchCeilingPlanned: false,
      ceilingGapMm: 40,
      backsplashType: 'client_tile_existing',
    });

    assert.equal(project.wallCabinetDefaultHeightMm, 1100);
    assert.equal(project.ceilingCompletionType, 'gap');
    assert.equal(project.ceilingCompletionMm, 40);
  });
});
