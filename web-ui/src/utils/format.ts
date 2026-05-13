import { partKindLabels, materialLabels, drawerSystemLabels } from './labels.ts';
import type { CabinetPart, CabinetPartKind, CabinetMaterial, Drawer, HardwareItem } from '../bridge.ts';

export function mm(value: number): string {
  return `${value} мм`;
}

export function dim(value: number | undefined, fallback = '—'): string {
  return value !== undefined ? `${value} мм` : fallback;
}

export function formatBoolean(value: boolean): string {
  return value ? 'Да' : 'Нет';
}

export function formatFacadeSide(side: string): string {
  const map: Record<string, string> = {
    none: 'Нет',
    left: 'Слева',
    right: 'Справа',
    both: 'С обеих сторон',
  };
  return map[side] ?? side;
}

export function formatPart(part: CabinetPart): string {
  const label = partKindLabels[part.kind] ?? part.kind;
  const mat = materialLabels[part.material] ?? part.material;
  return `${label}: ${part.quantity} шт., ${part.widthMm}×${part.depthMm} мм, ${mat} ${part.thicknessMm} мм`;
}

export function formatHardware(item: HardwareItem): string {
  const length = item.lengthMm !== undefined ? ` ${item.lengthMm} мм` : '';
  return `${item.name}${length}: ${item.quantity} компл.`;
}

export function renderEdgeBanding(part: CabinetPart): string {
  if (part.edgeBanding.length === 0) return 'без кромки';
  return part.edgeBanding
    .map((e) => {
      const sideLabels: Record<string, string> = {
        front: 'перед',
        back: 'зад',
        left: 'лево',
        right: 'право',
      };
      return `${sideLabels[e.side] ?? e.side} ${e.thicknessMm} мм ${e.material}`;
    })
    .join(', ');
}

export function cabinetMiniLabel(type: string): string {
  const map: Record<string, string> = {
    sink: 'Мойка',
    dishwasher: 'ПММ',
    cooktop: 'Вароч.',
    drawers: 'Ящики',
    standard: 'Станд.',
    dish_dryer: 'Сушка',
    hood: 'Вытяжка',
    built_in_microwave: 'СВЧ',
  };
  return map[type] ?? type;
}
