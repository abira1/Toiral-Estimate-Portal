import React, { useState } from 'react';
import {
  MorphLoading,
  LoadingOverlay,
  InlineLoading } from
'../components/ui/MorphLoading';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
export function LoadingDemo() {
  const [showOverlay, setShowOverlay] = useState(false);
  const handleShowOverlay = () => {
    setShowOverlay(true);
    setTimeout(() => setShowOverlay(false), 3000);
  };
  return (
    <div className="min-h-screen bg-toiral-bg p-8">
      <LoadingOverlay isLoading={showOverlay} message="Loading your data..." />

      <div className="max-w-4xl mx-auto space-y-8">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-toiral-dark mb-2">
            Loading Animations
          </h1>
          <p className="text-gray-500">
            Morph loading animation with Toiral theme colors
          </p>
        </div>

        {/* Size Variants */}
        <Card className="p-8">
          <h2 className="text-xl font-bold text-toiral-dark mb-6">
            Size Variants
          </h2>
          <div className="flex items-center justify-around flex-wrap gap-8">
            <div className="text-center">
              <MorphLoading size="sm" color="primary" />
              <p className="mt-4 text-sm text-gray-500">Small</p>
            </div>
            <div className="text-center">
              <MorphLoading size="md" color="primary" />
              <p className="mt-4 text-sm text-gray-500">Medium</p>
            </div>
            <div className="text-center">
              <MorphLoading size="lg" color="primary" />
              <p className="mt-4 text-sm text-gray-500">Large</p>
            </div>
          </div>
        </Card>

        {/* Color Variants */}
        <Card className="p-8">
          <h2 className="text-xl font-bold text-toiral-dark mb-6">
            Color Variants
          </h2>
          <div className="flex items-center justify-around flex-wrap gap-8">
            <div className="text-center">
              <MorphLoading size="md" color="primary" />
              <p className="mt-4 text-sm text-gray-500">Primary</p>
            </div>
            <div className="text-center">
              <MorphLoading size="md" color="dark" />
              <p className="mt-4 text-sm text-gray-500">Dark</p>
            </div>
            <div className="text-center">
              <MorphLoading size="md" color="secondary" />
              <p className="mt-4 text-sm text-gray-500">Secondary</p>
            </div>
            <div className="text-center bg-toiral-dark p-6 rounded-2xl">
              <MorphLoading size="md" color="light" />
              <p className="mt-4 text-sm text-toiral-light">Light</p>
            </div>
          </div>
        </Card>

        {/* Full Page Overlay */}
        <Card className="p-8">
          <h2 className="text-xl font-bold text-toiral-dark mb-4">
            Full Page Overlay
          </h2>
          <p className="text-gray-500 mb-6">
            Click the button to see the loading overlay (auto-closes after 3s)
          </p>
          <Button onClick={handleShowOverlay}>Show Loading Overlay</Button>
        </Card>

        {/* Inline Loading */}
        <Card className="p-8">
          <h2 className="text-xl font-bold text-toiral-dark mb-6">
            Inline Loading
          </h2>
          <div className="flex items-center gap-4">
            <Button disabled className="flex items-center gap-2">
              <InlineLoading className="text-white" />
              Processing...
            </Button>
            <span className="text-gray-500 text-sm">
              For buttons and small areas
            </span>
          </div>
        </Card>

        {/* Usage Code */}
        <Card className="p-8">
          <h2 className="text-xl font-bold text-toiral-dark mb-4">Usage</h2>
          <pre className="bg-gray-900 text-gray-100 p-4 rounded-xl text-sm overflow-x-auto">
            {`import { MorphLoading, LoadingOverlay } from './components/ui/MorphLoading'

// Basic usage
<MorphLoading size="md" color="primary" />

// Full page overlay
<LoadingOverlay isLoading={isLoading} message="Loading..." />

// Inline for buttons
<InlineLoading className="text-white" />`}
          </pre>
        </Card>
      </div>
    </div>);

}