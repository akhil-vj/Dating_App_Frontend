import React, { useState } from 'react';
import { X, HelpCircle, ChevronRight, Search, MessageCircle, User, Heart, Settings, ArrowLeft } from 'lucide-react';

export const HelpCenter = ({ onClose = () => {} }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [selectedArticle, setSelectedArticle] = useState(null);

  // Help categories with articles
  const helpCategories = [
    {
      id: 'getting-started',
      title: 'Getting Started',
      icon: <User size={20} />,
      articles: [
        {
          id: 'create-profile',
          title: 'Create Your Perfect Profile',
          content: `
            <p>A great profile is your first step to meaningful connections! Here's how to set up your profile:</p>
            <ol>
              <li>Tap on the profile icon in the bottom menu</li>
              <li>Select "Edit Profile"</li>
              <li>Add your best photos - clear face shots work best!</li>
              <li>Fill in your details honestly</li>
              <li>Add your interests to find better matches</li>
            </ol>
            <p>Pro tip: Profiles with verified photos get 50% more matches!</p>
          `
        },
        {
          id: 'profile-photos',
          title: 'Photo Tips for More Matches',
          content: `
            <p>Your photos make a huge difference in the quality and quantity of your matches.</p>
            <h4>Do's:</h4>
            <ul>
              <li>Use recent photos that look like you</li>
              <li>Include at least one clear face photo</li>
              <li>Show your interests and personality</li>
              <li>Verify your profile for trust</li>
            </ul>
            <h4>Don'ts:</h4>
            <ul>
              <li>Don't use heavily filtered photos</li>
              <li>Avoid group photos where it's hard to identify you</li>
              <li>Don't use old photos that don't represent how you look now</li>
            </ul>
          `
        }
      ]
    },
    {
      id: 'matching',
      title: 'Finding Matches',
      icon: <Heart size={20} />,
      articles: [
        {
          id: 'how-matching-works',
          title: 'How Matching Works',
          content: `
            <p>Matching on Malayali Match is simple and fun!</p>
            <p>When you see a profile you like, swipe right or tap the heart button. If you're not interested, swipe left or tap the X.</p>
            <p>When someone you've liked also likes you back, it's a match! You'll both be notified, and you can start chatting right away.</p>
            <p>Our matching algorithm considers your preferences, location, and activity to show you the most compatible profiles.</p>
          `
        },
        {
          id: 'preferences',
          title: 'Setting Your Preferences',
          content: `
            <p>To find the most compatible matches, set up your preferences:</p>
            <ol>
              <li>Tap the Settings icon on the discover screen</li>
              <li>Adjust age range, distance, and other preferences</li>
              <li>Select what you're looking for (casual dating, relationship, etc.)</li>
              <li>Set religious preferences if important to you</li>
            </ol>
            <p>You can update these preferences anytime to see different match suggestions.</p>
          `
        }
      ]
    },
    {
      id: 'messaging',
      title: 'Messaging & Communication',
      icon: <MessageCircle size={20} />,
      articles: [
        {
          id: 'starting-conversations',
          title: 'Starting Great Conversations',
          content: `
            <p>Breaking the ice can be challenging, but these tips help:</p>
            <ul>
              <li>Reference something specific from their profile</li>
              <li>Ask open-ended questions that require more than yes/no answers</li>
              <li>Be genuine and authentic in your communication</li>
              <li>Keep initial messages lighthearted and friendly</li>
            </ul>
            <p>Remember: Quality conversations lead to quality connections!</p>
          `
        },
        {
          id: 'video-calls',
          title: 'Using Video & Voice Calls',
          content: `
            <p>When you're ready to take your conversation further:</p>
            <ol>
              <li>Open the chat with your match</li>
              <li>Tap the phone or video icon in the top right</li>
              <li>Wait for them to accept the call</li>
            </ol>
            <p>For your safety, we recommend getting to know someone through text chat before moving to calls.</p>
            <p>All calls are encrypted and private between you and your match.</p>
          `
        }
      ]
    },
    {
      id: 'safety',
      title: 'Safety & Privacy',
      icon: <Settings size={20} />,
      articles: [
        {
          id: 'staying-safe',
          title: 'Staying Safe While Dating',
          content: `
            <p>Your safety is our top priority. Follow these guidelines:</p>
            <ul>
              <li>Chat within the app before sharing contact information</li>
              <li>Meet in public places for first dates</li>
              <li>Tell a friend where you're going and who you're meeting</li>
              <li>Trust your instincts - if something feels wrong, it probably is</li>
              <li>Report inappropriate behavior through the app</li>
            </ul>
            <p>Remember: Never send money or financial information to matches.</p>
          `
        },
        {
          id: 'reporting',
          title: 'Reporting Issues & Concerns',
          content: `
            <p>If you encounter inappropriate behavior:</p>
            <ol>
              <li>Open the profile of the person</li>
              <li>Tap the three dots in the top right</li>
              <li>Select "Report" and choose a reason</li>
              <li>Provide details of the incident</li>
            </ol>
            <p>Our safety team reviews all reports promptly and takes appropriate action.</p>
            <p>Your report will remain anonymous.</p>
          `
        }
      ]
    }
  ];

  // Filter categories and articles based on search
  const filteredCategories = searchTerm 
    ? helpCategories.map(category => ({
        ...category,
        articles: category.articles.filter(article =>
          article.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          article.content.toLowerCase().includes(searchTerm.toLowerCase())
        )
      })).filter(category => category.articles.length > 0)
    : helpCategories;

  const handleBackButton = () => {
    if (selectedArticle) {
      setSelectedArticle(null);
    } else if (selectedCategory) {
      setSelectedCategory(null);
    } else {
      if (typeof onClose === 'function') {
        onClose();
      }
    }
  };

  const renderMainMenu = () => (
    <>
      <div className="mb-6">
        <div className="relative">
          <input
            type="text"
            placeholder="Search help topics..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
          />
          <Search className="absolute left-3 top-2.5 text-gray-400" size={18} />
        </div>
      </div>

      <div className="space-y-2">
        {filteredCategories.length > 0 ? (
          filteredCategories.map(category => (
            <div key={category.id}>
              <button
                onClick={() => setSelectedCategory(category)}
                className="w-full flex justify-between items-center p-3 bg-white hover:bg-gray-50 rounded-lg border border-gray-200 transition-colors"
              >
                <div className="flex items-center">
                  <span className="w-8 h-8 flex items-center justify-center bg-yellow-100 text-yellow-600 rounded-full mr-3">
                    {category.icon}
                  </span>
                  <span className="font-medium">{category.title}</span>
                </div>
                <ChevronRight size={20} className="text-gray-400" />
              </button>
            </div>
          ))
        ) : (
          <div className="flex flex-col items-center py-8 text-center">
            <div className="text-gray-400 mb-4">
              <HelpCircle size={48} />
            </div>
            <p className="text-gray-600 mb-2">No results found for "{searchTerm}"</p>
            <p className="text-sm text-gray-500">Try different keywords or browse the categories</p>
          </div>
        )}
      </div>
    </>
  );

  const renderCategoryArticles = () => {
    if (!selectedCategory) return null;
    
    return (
      <>
        <div className="space-y-3">
          {selectedCategory.articles.map(article => (
            <button
              key={article.id}
              onClick={() => setSelectedArticle(article)}
              className="w-full flex justify-between items-center p-3 bg-white hover:bg-gray-50 rounded-lg border border-gray-200 transition-colors text-left"
            >
              <span>{article.title}</span>
              <ChevronRight size={18} className="text-gray-400 flex-shrink-0" />
            </button>
          ))}
        </div>
      </>
    );
  };

  const renderArticle = () => {
    if (!selectedArticle) return null;
    
    return (
      <div className="article-content">
        <h2 className="text-xl font-bold mb-4">{selectedArticle.title}</h2>
        <div 
          className="prose prose-sm prose-yellow max-w-none"
          dangerouslySetInnerHTML={{ __html: selectedArticle.content }}
        />
        
        <div className="mt-8 p-4 bg-blue-50 rounded-lg text-sm">
          <p className="font-medium text-blue-700 mb-2">Was this helpful?</p>
          <div className="flex space-x-2">
            <button className="px-4 py-2 bg-white border border-blue-300 text-blue-700 rounded-lg hover:bg-blue-100">
              Yes
            </button>
            <button className="px-4 py-2 bg-white border border-blue-300 text-blue-700 rounded-lg hover:bg-blue-100">
              No
            </button>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 overflow-y-auto py-4">
      <div className="bg-white rounded-lg w-full max-w-md max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white z-10 border-b p-4 flex justify-between items-center">
          <div className="flex items-center">
            {(selectedCategory || selectedArticle) && (
              <button 
                onClick={handleBackButton}
                className="p-2 -ml-2 rounded-full hover:bg-gray-100 mr-1"
                aria-label="Back"
              >
                <ArrowLeft size={20} />
              </button>
            )}
            <h2 className="text-xl font-semibold">
              {selectedArticle ? selectedArticle.title : 
               selectedCategory ? selectedCategory.title : 'Help Center'}
            </h2>
          </div>
          <button 
            onClick={() => {
              if (typeof onClose === 'function') {
                onClose();
              }
            }}
            className="p-2 rounded-full hover:bg-gray-100"
            aria-label="Close"
          >
            <X size={20} />
          </button>
        </div>

        {/* Content */}
        <div className="p-4">
          {!selectedCategory && renderMainMenu()}
          {selectedCategory && !selectedArticle && renderCategoryArticles()}
          {selectedArticle && renderArticle()}
        </div>
      </div>
    </div>
  );
};
