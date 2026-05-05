import { useState } from 'react';
import { COMPONENT_LIBRARY } from '../lib/data/component-library';
import { useHVACStore } from '../lib/store/hvac-store';

export function ComponentSidebar() {
  const { addComponent } = useHVACStore();
  const [selectedCategory, setSelectedCategory] = useState<string>('compressor');

  const categories = ['compressor', 'condenser', 'evaporator', 'expansion', 'accumulator', 'filter', 'electrical'];
  const components = COMPONENT_LIBRARY.filter((c) => c.category === selectedCategory);

  const handleAddComponent = (componentType: typeof COMPONENT_LIBRARY[0]) => {
    addComponent({
      id: `component_${Date.now()}`,
      type: componentType.id,
      name: componentType.name,
      position: { x: Math.random() * 5 - 2.5, y: 0, z: Math.random() * 5 - 2.5 },
      scale: { x: 1, y: 1, z: 1 },
      rotation: { x: 0, y: 0, z: 0 },
      properties: componentType.properties,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    });
  };

  return (
    <div className="w-64 bg-surface border-r border-border flex flex-col overflow-hidden">
      {/* Header */}
      <div className="p-4 border-b border-border">
        <h2 className="text-lg font-bold text-foreground">Components</h2>
      </div>

      {/* Category Tabs */}
      <div className="flex flex-wrap gap-2 p-3 border-b border-border overflow-x-auto">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-3 py-1 rounded text-xs font-semibold whitespace-nowrap transition ${
              selectedCategory === cat
                ? 'bg-primary text-white'
                : 'bg-background text-foreground hover:bg-border'
            }`}
          >
            {cat.charAt(0).toUpperCase() + cat.slice(1)}
          </button>
        ))}
      </div>

      {/* Components List */}
      <div className="flex-1 overflow-y-auto p-3 space-y-2">
        {components.map((component) => (
          <button
            key={component.id}
            onClick={() => handleAddComponent(component)}
            className="w-full text-left p-3 bg-background hover:bg-border rounded-lg transition border border-border"
          >
            <div className="flex items-center gap-2 mb-1">
              <span className="text-lg">{component.icon}</span>
              <span className="text-sm font-semibold text-foreground">{component.name}</span>
            </div>
            <p className="text-xs text-muted">{component.description}</p>
          </button>
        ))}
      </div>
    </div>
  );
}
