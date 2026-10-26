import { useAppStore } from '../../store/appStore';

export default function StatusBar() {
  const { selectedSubTypeId, categories } = useAppStore();

  // Look up current sub-type name
  let subTypeName = '未选择';
  for (const cat of categories) {
    const sub = cat.subTypes.find(s => s.id === selectedSubTypeId);
    if (sub) {
      subTypeName = sub.name;
      break;
    }
  }

  return (
    <div
      className="flex items-center h-7 w-full px-4 bg-[var(--color-bg-tertiary)] border-t border-[var(--color-border)] shrink-0 text-[11px] text-[var(--color-text-tertiary)] gap-6"
    >
      <span>图表类型: {subTypeName}</span>
    </div>
  );
}
