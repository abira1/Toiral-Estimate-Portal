import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  X,
  Mail,
  Phone,
  MapPin,
  Globe,
  Briefcase,
  Clock,
  ExternalLink,
  User
} from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { ProgressBar } from '../../components/ui/ProgressBar';
import { StarDoodle } from '../../components/doodles/StarDoodle';
import { useAuth } from '../../contexts/AuthContext';
import { useData } from '../../contexts/DataContext';

interface ClientProfileProps {
  isOpen: boolean;
  onClose: () => void;
}

const TOIRAL_INFO = {
  tagline: 'Crafting Digital Experiences',
  description:
    'Toiral is a boutique web development agency specializing in creating beautiful, functional websites and applications. We combine thoughtful design with robust engineering to deliver products that users love.',
  services: [
    'Web Development',
    'UI/UX Design',
    'Product Strategy',
    'Technical Consulting'
  ],
  website: 'www.toiral.com',
  email: 'hello@toiral.com',
  phone: '+1 (555) 123-4567'
};

export function ClientProfile({ isOpen, onClose }: ClientProfileProps) {
  const { clientSession } = useAuth();
  const { getProjectsByClientId } = useData();
  const logoUrl = "/ChatGPT_Image_Apr_22,_2025,_02_48_04_AM_(1).png";

  // Get client data from session
  const client = clientSession?.client;
  
  // Get client's projects
  const clientProjects = client ? getProjectsByClientId(client.id) : [];
  const currentProject = clientProjects[0]; // Get first active project

  // Format date
  const formatMemberSince = (timestamp: number) => {
    const date = new Date(timestamp);
    return date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
  };

  // Get initials for avatar
  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  if (!client) {
    return null;
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-toiral-dark/40 backdrop-blur-sm z-40"
          />

          {/* Slide-out Panel */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            className="fixed right-0 top-0 bottom-0 w-full sm:w-[480px] bg-white shadow-2xl z-50 overflow-y-auto"
          >
            {/* Header */}
            <div className="sticky top-0 z-10 bg-toiral-dark text-white p-6 border-b border-toiral-primary/20">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-2xl font-bold">Profile</h2>
                <button
                  onClick={onClose}
                  className="p-2 hover:bg-white/10 rounded-full transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Profile Header */}
              <div className="flex items-center gap-4">
                <div className="w-20 h-20 rounded-2xl bg-toiral-primary flex items-center justify-center text-3xl font-bold text-white shadow-lg">
                  {getInitials(client.name)}
                </div>
                <div>
                  <h3 className="text-xl font-bold">{client.name}</h3>
                  <p className="text-toiral-light text-sm">
                    {client.companyName || 'Client'}
                  </p>
                  <Badge variant="success" className="mt-1">
                    {client.status}
                  </Badge>
                </div>
              </div>
            </div>

            {/* Content */}
            <div className="p-6 space-y-6">
              {/* Contact Information */}
              <Card>
                <h3 className="font-bold text-toiral-dark mb-4 flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-toiral-light/30 flex items-center justify-center">
                    <Mail className="w-4 h-4 text-toiral-primary" />
                  </div>
                  Contact Information
                </h3>
                <div className="space-y-3 text-sm">
                  <div className="flex items-center gap-3 text-gray-600">
                    <Mail className="w-4 h-4 text-gray-400" />
                    <a
                      href={`mailto:${client.email}`}
                      className="hover:text-toiral-primary transition-colors"
                    >
                      {client.email}
                    </a>
                  </div>
                  <div className="flex items-center gap-3 text-gray-600">
                    <Phone className="w-4 h-4 text-gray-400" />
                    <a
                      href={`tel:${client.phone}`}
                      className="hover:text-toiral-primary transition-colors"
                    >
                      {client.phone}
                    </a>
                  </div>
                  {client.companyName && (
                    <div className="flex items-center gap-3 text-gray-600">
                      <Briefcase className="w-4 h-4 text-gray-400" />
                      {client.companyName}
                    </div>
                  )}
                </div>
                <div className="mt-4 pt-4 border-t border-gray-100 text-sm text-gray-500">
                  Member since{' '}
                  <span className="font-semibold text-toiral-dark">
                    {formatMemberSince(client.createdAt)}
                  </span>
                </div>
                <div className="mt-2 text-sm text-gray-500">
                  Access Code:{' '}
                  <span className="font-mono font-bold text-toiral-primary">
                    {client.accessCode}
                  </span>
                </div>
              </Card>

              {/* Current Project */}
              {currentProject ? (
                <Card className="relative overflow-hidden bg-gradient-to-br from-toiral-bg to-white">
                  <StarDoodle
                    className="absolute top-2 right-2 opacity-20"
                    size={40}
                  />
                  <h3 className="font-bold text-toiral-dark mb-4 flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg bg-toiral-primary/10 flex items-center justify-center">
                      <Briefcase className="w-4 h-4 text-toiral-primary" />
                    </div>
                    Current Project
                  </h3>

                  <div className="space-y-4">
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-bold text-toiral-dark">
                          {currentProject.name}
                        </h4>
                        <Badge variant="info">{currentProject.status}</Badge>
                      </div>
                      {currentProject.description && (
                        <p className="text-sm text-gray-600 mb-3">
                          {currentProject.description}
                        </p>
                      )}
                    </div>

                    <ProgressBar
                      progress={currentProject.progress}
                      label="Overall Progress"
                    />

                    <div className="flex items-center justify-between text-sm pt-2">
                      {currentProject.dueDate && (
                        <div className="flex items-center gap-2 text-gray-500">
                          <Clock className="w-4 h-4" />
                          Due {currentProject.dueDate}
                        </div>
                      )}
                      <div className="text-gray-500">
                        {clientProjects.length} {clientProjects.length === 1 ? 'Project' : 'Projects'}
                      </div>
                    </div>
                  </div>
                </Card>
              ) : (
                <Card className="text-center py-8">
                  <Briefcase className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                  <p className="text-gray-500">No active projects</p>
                </Card>
              )}

              {/* About Toiral */}
              <Card className="bg-toiral-dark text-white">
                <div className="flex items-center gap-3 mb-4">
                  <img
                    src={logoUrl}
                    alt="Toiral Logo"
                    className="w-10 h-10 object-contain"
                  />
                  <div>
                    <h3 className="font-bold text-lg">Toiral</h3>
                    <p className="text-toiral-light text-xs">
                      {TOIRAL_INFO.tagline}
                    </p>
                  </div>
                </div>

                <p className="text-sm text-gray-300 leading-relaxed mb-4">
                  {TOIRAL_INFO.description}
                </p>

                <div className="mb-4">
                  <p className="text-xs text-toiral-light mb-2 font-semibold">
                    Our Services
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {TOIRAL_INFO.services.map((service, i) => (
                      <span
                        key={i}
                        className="px-3 py-1 bg-white/10 rounded-full text-xs font-medium text-white"
                      >
                        {service}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="pt-4 border-t border-white/10 space-y-2 text-sm">
                  <a
                    href={`https://${TOIRAL_INFO.website}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 text-toiral-light hover:text-white transition-colors"
                  >
                    <Globe className="w-4 h-4" />
                    {TOIRAL_INFO.website}
                    <ExternalLink className="w-3 h-3" />
                  </a>
                  <a
                    href={`mailto:${TOIRAL_INFO.email}`}
                    className="flex items-center gap-2 text-toiral-light hover:text-white transition-colors"
                  >
                    <Mail className="w-4 h-4" />
                    {TOIRAL_INFO.email}
                  </a>
                  <a
                    href={`tel:${TOIRAL_INFO.phone}`}
                    className="flex items-center gap-2 text-toiral-light hover:text-white transition-colors"
                  >
                    <Phone className="w-4 h-4" />
                    {TOIRAL_INFO.phone}
                  </a>
                </div>
              </Card>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
