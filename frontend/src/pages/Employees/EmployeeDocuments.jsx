import React, { useState, useMemo } from 'react';
import { Download, Eye, Upload, FileText, Image, File, Search, Filter, Grid, List, MoreVertical, Star, Share2, Trash2, FolderOpen } from 'lucide-react';

const EmployeeDocuments = () => {
  const [documents] = useState([
    { id: 1, name: 'Contrat de travail CDI', type: 'pdf', size: '245 KB', date: '2022-03-01', category: 'Contrat', description: 'Contrat de travail à durée indéterminée signé le 1er mars 2022', starred: true, shared: false },
    { id: 2, name: 'Fiche de paie Décembre 2023', type: 'pdf', size: '156 KB', date: '2023-12-31', category: 'Paie', description: 'Bulletin de salaire pour le mois de décembre 2023', starred: false, shared: false },
    { id: 3, name: 'Certificat formation Excel Avancé', type: 'pdf', size: '89 KB', date: '2023-11-15', category: 'Formation', description: 'Certificat de réussite formation Excel niveau avancé', starred: true, shared: true },
    { id: 4, name: 'Attestation employeur', type: 'pdf', size: '67 KB', date: '2023-10-20', category: 'Administratif', description: 'Attestation d\'employeur pour démarches administratives', starred: false, shared: false },
    { id: 5, name: 'Photo profil entreprise', type: 'jpg', size: '234 KB', date: '2023-09-10', category: 'Personnel', description: 'Photo officielle pour l\'annuaire interne', starred: false, shared: true },
    { id: 6, name: 'Avenant contrat télétravail', type: 'pdf', size: '123 KB', date: '2023-08-15', category: 'Contrat', description: 'Avenant autorisant le télétravail 2 jours par semaine', starred: true, shared: false },
    { id: 7, name: 'Certificat médical aptitude', type: 'pdf', size: '78 KB', date: '2023-07-20', category: 'Médical', description: 'Certificat médical d\'aptitude au poste de travail', starred: false, shared: false },
    { id: 8, name: 'Plan de formation 2024', type: 'pdf', size: '345 KB', date: '2023-12-01', category: 'Formation', description: 'Plan de formation personnalisé pour l\'année 2024', starred: true, shared: false }
  ]);

  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [viewMode, setViewMode] = useState('list'); // list, grid
  const [sortBy, setSortBy] = useState('date'); // date, name, size
  const [sortOrder, setSortOrder] = useState('desc'); // asc, desc

  const categories = [...new Set(documents.map(doc => doc.category))];

  const getFileIcon = (type, size = 'w-8 h-8') => {
    const iconClass = `${size} flex-shrink-0`;
    switch (type) {
      case 'pdf': return <FileText className={`${iconClass} text-red-500`} />;
      case 'jpg':
      case 'png': return <Image className={`${iconClass} text-secondary-500`} />;
      case 'doc':
      case 'docx': return <FileText className={`${iconClass} text-secondary-600`} />;
      default: return <File className={`${iconClass} text-gray-500`} />;
    }
  };

  const getCategoryConfig = (category) => {
    const configs = {
      'Contrat': { color: 'bg-purple-100 text-purple-800 border-purple-200', icon: '📄' },
      'Paie': { color: 'bg-green-100 text-green-800 border-green-200', icon: '💰' },
      'Formation': { color: 'bg-secondary-100 text-blue-800 border-blue-200', icon: '🎓' },
      'Administratif': { color: 'bg-orange-100 text-orange-800 border-orange-200', icon: '📋' },
      'Personnel': { color: 'bg-gray-100 text-gray-800 border-gray-200', icon: '👤' },
      'Médical': { color: 'bg-red-100 text-red-800 border-red-200', icon: '🏥' }
    };
    return configs[category] || { color: 'bg-gray-100 text-gray-800 border-gray-200', icon: '📁' };
  };

  const filteredAndSortedDocuments = useMemo(() => {
    let filtered = documents.filter(doc => {
      const matchesSearch = doc.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           doc.description.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = categoryFilter === 'all' || doc.category === categoryFilter;
      return matchesSearch && matchesCategory;
    });

    return filtered.sort((a, b) => {
      let aValue, bValue;
      switch (sortBy) {
        case 'name':
          aValue = a.name.toLowerCase();
          bValue = b.name.toLowerCase();
          break;
        case 'size':
          aValue = parseInt(a.size.replace(/[^0-9]/g, ''));
          bValue = parseInt(b.size.replace(/[^0-9]/g, ''));
          break;
        case 'date':
        default:
          aValue = new Date(a.date);
          bValue = new Date(b.date);
          break;
      }
      
      if (sortOrder === 'asc') {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
    });
  }, [documents, searchTerm, categoryFilter, sortBy, sortOrder]);

  const toggleStar = (id) => {
    // Implementation would update the starred status
    console.log('Toggle star for document:', id);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="p-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Mes Documents</h1>
              <p className="text-gray-600 mt-1">Centralisez et gérez tous vos documents professionnels</p>
            </div>
            <div className="flex items-center gap-3">
              <button className="bg-white border border-gray-200 text-gray-700 px-4 py-2 rounded-xl font-medium flex items-center gap-2 hover:bg-gray-50 transition-all">
                <Share2 className="w-4 h-4" />
                Partager
              </button>
              <button className="bg-secondary-600 hover:bg-secondary-700 text-white px-6 py-3 rounded-xl font-medium flex items-center gap-2 shadow-lg transition-all">
                <Upload className="w-5 h-5" />
                Ajouter un document
              </button>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-5 gap-6 mb-8">
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total</p>
                  <p className="text-3xl font-bold text-gray-900 mt-1">{documents.length}</p>
                </div>
                <div className="w-12 h-12 bg-gray-100 rounded-xl flex items-center justify-center text-xl">
                  📁
                </div>
              </div>
            </div>
            {categories.slice(0, 4).map((category) => {
              const config = getCategoryConfig(category);
              const count = documents.filter(doc => doc.category === category).length;
              return (
                <div key={category} className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">{category}</p>
                      <p className="text-3xl font-bold text-gray-900 mt-1">{count}</p>
                    </div>
                    <div className="w-12 h-12 bg-gray-100 rounded-xl flex items-center justify-center text-xl">
                      {config.icon}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Search and Filters */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 mb-8">
            <div className="flex flex-col lg:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Rechercher un document..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-secondary-500 focus:border-transparent"
                />
              </div>
              <div className="flex gap-3">
                <select
                  value={categoryFilter}
                  onChange={(e) => setCategoryFilter(e.target.value)}
                  className="px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-secondary-500 bg-white min-w-[160px]"
                >
                  <option value="all">Toutes catégories</option>
                  {categories.map(category => (
                    <option key={category} value={category}>{category}</option>
                  ))}
                </select>
                <select
                  value={`${sortBy}-${sortOrder}`}
                  onChange={(e) => {
                    const [sort, order] = e.target.value.split('-');
                    setSortBy(sort);
                    setSortOrder(order);
                  }}
                  className="px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-secondary-500 bg-white min-w-[160px]"
                >
                  <option value="date-desc">Plus récents</option>
                  <option value="date-asc">Plus anciens</option>
                  <option value="name-asc">Nom A-Z</option>
                  <option value="name-desc">Nom Z-A</option>
                  <option value="size-desc">Plus volumineux</option>
                  <option value="size-asc">Plus légers</option>
                </select>
                <div className="flex border border-gray-200 rounded-xl overflow-hidden">
                  <button
                    onClick={() => setViewMode('list')}
                    className={`p-3 ${viewMode === 'list' ? 'bg-secondary-600 text-white' : 'bg-white text-gray-600 hover:bg-gray-50'} transition-colors`}
                  >
                    <List className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() => setViewMode('grid')}
                    className={`p-3 ${viewMode === 'grid' ? 'bg-secondary-600 text-white' : 'bg-white text-gray-600 hover:bg-gray-50'} transition-colors`}
                  >
                    <Grid className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Documents Display */}
        {viewMode === 'list' ? (
          <div className="space-y-4">
            {filteredAndSortedDocuments.map((doc) => {
              const categoryConfig = getCategoryConfig(doc.category);
              return (
                <div key={doc.id} className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-all">
                  <div className="flex items-center gap-4">
                    <div className="flex-shrink-0">
                      {getFileIcon(doc.type, 'w-12 h-12')}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-1">
                            <h3 className="text-lg font-semibold text-gray-900 truncate">{doc.name}</h3>
                            <span className={`px-3 py-1 rounded-full text-xs font-medium border ${categoryConfig.color}`}>
                              {categoryConfig.icon} {doc.category}
                            </span>
                            {doc.starred && <Star className="w-5 h-5 text-primary-500 fill-current" />}
                            {doc.shared && <Share2 className="w-4 h-4 text-secondary-500" />}
                          </div>
                          <p className="text-gray-600 text-sm mb-2">{doc.description}</p>
                          <div className="flex items-center gap-4 text-sm text-gray-500">
                            <span>{doc.size}</span>
                            <span>Ajouté le {new Date(doc.date).toLocaleDateString('fr-FR')}</span>
                          </div>
                        </div>
                        <div className="flex items-center gap-2 ml-4">
                          <button 
                            onClick={() => toggleStar(doc.id)}
                            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                          >
                            <Star className={`w-5 h-5 ${doc.starred ? 'text-primary-500 fill-current' : 'text-gray-400'}`} />
                          </button>
                          <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                            <Eye className="w-5 h-5 text-gray-600" />
                          </button>
                          <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                            <Download className="w-5 h-5 text-gray-600" />
                          </button>
                          <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                            <MoreVertical className="w-5 h-5 text-gray-400" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredAndSortedDocuments.map((doc) => {
              const categoryConfig = getCategoryConfig(doc.category);
              return (
                <div key={doc.id} className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-all">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2">
                      {doc.starred && <Star className="w-4 h-4 text-primary-500 fill-current" />}
                      {doc.shared && <Share2 className="w-4 h-4 text-secondary-500" />}
                    </div>
                    <button className="p-1 hover:bg-gray-100 rounded transition-colors">
                      <MoreVertical className="w-4 h-4 text-gray-400" />
                    </button>
                  </div>
                  <div className="text-center mb-4">
                    <div className="mx-auto mb-3">
                      {getFileIcon(doc.type, 'w-16 h-16')}
                    </div>
                    <h3 className="font-semibold text-gray-900 mb-1 line-clamp-2">{doc.name}</h3>
                    <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium border ${categoryConfig.color} mb-2`}>
                      {categoryConfig.icon} {doc.category}
                    </span>
                    <p className="text-sm text-gray-500 mb-2">{doc.size}</p>
                    <p className="text-xs text-gray-400">{new Date(doc.date).toLocaleDateString('fr-FR')}</p>
                  </div>
                  <div className="flex items-center justify-center gap-2">
                    <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                      <Eye className="w-4 h-4 text-gray-600" />
                    </button>
                    <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                      <Download className="w-4 h-4 text-gray-600" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {filteredAndSortedDocuments.length === 0 && (
          <div className="text-center py-12">
            <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <FolderOpen className="w-12 h-12 text-gray-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">Aucun document trouvé</h3>
            <p className="text-gray-600">Essayez de modifier vos filtres ou ajoutez un nouveau document.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default EmployeeDocuments;