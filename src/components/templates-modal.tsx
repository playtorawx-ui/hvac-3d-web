import { useState } from 'react';
import { SYSTEM_TEMPLATES, getAllCategories } from '../lib/data/system-templates';
import { useHVACStore } from '../lib/store/hvac-store';

interface TemplatesModalProps {
  onClose: () => void;
  onTemplateLoaded: () => void;
}

export function TemplatesModal({ onClose, onTemplateLoaded }: TemplatesModalProps) {
  const { saveSystem } = useHVACStore();
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const categories = getAllCategories();
  const templates = selectedCategory
    ? SYSTEM_TEMPLATES.filter((t) => t.category === selectedCategory)
    : SYSTEM_TEMPLATES;

  const handleUseTemplate = (templateId: string) => {
    const template = SYSTEM_TEMPLATES.find((t) => t.id === templateId);
    if (template) {
      const newSystem = {
        ...template.system,
        id: `system_${Date.now()}`,
        name: `${template.system.name} (Copy)`,
        createdAt: Date.now(),
        updatedAt: Date.now(),
      };
      saveSystem(newSystem);
      onTemplateLoaded();
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-surface rounded-lg p-6 max-w-2xl w-full mx-4 max-h-96 overflow-hidden flex flex-col">
        <h2 className="text-xl font-bold text-foreground mb-4">System Templates</h2>

        {/* Category Filter */}
        <div className="flex gap-2 mb-4 overflow-x-auto pb-2">
          <button
            onClick={() => setSelectedCategory(null)}
            className={`px-3 py-1 rounded text-xs font-semibold whitespace-nowrap transition ${
              selectedCategory === null
                ? 'bg-primary text-white'
                : 'bg-background text-foreground hover:bg-border'
            }`}
          >
            All
          </button>
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`px-3 py-1 rounded text-xs font-semibold whitespace-nowrap transition ${
                selectedCategory === category
                  ? 'bg-primary text-white'
                  : 'bg-background text-foreground hover:bg-border'
              }`}
            >
              {category}
            </button>
          ))}
        </div>

        {/* Templates List */}
        <div className="flex-1 overflow-y-auto space-y-2 mb-4">
          {templates.map((template) => (
            <div
              key={template.id}
              className="p-3 bg-background rounded-lg border border-border hover:border-primary transition"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex-1">
                  <h3 className="text-sm font-semibold text-foreground">{template.name}</h3>
                  <p className="text-xs text-muted mt-1">{template.description}</p>
                  <div className="flex items-center gap-2 mt-2">
                    <span className="text-xs bg-primary/20 text-primary px-2 py-1 rounded">
                      {template.system.components.length} components
                    </span>
                    <span className="text-xs text-muted">{template.system.refrigerant}</span>
                  </div>
                </div>
                <button
                  onClick={() => handleUseTemplate(template.id)}
                  className="px-3 py-1 bg-primary text-white rounded text-xs font-semibold hover:opacity-90 transition whitespace-nowrap"
                >
                  Use
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Close Button */}
        <button
          onClick={onClose}
          className="w-full px-4 py-2 border border-border rounded-lg text-foreground hover:bg-background transition"
        >
          Close
        </button>
      </div>
    </div>
  );
}
