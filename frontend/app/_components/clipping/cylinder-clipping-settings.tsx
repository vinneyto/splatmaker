type Props = {
  radius: number;
  height: number;
  onRadiusChange: (radius: number) => void;
  onHeightChange: (height: number) => void;
};

export function CylinderClippingSettings({
  radius,
  height,
  onRadiusChange,
  onHeightChange,
}: Props) {
  return (
    <div className="w-56 rounded-lg border border-white/20 bg-black/85 p-3 text-white shadow-xl">
      <label className="mb-3 block text-xs">
        Radius: {radius.toFixed(2)}m
        <input
          type="range"
          min={0.1}
          max={3}
          step={0.01}
          value={radius}
          onChange={(event) => onRadiusChange(Number(event.target.value))}
          className="mt-1 w-full"
        />
      </label>

      <label className="block text-xs">
        Height: {height.toFixed(2)}m
        <input
          type="range"
          min={0.2}
          max={8}
          step={0.01}
          value={height}
          onChange={(event) => onHeightChange(Number(event.target.value))}
          className="mt-1 w-full"
        />
      </label>
    </div>
  );
}
