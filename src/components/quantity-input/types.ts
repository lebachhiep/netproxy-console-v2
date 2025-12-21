export interface QuantityInputProps {
  stepper?: number;
  value: number;
  min?: number;
  max?: number;
  onValueChange?: (quantity: number) => void;
}
