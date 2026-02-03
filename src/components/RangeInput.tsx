type Props = {
  value: string;
  onChange: (value: string) => void;
  min: number;
  max: number;
  step?: number;
  className?: string;
};

const RangeInput = ({ value, onChange, min, max, step = 1, className }: Props) => {
  return (
    <input
      className={`h-2 my-3 bg-neutral-800 rounded-full appearance-none cursor-pointer ${className}`}
      type="range"
      min={min}
      max={max}
      step={step}
      value={value}
      onChange={e => onChange(e.target.value)}
    />
  );
};

export default RangeInput;
