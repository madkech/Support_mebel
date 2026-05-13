import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import {
  calculateWallCabinet,
  resolveBacksplashHeight,
  resolveCountertopUpstand,
  resolveHoodCabinetHeight,
  resolveWallCabinetDepth,
} from '../index.ts';

describe('wall cabinet rules', () => {
  it('gives manual depth priority over microwave and default depth', () => {
    assert.equal(resolveWallCabinetDepth({ userDepthMm: 320, hasBuiltInMicrowave: true }), 320);
    assert.equal(resolveWallCabinetDepth({ hasBuiltInMicrowave: true }), 330);
    assert.equal(resolveWallCabinetDepth({}), 300);
  });

  it('resolves backsplash and countertop upstand from backsplash type', () => {
    assert.equal(resolveBacksplashHeight({ backsplashType: 'client_tile_existing' }), 600);
    assert.equal(resolveBacksplashHeight({ backsplashType: 'our_ldsp_backsplash' }), 580);
    assert.equal(resolveBacksplashHeight({ userBacksplashHeightMm: 610 }), 610);
    assert.equal(resolveCountertopUpstand({ backsplashType: 'client_tile_planned' }), false);
    assert.equal(resolveCountertopUpstand({ backsplashType: 'our_ldsp_backsplash' }), true);
    assert.equal(resolveCountertopUpstand({ userCountertopUpstand: false }), false);
  });

  it('calculates hood cabinet height over gas cooktop', () => {
    assert.equal(
      resolveHoodCabinetHeight({
        isHoodCabinet: true,
        cooktopType: 'gas',
        wallCabinetHeightMm: 720,
        backsplashHeightMm: 600,
      }),
      570,
    );
  });

  it('calculates parts for a standard cabinet with recessed lighting', () => {
    const cabinet = calculateWallCabinet({
      id: 'upper-1',
      input: {
        widthMm: 600,
        hasRecessedLighting: true,
      },
      defaultHeightMm: 720,
      defaultDepthMm: 300,
      backsplashHeightMm: 600,
      cooktopType: 'none',
    });

    assert.equal(cabinet.construction.topFullWidth, false);
    assert.equal(cabinet.construction.bottomFullWidth, true);
    assert.deepEqual(
      cabinet.parts.map((part) => [part.kind, part.quantity, part.widthMm, part.depthMm]),
      [
        ['side', 2, 704, 300],
        ['top', 1, 568, 300],
        ['bottom', 1, 600, 300],
        ['facade', 1, 597, 717],
      ],
    );
  });

  it('uses full-width top for cabinets taller than 850 mm', () => {
    const cabinet = calculateWallCabinet({
      id: 'upper-1',
      input: {
        widthMm: 600,
      },
      defaultHeightMm: 900,
      defaultDepthMm: 300,
      backsplashHeightMm: 600,
      cooktopType: 'none',
    });

    assert.equal(cabinet.construction.topFullWidth, true);
    assert.equal(cabinet.parts.find((part) => part.kind === 'side')?.widthMm, 884);
    assert.equal(cabinet.parts.find((part) => part.kind === 'top')?.widthMm, 600);
  });
});
