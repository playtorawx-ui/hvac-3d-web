export type Language = 'en' | 'es' | 'fr' | 'de' | 'ja' | 'zh';

export const TRANSLATIONS: Record<Language, Record<string, string>> = {
  en: {
    // Header
    'app.title': 'HVAC 3D Troubleshooter',
    'app.subtitle': 'Design and diagnose refrigeration systems',

    // Navigation
    'nav.home': 'Home',
    'nav.editor': 'Editor',
    'nav.training': 'Training',
    'nav.settings': 'Settings',

    // Buttons
    'btn.new_system': 'New System',
    'btn.templates': 'Templates',
    'btn.training': 'Training Mode',
    'btn.create': 'Create',
    'btn.cancel': 'Cancel',
    'btn.save': 'Save',
    'btn.delete': 'Delete',
    'btn.clone': 'Clone',
    'btn.edit': 'Edit',
    'btn.export': 'Export',
    'btn.import': 'Import',
    'btn.undo': 'Undo',
    'btn.redo': 'Redo',

    // Forms
    'form.system_name': 'System Name',
    'form.refrigerant': 'Refrigerant Type',
    'form.search': 'Search systems...',
    'form.enter_name': 'Enter system name',

    // Messages
    'msg.system_created': 'System created successfully',
    'msg.system_deleted': 'System deleted',
    'msg.system_cloned': 'System cloned',
    'msg.system_loaded': 'System loaded',
    'msg.no_systems': 'No systems yet',
    'msg.no_results': 'No systems found',

    // Components
    'comp.compressor': 'Compressor',
    'comp.condenser': 'Condenser',
    'comp.evaporator': 'Evaporator',
    'comp.expansion_valve': 'Expansion Valve',
    'comp.accumulator': 'Accumulator',
    'comp.filter_drier': 'Filter-Drier',

    // Statistics
    'stat.total_components': 'Total Components',
    'stat.total_capacity': 'Total Capacity',
    'stat.efficiency': 'Efficiency',
    'stat.cost': 'Estimated Cost',
    'stat.weight': 'Estimated Weight',

    // Compliance
    'comp.compliance': 'Compliance',
    'comp.errors': 'Errors',
    'comp.warnings': 'Warnings',
    'comp.info': 'Information',
  },
  es: {
    'app.title': 'Solucionador 3D de HVAC',
    'app.subtitle': 'Diseña y diagnostica sistemas de refrigeración',
    'nav.home': 'Inicio',
    'nav.editor': 'Editor',
    'nav.training': 'Entrenamiento',
    'btn.new_system': 'Nuevo Sistema',
    'btn.create': 'Crear',
    'btn.cancel': 'Cancelar',
    'msg.system_created': 'Sistema creado exitosamente',
  },
  fr: {
    'app.title': 'Dépanneur 3D HVAC',
    'app.subtitle': 'Concevez et diagnostiquez les systèmes de réfrigération',
    'nav.home': 'Accueil',
    'nav.editor': 'Éditeur',
    'nav.training': 'Formation',
    'btn.new_system': 'Nouveau Système',
    'btn.create': 'Créer',
    'btn.cancel': 'Annuler',
    'msg.system_created': 'Système créé avec succès',
  },
  de: {
    'app.title': 'HVAC 3D Troubleshooter',
    'app.subtitle': 'Entwerfen und diagnostizieren Sie Kälteanlagen',
    'nav.home': 'Startseite',
    'nav.editor': 'Editor',
    'nav.training': 'Schulung',
    'btn.new_system': 'Neues System',
    'btn.create': 'Erstellen',
    'btn.cancel': 'Abbrechen',
    'msg.system_created': 'System erfolgreich erstellt',
  },
  ja: {
    'app.title': 'HVAC 3D トラブルシューター',
    'app.subtitle': '冷凍システムの設計と診断',
    'nav.home': 'ホーム',
    'nav.editor': 'エディター',
    'nav.training': 'トレーニング',
    'btn.new_system': '新しいシステム',
    'btn.create': '作成',
    'btn.cancel': 'キャンセル',
    'msg.system_created': 'システムが正常に作成されました',
  },
  zh: {
    'app.title': 'HVAC 3D 故障排除器',
    'app.subtitle': '设计和诊断制冷系统',
    'nav.home': '主页',
    'nav.editor': '编辑器',
    'nav.training': '培训',
    'btn.new_system': '新系统',
    'btn.create': '创建',
    'btn.cancel': '取消',
    'msg.system_created': '系统创建成功',
  },
};

export function getTranslation(language: Language, key: string): string {
  return TRANSLATIONS[language]?.[key] || TRANSLATIONS['en'][key] || key;
}

export function useTranslation(language: Language) {
  return (key: string) => getTranslation(language, key);
}
