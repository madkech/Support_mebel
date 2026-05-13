import { calculateKitchenProject } from '../../src/calculators/kitchenCalculator.ts';
import type { KitchenProjectInput, KitchenProject } from '../../src/types/kitchen.ts';
import type {
  BaseCabinet,
  WallCabinet,
  CabinetPart,
  CabinetPartKind,
  CabinetMaterial,
  Drawer,
  HardwareItem,
  AppliedRule,
  BaseCabinetInput,
  WallCabinetInput,
  FacadeMaterial,
  FacadeThickness,
  VitrineSpec,
  VitrineGlassType,
  VitrineProfileType,
  VitrineGlassColor,
} from '../../src/types/kitchen.ts';

export { calculateKitchenProject as calculate };
export type {
  KitchenProjectInput,
  KitchenProject,
  BaseCabinet,
  WallCabinet,
  CabinetPart,
  CabinetPartKind,
  CabinetMaterial,
  Drawer,
  HardwareItem,
  AppliedRule,
  BaseCabinetInput,
  WallCabinetInput,
  FacadeMaterial,
  FacadeThickness,
  VitrineSpec,
  VitrineGlassType,
  VitrineProfileType,
  VitrineGlassColor,
};
