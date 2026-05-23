type LocalSplatDropOverlayProps = {
  isVisible: boolean;
};

export function LocalSplatDropOverlay({ isVisible }: LocalSplatDropOverlayProps) {
  if (!isVisible) {
    return null;
  }

  return (
    <div className="pointer-events-none fixed inset-0 z-50 flex items-center justify-center bg-blue-50/80 p-6">
      <div className="w-full rounded-2xl border-2 border-dashed border-blue-500 bg-white/90 px-6 py-10 text-center text-base font-medium text-blue-700 shadow-sm backdrop-blur-sm">
        Drop .ply/.spz/.sog file to open it in local viewer page.
      </div>
    </div>
  );
}
