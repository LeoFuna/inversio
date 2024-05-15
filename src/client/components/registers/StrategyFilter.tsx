import { Label } from '@/components/ui/label';
import DebouncedInput from '../core/DebouncedInput';

export default function StrategyFilter({
  value,
  onChange,
}: {
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <div className="mb-4 flex items-center gap-3">
      <Label htmlFor="search">Buscar</Label>
      <DebouncedInput
        value={value ?? ''}
        onChange={(value) => onChange(String(value))}
        className="w-2/6"
        placeholder="Digite nome ou descrição"
        type="search"
      />
    </div>
  );
}
