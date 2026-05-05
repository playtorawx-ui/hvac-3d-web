import { HVACComponent } from '../lib/types/hvac';
import { useHVACStore } from '../lib/store/hvac-store';
import { getComponentById } from '../lib/data/component-library';

interface ComponentPropertyEditorProps {
  component: HVACComponent;
}

export function ComponentPropertyEditor({ component }: ComponentPropertyEditorProps) {
  const { updateComponent, deleteComponent } = useHVACStore();
  const componentType = getComponentById(component.type);

  const handlePropertyChange = (key: string, value: any) => {
    updateComponent(component.id, {
      properties: {
        ...component.properties,
        [key]: value,
      },
    });
  };

  const handlePositionChange = (axis: 'x' | 'y' | 'z', value: number) => {
    updateComponent(component.id, {
      position: {
        ...component.position,
        [axis]: value,
      },
    });
  };

  const handleDelete = () => {
    if (confirm(`Delete ${component.name}?`)) {
      deleteComponent(component.id);
    }
  };

  return (
    <div className="w-80 bg-surface border-l border-border flex flex-col overflow-hidden">
      {/* Header */}
      <div className="p-4 border-b border-border">
        <h2 className="text-lg font-bold text-foreground">Properties</h2>
        <p className="text-xs text-muted mt-1">{component.name}</p>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {/* Component Type */}
        <div>
          <label className="block text-xs font-semibold text-foreground mb-2">Type</label>
          <p className="text-sm text-muted">{componentType?.category || 'Unknown'}</p>
        </div>

        {/* Position */}
        <div>
          <label className="block text-xs font-semibold text-foreground mb-2">Position</label>
          <div className="space-y-2">
            {(['x', 'y', 'z'] as const).map((axis) => (
              <div key={axis} className="flex items-center gap-2">
                <label className="w-6 text-xs font-semibold text-muted">{axis.toUpperCase()}</label>
                <input
                  type="number"
                  value={component.position[axis]}
                  onChange={(e) => handlePositionChange(axis, parseFloat(e.target.value))}
                  step="0.1"
                  className="flex-1 px-2 py-1 border border-border rounded text-xs focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
            ))}
          </div>
        </div>

        {/* Properties */}
        {Object.entries(component.properties).length > 0 && (
          <div>
            <label className="block text-xs font-semibold text-foreground mb-2">Component Properties</label>
            <div className="space-y-2">
              {Object.entries(component.properties).map(([key, value]) => (
                <div key={key}>
                  <label className="block text-xs text-muted mb-1">{key}</label>
                  <input
                    type="text"
                    value={String(value)}
                    onChange={(e) => handlePropertyChange(key, e.target.value)}
                    className="w-full px-2 py-1 border border-border rounded text-xs focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Metadata */}
        <div className="text-xs text-muted space-y-1">
          <p>ID: {component.id}</p>
          <p>Created: {new Date(component.createdAt).toLocaleDateString()}</p>
        </div>
      </div>

      {/* Footer */}
      <div className="p-4 border-t border-border">
        <button
          onClick={handleDelete}
          className="w-full px-4 py-2 bg-error text-white rounded-lg hover:opacity-90 transition text-sm font-semibold"
        >
          Delete Component
        </button>
      </div>
    </div>
  );
}
