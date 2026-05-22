type Props = {
  radius: number;
  height: number;
  onRadiusChange: (radius: number) => void;
  onHeightChange: (height: number) => void;
  onApply: () => void;
  onCopyJson: () => void;
};

export function CylinderClippingSettings({
  radius,
  height,
  onRadiusChange,
  onHeightChange,
  onApply,
  onCopyJson,
}: Props) {
  return (
    <div className="w-48 rounded-md border border-white/20 bg-black/85 p-2 text-white shadow-xl">
      <label className="mb-2 block text-[11px] leading-tight">
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

      <label className="mb-2 block text-[11px] leading-tight">
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

      <div className="flex items-center gap-1">
        <button
          type="button"
          onClick={onApply}
          className="h-6 rounded border border-emerald-400/70 bg-emerald-500/20 px-2 text-[10px] font-medium text-emerald-100 hover:bg-emerald-500/30"
          title="Apply clipping"
        >
          Apply
        </button>

        <button
          type="button"
          onClick={onCopyJson}
          className="h-6 rounded border border-white/35 bg-white/10 px-2 text-[10px] font-medium text-white hover:bg-white/20"
          title="Copy clipping JSON"
        >
          Copy JSON
        </button>
      </div>
    </div>
  );
}
