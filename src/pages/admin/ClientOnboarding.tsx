import React, { useState, Component } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import {
  ArrowRight,
  ArrowLeft,
  CheckCircle,
  Copy,
  UserPlus,
  Building,
  Mail,
  Phone,
  Briefcase,
  Share2,
  Send,
  Check,
  Key } from
'lucide-react';
import { DashboardLayout } from '../../components/layout/DashboardLayout';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Stepper } from '../../components/ui/Stepper';
import { TeamMemberCard } from '../../components/ui/TeamMemberCard';
import { Badge } from '../../components/ui/Badge';
const STEPS = [
{
  label: 'Client Details',
  description: 'Basic information'
},
{
  label: 'Review',
  description: 'Verify details'
},
{
  label: 'Team',
  description: 'Assign members'
},
{
  label: 'Complete',
  description: 'Success'
}];

const MOCK_TEAM = [
{
  id: '1',
  name: 'Alex Morgan',
  role: 'Project Manager',
  projectCount: 3
},
{
  id: '2',
  name: 'Sam Wilson',
  role: 'Lead Developer',
  projectCount: 5
},
{
  id: '3',
  name: 'Jordan Lee',
  role: 'UI Designer',
  projectCount: 2
},
{
  id: '4',
  name: 'Casey Brown',
  role: 'Backend Dev',
  projectCount: 4
}];

export function ClientOnboarding() {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const [formData, setFormData] = useState({
    clientName: '',
    companyName: '',
    email: '',
    phone: '',
    projectName: '',
    team: [] as string[]
  });
  const [accessCode, setAccessCode] = useState('');
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };
  const toggleTeamMember = (id: string) => {
    setFormData((prev) => ({
      ...prev,
      team: prev.team.includes(id) ?
      prev.team.filter((t) => t !== id) :
      [...prev.team, id]
    }));
  };
  const generateAccessCode = () => {
    const year = new Date().getFullYear();
    const randomPart = Math.random().toString(36).substring(2, 6).toUpperCase();
    return `PRJ-${year}-${randomPart}`;
  };
  const handleNext = () => {
    if (currentStep === 2) {
      // Final submission
      setLoading(true);
      setTimeout(() => {
        setAccessCode(generateAccessCode());
        setLoading(false);
        setCurrentStep(3);
      }, 1500);
    } else {
      setCurrentStep((prev) => prev + 1);
    }
  };
  const handleBack = () => {
    setCurrentStep((prev) => prev - 1);
  };
  const copyToClipboard = () => {
    navigator.clipboard.writeText(accessCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };
  const shareViaEmail = () => {
    const subject = encodeURIComponent(
      `Your Project Access Code - ${formData.projectName}`
    );
    const body = encodeURIComponent(
      `Hi ${formData.clientName},\n\nYour project "${formData.projectName}" has been set up successfully!\n\nUse the following Access Code to track your project progress:\n\n${accessCode}\n\nVisit our portal and enter this code to view real-time updates on your project.\n\nBest regards,\nToiral Team`
    );
    window.open(`mailto:${formData.email}?subject=${subject}&body=${body}`);
  };
  const shareMessage = `Hi ${formData.clientName}! Your project access code is: ${accessCode} - Use this to track your project progress at our portal.`;
  const shareViaWhatsApp = () => {
    window.open(`https://wa.me/?text=${encodeURIComponent(shareMessage)}`);
  };
  const shareViaSMS = () => {
    window.open(
      `sms:${formData.phone}?body=${encodeURIComponent(shareMessage)}`
    );
  };
  return (
    <DashboardLayout userRole="admin">
      <div className="max-w-4xl mx-auto pb-20">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-toiral-dark mb-2">
            New Client Onboarding
          </h1>
          <p className="text-gray-500">
            Follow the steps to add a new client and set up their project.
          </p>
        </div>

        <Stepper steps={STEPS} currentStep={currentStep} className="mb-12" />

        <AnimatePresence mode="wait">
          <motion.div
            key={currentStep}
            initial={{
              opacity: 0,
              x: 20
            }}
            animate={{
              opacity: 1,
              x: 0
            }}
            exit={{
              opacity: 0,
              x: -20
            }}
            transition={{
              duration: 0.3
            }}>

            {/* STEP 1: Client Details Form */}
            {currentStep === 0 &&
            <Card className="p-8">
                <h2 className="text-xl font-bold text-toiral-dark mb-6 flex items-center gap-2">
                  <UserPlus className="w-5 h-5 text-toiral-primary" />
                  Client Information
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Input
                  label="Client Name"
                  name="clientName"
                  placeholder="e.g. John Doe"
                  value={formData.clientName}
                  onChange={handleInputChange} />

                  <Input
                  label="Company Name"
                  name="companyName"
                  placeholder="e.g. Acme Corp"
                  value={formData.companyName}
                  onChange={handleInputChange} />

                  <Input
                  label="Email Address"
                  name="email"
                  type="email"
                  placeholder="john@example.com"
                  value={formData.email}
                  onChange={handleInputChange} />

                  <Input
                  label="Phone Number"
                  name="phone"
                  placeholder="+1 (555) 000-0000"
                  value={formData.phone}
                  onChange={handleInputChange} />

                  <div className="md:col-span-2">
                    <Input
                    label="Project Name"
                    name="projectName"
                    placeholder="e.g. Website Redesign"
                    value={formData.projectName}
                    onChange={handleInputChange} />

                  </div>
                </div>
              </Card>
            }

            {/* STEP 2: Review */}
            {currentStep === 1 &&
            <Card className="p-8">
                <h2 className="text-xl font-bold text-toiral-dark mb-6">
                  Review Details
                </h2>
                <div className="bg-gray-50 rounded-2xl p-6 space-y-4">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center text-toiral-primary shadow-sm">
                      <Building className="w-6 h-6" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Company</p>
                      <p className="font-bold text-toiral-dark text-lg">
                        {formData.companyName || 'N/A'}
                      </p>
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t border-gray-200">
                    <div className="flex items-center gap-3">
                      <UserPlus className="w-4 h-4 text-gray-400" />
                      <div>
                        <p className="text-xs text-gray-500">Contact</p>
                        <p className="font-medium">{formData.clientName}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <Mail className="w-4 h-4 text-gray-400" />
                      <div>
                        <p className="text-xs text-gray-500">Email</p>
                        <p className="font-medium">{formData.email}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <Phone className="w-4 h-4 text-gray-400" />
                      <div>
                        <p className="text-xs text-gray-500">Phone</p>
                        <p className="font-medium">{formData.phone}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <Briefcase className="w-4 h-4 text-gray-400" />
                      <div>
                        <p className="text-xs text-gray-500">Project</p>
                        <p className="font-medium">{formData.projectName}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </Card>
            }

            {/* STEP 3: Team Assignment */}
            {currentStep === 2 &&
            <div className="space-y-6">
                <div className="flex justify-between items-center">
                  <h2 className="text-xl font-bold text-toiral-dark">
                    Assign Team Members
                  </h2>
                  <Badge variant="info">{formData.team.length} Selected</Badge>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {MOCK_TEAM.map((member) =>
                <TeamMemberCard
                  key={member.id}
                  {...member}
                  selected={formData.team.includes(member.id)}
                  onSelect={() => toggleTeamMember(member.id)} />

                )}
                </div>
              </div>
            }

            {/* STEP 4: Success */}
            {currentStep === 3 &&
            <div className="text-center py-8">
                <motion.div
                initial={{
                  scale: 0
                }}
                animate={{
                  scale: 1
                }}
                className="w-24 h-24 bg-green-100 text-green-500 rounded-full flex items-center justify-center mx-auto mb-6">

                  <CheckCircle className="w-12 h-12" />
                </motion.div>
                <h2 className="text-3xl font-bold text-toiral-dark mb-2">
                  Client Successfully Added!
                </h2>
                <p className="text-gray-500 mb-8">
                  Share the access code with your client so they can track their
                  project.
                </p>

                {/* Access Code Card */}
                <Card className="max-w-md mx-auto p-6 bg-toiral-dark text-white mb-6">
                  <div className="flex items-center justify-center gap-2 mb-4">
                    <Key className="w-5 h-5 text-toiral-secondary" />
                    <h3 className="font-bold text-lg">Access Code</h3>
                  </div>

                  <div className="bg-white/10 p-4 rounded-2xl mb-4">
                    <p className="text-3xl font-mono font-bold tracking-wider text-center">
                      {accessCode}
                    </p>
                  </div>

                  <button
                  onClick={copyToClipboard}
                  className="w-full flex items-center justify-center gap-2 py-3 px-4 bg-white/10 hover:bg-white/20 rounded-xl transition-colors font-medium">

                    {copied ?
                  <>
                        <Check className="w-4 h-4 text-green-400" />
                        <span className="text-green-400">Copied!</span>
                      </> :

                  <>
                        <Copy className="w-4 h-4" />
                        <span>Copy Code</span>
                      </>
                  }
                  </button>

                  <p className="text-xs text-gray-400 mt-4 text-center">
                    Client uses this code to access their project dashboard
                  </p>
                </Card>

                {/* Share Options */}
                <Card className="max-w-md mx-auto p-6 mb-8">
                  <div className="flex items-center justify-center gap-2 mb-4">
                    <Share2 className="w-5 h-5 text-toiral-primary" />
                    <h3 className="font-bold text-toiral-dark">
                      Share with Client
                    </h3>
                  </div>

                  <div className="grid grid-cols-3 gap-3">
                    <button
                    onClick={shareViaEmail}
                    className="flex flex-col items-center gap-2 p-4 bg-gray-50 hover:bg-toiral-light/20 rounded-xl transition-colors group">

                      <div className="w-10 h-10 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
                        <Mail className="w-5 h-5" />
                      </div>
                      <span className="text-xs font-medium text-gray-600">
                        Email
                      </span>
                    </button>

                    <button
                    onClick={shareViaWhatsApp}
                    className="flex flex-col items-center gap-2 p-4 bg-gray-50 hover:bg-toiral-light/20 rounded-xl transition-colors group">

                      <div className="w-10 h-10 bg-green-100 text-green-600 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
                        <Send className="w-5 h-5" />
                      </div>
                      <span className="text-xs font-medium text-gray-600">
                        WhatsApp
                      </span>
                    </button>

                    <button
                    onClick={shareViaSMS}
                    className="flex flex-col items-center gap-2 p-4 bg-gray-50 hover:bg-toiral-light/20 rounded-xl transition-colors group">

                      <div className="w-10 h-10 bg-purple-100 text-purple-600 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
                        <Phone className="w-5 h-5" />
                      </div>
                      <span className="text-xs font-medium text-gray-600">
                        SMS
                      </span>
                    </button>
                  </div>

                  <div className="mt-4 p-3 bg-toiral-light/20 rounded-xl">
                    <p className="text-xs text-gray-600 text-center">
                      <span className="font-semibold">Tip:</span> The client can
                      enter this code at the login page to access their project
                      dashboard instantly.
                    </p>
                  </div>
                </Card>

                <div className="flex justify-center gap-4">
                  <Button
                  variant="outline"
                  onClick={() => navigate('/admin/dashboard')}>

                    Go to Dashboard
                  </Button>
                  <Button onClick={() => navigate('/admin/clients/1')}>
                    View Client Profile
                  </Button>
                </div>
              </div>
            }
          </motion.div>
        </AnimatePresence>

        {/* Navigation Buttons */}
        {currentStep < 3 &&
        <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-100 p-4 md:pl-80 z-20">
            <div className="max-w-4xl mx-auto flex justify-between items-center">
              <Button
              variant="ghost"
              onClick={handleBack}
              disabled={currentStep === 0}
              className={currentStep === 0 ? 'invisible' : ''}>

                <ArrowLeft className="w-4 h-4 mr-2" /> Back
              </Button>
              <Button onClick={handleNext} loading={loading}>
                {currentStep === 2 ? 'Create Client' : 'Continue'}
                {!loading && <ArrowRight className="w-4 h-4 ml-2" />}
              </Button>
            </div>
          </div>
        }
      </div>
    </DashboardLayout>);

}