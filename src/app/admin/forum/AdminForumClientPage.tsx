'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faChevronRight, faChevronDown, faEdit, faTrash, faThumbtack, faLock, faUnlock } from '@fortawesome/free-solid-svg-icons';
import { deleteForumTopic, lockForumTopic, pinForumTopic, deleteForumCategory } from '@/services/forumService';
import { getTopicsByCategorySlugAction } from '@/app/actions/forumActions';
import { supabase } from '@/utils/supabase/client';
import Modal from '@/components/layout/Modal';
import { EditForumCategoryModal } from '@/components/admin/EditForumCategoryModal';
import toast from 'react-hot-toast';

interface Topic {
  id: number;
  title: string;
  slug: string;
  is_pinned: boolean;
  is_locked: boolean;
  reply_count: number;
  author: {
    username: string;
  };
}

interface Category {
  id: number;
  name: string;
  slug: string;
  description: string;
  sort_order: number;
}

interface AdminForumClientPageProps {
    initialCategories: Category[];
}

export const AdminForumClientPage = ({ initialCategories }: AdminForumClientPageProps) => {
  const [categories, setCategories] = useState<Category[]>(initialCategories);
  const [modal, setModal] = useState<{ isOpen: boolean, type: string, data: Category | null }>({ isOpen: false, type: '', data: null });
  const [confirmModal, setConfirmModal] = useState<{ isOpen: boolean, message: string, onConfirm: () => void }>({ isOpen: false, message: '', onConfirm: () => {} });
  const [expandedCategories, setExpandedCategories] = useState<number[]>([]);
  const [topics, setTopics] = useState<{ [key: number]: Topic[] }>({});

  const fetchTopicsForCategory = async (categoryId: number) => {
    const category = categories.find(c => c.id === categoryId);
    if (!category) return;
    const result = await getTopicsByCategorySlugAction(category.slug);
    if (result.success) {
        setTopics(prevTopics => ({ ...prevTopics, [categoryId]: result.data as Topic[] }));
    }
  };

  const toggleTopics = (categoryId: number) => {
    const isExpanded = expandedCategories.includes(categoryId);
    if (isExpanded) {
      setExpandedCategories(expandedCategories.filter(id => id !== categoryId));
    } else {
      setExpandedCategories([...expandedCategories, categoryId]);
      if (!topics[categoryId]) {
        fetchTopicsForCategory(categoryId);
      }
    }
  };

  const handleModerationAction = async (action: Promise<{ data: unknown; error: unknown; }>, categoryId: number) => {
    await action;
    fetchTopicsForCategory(categoryId);
  };

  return (
    <>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-4xl font-bold">Gérer les Catégories du Forum</h1>
        <button onClick={() => setModal({ isOpen: true, type: 'category', data: null })} className="px-5 py-2 bg-primary text-card-foreground rounded-lg hover:bg-primary/90 transition duration-300 font-semibold">
          <FontAwesomeIcon icon={faPlus} className="mr-2" />Nouvelle Catégorie
        </button>
      </div>
      <div className="bg-card p-6 rounded-lg shadow-lg">
        <table className="w-full text-left">
          <thead>
            <tr className="border-b">
              <th className="p-4">Nom</th>
              <th className="p-4">Slug</th>
              <th className="p-4">Description</th>
              <th className="p-4 text-center">Ordre</th>
              <th className="p-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {categories.map(cat => (
              <React.Fragment key={cat.id}>
                <tr className="border-b">
                  <td className="p-4">
                    <button onClick={() => toggleTopics(cat.id)} className="mr-2 focus:outline-none">
                      <FontAwesomeIcon icon={expandedCategories.includes(cat.id) ? faChevronDown : faChevronRight} style={{ color: '#f97316' }} />
                    </button>
                    {cat.name}
                  </td>
                  <td className="p-4">{cat.slug}</td>
                  <td className="p-4">{cat.description}</td>
                  <td className="p-4 text-center">{cat.sort_order}</td>
                  <td className="p-4 text-right">
                    <button onClick={() => setModal({ isOpen: true, type: 'category', data: cat })} className="text-primary hover:underline mr-2"><FontAwesomeIcon icon={faEdit} className="mr-1" />Modifier</button>
                    <button onClick={() => {
                      setConfirmModal({
                        isOpen: true,
                        message: `Êtes-vous sûr de vouloir supprimer la catégorie "${cat.name}" ?`,
                        onConfirm: async () => {
                          await deleteForumCategory(supabase, cat.id);
                          toast.success('Catégorie supprimée.');
                          // This should ideally re-fetch from the server, but for now we'll filter locally
                          setCategories(prev => prev.filter(c => c.id !== cat.id));
                          setConfirmModal({ isOpen: false, message: '', onConfirm: () => {} });
                        }
                      });
                    }} className="text-destructive hover:underline"><FontAwesomeIcon icon={faTrash} className="mr-1" />Supprimer</button>
                  </td>
                </tr>
                {expandedCategories.includes(cat.id) && (
                  <tr className="bg-muted">
                    <td colSpan={5} className="p-4">
                      {topics[cat.id] ? (
                        <table className="min-w-full divide-y divide-gray-200">
                          <thead className="bg-muted">
                            <tr>
                              <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Titre du Sujet</th>
                              <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Auteur</th>
                              <th className="px-6 py-3 text-center text-xs font-medium text-muted-foreground uppercase tracking-wider">Statut</th>
                              <th className="px-6 py-3 text-right text-xs font-medium text-muted-foreground uppercase tracking-wider">Actions</th>
                            </tr>
                          </thead>
                          <tbody className="bg-card divide-y divide-gray-200">
                            {topics[cat.id].map(topic => (
                              <tr key={topic.id}>
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{topic.is_pinned ? <FontAwesomeIcon icon={faThumbtack} className="text-primary mr-2" title="Épinglé" /> : ''}{topic.title}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-muted-foreground">{topic.author?.username}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-muted-foreground text-center">{topic.reply_count}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-muted-foreground text-center">{topic.is_locked ? <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-yellow-100 text-yellow-800">Verrouillé</span> : <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">Ouvert</span>}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                  <Link href={`/admin/forum/edit/${topic.slug}`} className="text-indigo-600 hover:text-indigo-900 mr-3"><FontAwesomeIcon icon={faEdit} /></Link>
                                  <button onClick={() => handleModerationAction(pinForumTopic(supabase, topic.id, !topic.is_pinned), cat.id)} className="text-primary hover:text-blue-900 mr-3"><FontAwesomeIcon icon={faThumbtack} title={topic.is_pinned ? 'Désépingler' : 'Épingler'} /></button>
                                  <button onClick={() => handleModerationAction(lockForumTopic(supabase, topic.id, !topic.is_locked), cat.id)} className="text-yellow-600 hover:text-yellow-900 mr-3"><FontAwesomeIcon icon={topic.is_locked ? faUnlock : faLock} title={topic.is_locked ? 'Déverrouiller' : 'Verrouiller'} /></button>
                                  <button onClick={() => {
                                    setConfirmModal({
                                      isOpen: true,
                                      message: 'Êtes-vous sûr de vouloir supprimer ce sujet et tous ses messages ?',
                                      onConfirm: () => {
                                        handleModerationAction(deleteForumTopic(supabase, topic.id), cat.id);
                                        toast.success('Sujet supprimé.');
                                        setConfirmModal({ isOpen: false, message: '', onConfirm: () => {} });
                                      }
                                    });
                                  }} className="text-destructive hover:text-red-900"><FontAwesomeIcon icon={faTrash} /></button>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      ) : (
                        <p className="text-center text-muted-foreground p-4">Chargement des sujets...</p>
                      )}
                    </td>
                  </tr>
                )}
              </React.Fragment>
            ))}
          </tbody>
        </table>
      </div>

      <EditForumCategoryModal 
        category={modal.data}
        isOpen={modal.isOpen}
        onClose={() => setModal({ isOpen: false, type: '', data: null })}
        onSuccess={() => {
          // This should be updated to re-fetch from server action
          // For now, we'll just close the modal
          setModal({ isOpen: false, type: '', data: null });
        }}
      />

      <Modal isOpen={confirmModal.isOpen} onClose={() => setConfirmModal({ isOpen: false, message: '', onConfirm: () => {} })} title="Confirmer l'action" titleCentered>
        <p className="text-muted-foreground mb-6 text-center">{confirmModal.message}</p>
        <div className="flex justify-center space-x-4">
            <button onClick={() => setConfirmModal({ isOpen: false, message: '', onConfirm: () => {} })} className="px-4 py-2 text-sm font-medium text-foreground bg-muted hover:bg-muted/80 rounded-md">
                Annuler
            </button>
            <button onClick={confirmModal.onConfirm} className="px-4 py-2 text-sm font-medium text-card-foreground bg-destructive hover:bg-destructive/90 rounded-md">
                Confirmer la suppression
            </button>
        </div>
      </Modal>
    </>
  );
};
