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
  ExternalLink } from
'lucide-react';
import { Button } from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { ProgressBar } from '../../components/ui/ProgressBar';
import { StarDoodle } from '../../components/doodles/StarDoodle';
interface ClientProfileProps {
  isOpen: boolean;
  onClose: () => void;
}
// Mock client data
const CLIENT_DATA = {
  name: 'John Doe',
  role: 'Product Director',
  company: 'Nike',
  email: 'john.doe@nike.com',
  phone: '+1 (503) 671-6453',
  location: 'Portland, Oregon',
  avatar: 'JD',
  memberSince: 'September 2023',
  currentProject: {
    name: 'E-commerce Redesign',
    status: 'In Progress',
    progress: 65,
    dueDate: 'Oct 24, 2024',
    phase: 'Frontend Development'
  }
};
const TOIRAL_INFO = {
  tagline: 'Crafting Digital Experiences',
  description:
  'Toiral is a boutique web development agency specializing in creating beautiful, functional websites and applications. We combine thoughtful design with robust engineering to deliver products that users love.',
  services: [
  'Web Development',
  'UI/UX Design',
  'Product Strategy',
  'Technical Consulting'],

  website: 'www.toiral.com',
  email: 'hello@toiral.com',
  phone: '+1 (555) 123-4567'
};
export function ClientProfile({ isOpen, onClose }: ClientProfileProps) {
  const logoUrl = "/ChatGPT_Image_Apr_22,_2025,_02_48_04_AM_(1).png";

  return (
    <AnimatePresence>
      {isOpen &&
      <>
          {/* Backdrop */}
          <motion.div
          initial={{
            opacity: 0
          }}
          animate={{
            opacity: 1
          }}
          exit={{
            opacity: 0
          }}
          onClick={onClose}
          className="fixed inset-0 bg-toiral-dark/40 backdrop-blur-sm z-40" />


          {/* Slide-out Panel */}
          <motion.div
          initial={{
            x: '100%'
          }}
          animate={{
            x: 0
          }}
          exit={{
            x: '100%'
          }}
          transition={{
            type: 'spring',
            stiffness: 300,
            damping: 30
          }}
          className="fixed right-0 top-0 bottom-0 w-full sm:w-[480px] bg-white shadow-2xl z-50 overflow-y-auto">

            {/* Header */}
            <div className="sticky top-0 z-10 bg-toiral-dark text-white p-6 border-b border-toiral-primary/20">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-2xl font-bold">Profile</h2>
                <button
                onClick={onClose}
                className="p-2 hover:bg-white/10 rounded-full transition-colors">

                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Profile Header */}
              <div className="flex items-center gap-4">
                <div className="w-20 h-20 rounded-2xl bg-toiral-primary flex items-center justify-center text-3xl font-bold text-white shadow-lg">
                  {CLIENT_DATA.avatar}
                </div>
                <div>
                  <h3 className="text-xl font-bold">{CLIENT_DATA.name}</h3>
                  <p className="text-toiral-light text-sm">
                    {CLIENT_DATA.role}
                  </p>
                  <p className="text-toiral-secondary text-sm font-medium">
                    {CLIENT_DATA.company}
                  </p>
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
                    href={`mailto:${CLIENT_DATA.email}`}
                    className="hover:text-toiral-primary transition-colors">

                      {CLIENT_DATA.email}
                    </a>
                  </div>
                  <div className="flex items-center gap-3 text-gray-600">
                    <Phone className="w-4 h-4 text-gray-400" />
                    <a
                    href={`tel:${CLIENT_DATA.phone}`}
                    className="hover:text-toiral-primary transition-colors">

                      {CLIENT_DATA.phone}
                    </a>
                  </div>
                  <div className="flex items-center gap-3 text-gray-600">
                    <MapPin className="w-4 h-4 text-gray-400" />
                    {CLIENT_DATA.location}
                  </div>
                </div>
                <div className="mt-4 pt-4 border-t border-gray-100 text-sm text-gray-500">
                  Member since{' '}
                  <span className="font-semibold text-toiral-dark">
                    {CLIENT_DATA.memberSince}
                  </span>
                </div>
              </Card>

              {/* Current Project */}
              <Card className="relative overflow-hidden bg-gradient-to-br from-toiral-bg to-white">
                <StarDoodle
                className="absolute top-2 right-2 opacity-20"
                size={40} />

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
                        {CLIENT_DATA.currentProject.name}
                      </h4>
                      <Badge variant="info">
                        {CLIENT_DATA.currentProject.status}
                      </Badge>
                    </div>
                    <p className="text-sm text-gray-600 mb-3">
                      Current Phase:{' '}
                      <span className="font-semibold text-toiral-primary">
                        {CLIENT_DATA.currentProject.phase}
                      </span>
                    </p>
                  </div>

                  <ProgressBar
                  progress={CLIENT_DATA.currentProject.progress}
                  label="Overall Progress" />


                  <div className="flex items-center justify-between text-sm pt-2">
                    <div className="flex items-center gap-2 text-gray-500">
                      <Clock className="w-4 h-4" />
                      Due {CLIENT_DATA.currentProject.dueDate}
                    </div>
                    <Button
                    variant="ghost"
                    size="sm"
                    className="text-toiral-primary h-8">

                      View Details →
                    </Button>
                  </div>
                </div>
              </Card>

              {/* About Toiral */}
              <Card className="bg-toiral-dark text-white">
                <div className="flex items-center gap-3 mb-4">
                  <img
                  src={logoUrl}
                  alt="Toiral Logo"
                  className="w-10 h-10 object-contain" />

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
                    {TOIRAL_INFO.services.map((service, i) =>
                  <span
                    key={i}
                    className="px-3 py-1 bg-white/10 rounded-full text-xs font-medium text-white">

                        {service}
                      </span>
                  )}
                  </div>
                </div>

                <div className="pt-4 border-t border-white/10 space-y-2 text-sm">
                  <a
                  href={`https://${TOIRAL_INFO.website}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-toiral-light hover:text-white transition-colors">

                    <Globe className="w-4 h-4" />
                    {TOIRAL_INFO.website}
                    <ExternalLink className="w-3 h-3" />
                  </a>
                  <a
                  href={`mailto:${TOIRAL_INFO.email}`}
                  className="flex items-center gap-2 text-toiral-light hover:text-white transition-colors">

                    <Mail className="w-4 h-4" />
                    {TOIRAL_INFO.email}
                  </a>
                  <a
                  href={`tel:${TOIRAL_INFO.phone}`}
                  className="flex items-center gap-2 text-toiral-light hover:text-white transition-colors">

                    <Phone className="w-4 h-4" />
                    {TOIRAL_INFO.phone}
                  </a>
                </div>
              </Card>

              {/* Actions */}
              <div className="space-y-3 pt-2">
                <Button variant="outline" className="w-full">
                  Edit Profile
                </Button>
                <Button variant="ghost" className="w-full text-gray-500">
                  Privacy Settings
                </Button>
              </div>
            </div>
          </motion.div>
        </>
      }
    </AnimatePresence>);

}