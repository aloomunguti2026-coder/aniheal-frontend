import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/navigation/Navbar';
import Footer from '../components/navigation/Footer';
import collaborationService from '../services/collaborationService';

export default function Collaborations() {
  const [collaborations, setCollaborations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');

  // Active Story Modal state
  const [activeStory, setActiveStory] = useState(null);

  // Comment submission state
  const [commentForm, setCommentForm] = useState({
    name: '',
    email: '',
    comment: '',
  });
  const [submittingComment, setSubmittingComment] = useState(false);
  const [commentSuccess, setCommentSuccess] = useState(null);
  const [commentError, setCommentError] = useState(null);

  const categories = [
    'All',
    'One Health Research',
    'Community Outreach',
    'Academic & Training',
    'Livestock & Dairy Sector',
    'Wildlife & Conservation',
    'General Partnership',
  ];

  const fetchStories = async () => {
    try {
      setLoading(true);
      setError(null);
      const params = {};
      if (selectedCategory !== 'All') params.category = selectedCategory;
      if (searchQuery.trim()) params.search = searchQuery.trim();

      const res = await collaborationService.getCollaborations(params);
      if (res && res.success) {
        setCollaborations(res.data || []);
      }
    } catch (err) {
      console.error('Failed to load collaborations:', err);
      setError('Unable to load collaboration stories. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStories();
  }, [selectedCategory]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchStories();
  };

  const handleOpenStory = (story) => {
    setActiveStory(story);
    setCommentForm({ name: '', email: '', comment: '' });
    setCommentSuccess(null);
    setCommentError(null);
  };

  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    if (!commentForm.name.trim() || !commentForm.comment.trim()) {
      setCommentError('Please provide your name and a comment.');
      return;
    }

    try {
      setSubmittingComment(true);
      setCommentError(null);
      const res = await collaborationService.addComment(activeStory._id, commentForm);
      if (res.success) {
        setCommentSuccess('Thank you! Your comment has been posted.');
        const updatedComments = [...(activeStory.comments || []), res.data];
        setActiveStory({ ...activeStory, comments: updatedComments });
        // Also update in list
        setCollaborations((prev) =>
          prev.map((c) => (c._id === activeStory._id ? { ...c, comments: updatedComments, commentsCount: updatedComments.length } : c))
        );
        setCommentForm({ name: '', email: '', comment: '' });
      }
    } catch (err) {
      setCommentError(err.response?.data?.message || 'Failed to submit comment. Please try again.');
    } finally {
      setSubmittingComment(false);
    }
  };

  return (
    <div className="bg-surface font-body-md text-on-surface antialiased min-h-screen flex flex-col">
      <Navbar />

      <main className="flex-1 w-full pt-20">
        {/* Hero Section */}
      <section className="relative py-16 lg:py-20 bg-gradient-to-b from-primary/10 via-surface-tinted/40 to-surface border-b border-border-hairline overflow-hidden">
        <div className="max-w-[1280px] mx-auto px-margin-mobile lg:px-margin text-center relative z-10">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-primary font-label-md text-label-md font-bold mb-4 animate-fade-in">
            {/* <span className="material-symbols-outlined text-[18px]">handshake</span> */}
            {/* <span></span> */}
          </div>
          <h1 className="font-headline-lg lg:text-[44px] text-on-surface font-extrabold tracking-tight max-w-3xl mx-auto leading-tight">
            Collaborations &amp; One Health Initiatives
          </h1>
          <p className="mt-4 text-on-surface-variant font-body-lg text-body-lg max-w-2xl mx-auto">
            Discover how AniHeal bridges clinical veterinary expertise with leading research institutes, academic faculties, government agencies, and pastoralist cooperatives.
          </p>

          {/* Search & Filter Form */}
          <div className="mt-8 max-w-xl mx-auto">
            <form onSubmit={handleSearchSubmit} className="relative flex items-center shadow-md rounded-2xl overflow-hidden border border-border-hairline bg-surface-clinical">
              <input
                type="text"
                placeholder="Search partnerships, research, partners..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-28 py-3.5 bg-transparent text-on-surface text-body-md focus:outline-none placeholder:text-outline"
              />
              <span className="material-symbols-outlined absolute left-4 text-outline">search</span>
              <button
                type="submit"
                className="absolute right-2 px-4 py-2 rounded-xl bg-primary text-on-primary font-label-md text-label-md font-bold hover:bg-primary-dark transition-colors shadow-sm"
              >
                Search
              </button>
            </form>
          </div>

          {/* Category Tabs */}
          <div className="mt-6 flex flex-wrap items-center justify-center gap-2">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-4 py-2 rounded-full font-label-md text-label-md font-bold transition-all ${selectedCategory === cat
                    ? 'bg-primary text-on-primary shadow-sm scale-105'
                    : 'bg-surface-clinical text-on-surface-variant hover:bg-surface-tinted border border-border-hairline'
                  }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Main Content Grid */}
      <section className="py-12 lg:py-16 max-w-[1280px] mx-auto px-margin-mobile lg:px-margin flex-1 w-full">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 gap-4">
            <div className="w-10 h-10 border-3 border-primary border-t-transparent rounded-full animate-spin"></div>
            <span className="text-on-surface-variant font-label-md">Loading collaboration stories...</span>
          </div>
        ) : error ? (
          <div className="text-center py-16 max-w-md mx-auto">
            <span className="material-symbols-outlined text-[48px] text-error">error</span>
            <p className="mt-2 text-on-surface font-body-lg">{error}</p>
            <button
              onClick={fetchStories}
              className="mt-4 px-5 py-2.5 rounded-full bg-primary text-on-primary font-bold font-label-md"
            >
              Retry
            </button>
          </div>
        ) : collaborations.length === 0 ? (
          <div className="text-center py-20 bg-surface-clinical rounded-3xl border border-border-hairline p-8 max-w-md mx-auto">
            <span className="material-symbols-outlined text-[52px] text-outline">newspaper</span>
            <h3 className="text-headline-sm font-bold text-on-surface mt-3">No Stories Found</h3>
            <p className="text-on-surface-variant text-body-sm mt-1">
              No collaborations match your current filter criteria. Check back soon or reset filters.
            </p>
            <button
              onClick={() => {
                setSelectedCategory('All');
                setSearchQuery('');
              }}
              className="mt-4 px-4 py-2 rounded-xl bg-surface-tinted text-primary font-bold text-label-md"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {collaborations.map((item) => (
              <article
                key={item._id}
                className="group bg-surface-clinical rounded-3xl border border-border-hairline overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1 flex flex-col"
              >
                {/* Image & Category Badge */}
                <div className="relative h-56 w-full overflow-hidden bg-surface-tinted">
                  <img
                    src={item.imageUrl || 'https://images.unsplash.com/photo-1576765608535-5f04d1e3f289?auto=format&fit=crop&w=1200&q=80'}
                    alt={item.header}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    loading="lazy"
                  />
                  <div className="absolute top-4 left-4">
                    <span className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-surface-clinical/90 backdrop-blur-md text-primary shadow-sm border border-border-hairline">
                      {item.category}
                    </span>
                  </div>
                  {item.featured && (
                    <div className="absolute top-4 right-4">
                      <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-amber-500 text-white shadow-sm flex items-center gap-1">
                        <span className="material-symbols-outlined text-[14px]">star</span>
                        Featured
                      </span>
                    </div>
                  )}
                </div>

                {/* Content */}
                <div className="p-6 flex-1 flex flex-col justify-between">
                  <div>
                    {item.partnerName && (
                      <div className="flex items-center gap-1.5 text-xs font-bold text-secondary uppercase tracking-wider mb-2">
                        <span className="material-symbols-outlined text-[16px]">corporate_fare</span>
                        <span>{item.partnerName}</span>
                      </div>
                    )}
                    <h2 className="font-headline-sm text-[20px] font-bold text-on-surface line-clamp-2 group-hover:text-primary transition-colors leading-snug">
                      {item.header}
                    </h2>
                    <p className="mt-3 text-body-sm text-on-surface-variant line-clamp-3">
                      {item.summary || (item.content ? item.content.slice(0, 140) + '...' : '')}
                    </p>
                  </div>

                  {/* Footer Action */}
                  <div className="mt-6 pt-4 border-t border-border-hairline flex items-center justify-between">
                    <div className="flex items-center gap-1 text-xs text-outline font-semibold">
                      <span className="material-symbols-outlined text-[16px]">chat_bubble</span>
                      <span>{(item.comments || []).length} comments</span>
                    </div>
                    <button
                      onClick={() => handleOpenStory(item)}
                      className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-surface-tinted text-primary font-bold text-label-md hover:bg-primary hover:text-on-primary transition-colors"
                    >
                      <span>Read Story</span>
                      <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
                    </button>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
        </section>
      </main>

      <Footer />

      {/* Active Story Modal */}
      {activeStory && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-surface-clinical rounded-3xl max-w-4xl w-full max-h-[90vh] overflow-y-auto border border-border-hairline shadow-2xl relative my-8 animate-scale-in">
            {/* Close Button */}
            <button
              onClick={() => setActiveStory(null)}
              className="absolute top-4 right-4 z-20 w-10 h-10 rounded-full bg-surface/80 backdrop-blur-md text-on-surface hover:bg-surface flex items-center justify-center shadow-md transition-colors"
            >
              <span className="material-symbols-outlined text-[20px]">close</span>
            </button>

            {/* Modal Hero Banner */}
            <div className="relative h-64 sm:h-80 w-full overflow-hidden">
              <img
                src={activeStory.imageUrl}
                alt={activeStory.header}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent"></div>
              <div className="absolute bottom-6 left-6 right-6 text-white">
                <div className="flex items-center gap-2 mb-2">
                  <span className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-primary text-white">
                    {activeStory.category}
                  </span>
                  {activeStory.partnerName && (
                    <span className="text-xs font-semibold text-gray-200">
                      Partner: {activeStory.partnerName}
                    </span>
                  )}
                </div>
                <h1 className="text-2xl sm:text-3xl font-extrabold leading-tight">
                  {activeStory.header}
                </h1>
              </div>
            </div>

            {/* Story Content Body */}
            <div className="p-6 sm:p-10 space-y-8">
              {/* Summary Lead */}
              {activeStory.summary && (
                <div className="p-4 rounded-2xl bg-surface-tinted/60 border-l-4 border-primary font-body-lg text-primary-dark font-medium italic">
                  "{activeStory.summary}"
                </div>
              )}

              {/* Body Text */}
              <div className="prose max-w-none text-on-surface font-body-md text-body-lg leading-relaxed whitespace-pre-line space-y-4">
                {activeStory.content}
              </div>

              {/* Partner Website Link */}
              {activeStory.externalUrl && (
                <div className="p-4 rounded-2xl bg-surface-tinted/40 border border-border-hairline flex flex-col sm:flex-row items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <span className="material-symbols-outlined text-[28px] text-primary">link</span>
                    <div>
                      <p className="font-bold text-on-surface text-label-md">Official Partner Link</p>
                      <p className="text-xs text-outline">Learn more directly on their institutional portal</p>
                    </div>
                  </div>
                  <a
                    href={activeStory.externalUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-4 py-2 rounded-xl bg-primary text-on-primary font-bold text-label-md hover:bg-primary-dark transition-colors flex items-center gap-1.5 shrink-0"
                  >
                    <span>Visit Partner</span>
                    <span className="material-symbols-outlined text-[16px]">open_in_new</span>
                  </a>
                </div>
              )}

              {/* COMMENTS SECTION */}
              <div className="pt-8 border-t border-border-hairline">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-primary text-[24px]">forum</span>
                    <h3 className="text-xl font-bold text-on-surface">
                      Comments &amp; Discussions ({(activeStory.comments || []).length})
                    </h3>
                  </div>
                </div>

                {/* List of Existing Comments */}
                <div className="space-y-4 mb-8">
                  {(activeStory.comments || []).length === 0 ? (
                    <p className="text-on-surface-variant text-body-sm italic py-4">
                      No comments yet on this collaboration story. Be the first to share your feedback or inquiry below!
                    </p>
                  ) : (
                    activeStory.comments.map((comment, idx) => (
                      <div
                        key={idx}
                        className={`p-4 rounded-2xl border ${comment.isStaff
                            ? 'bg-primary/5 border-primary/20'
                            : 'bg-surface border-border-hairline'
                          }`}
                      >
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-on-surface text-label-md">
                              {comment.name}
                            </span>
                            {comment.isStaff && (
                              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-primary text-on-primary uppercase tracking-wider">
                                AniHeal Staff
                              </span>
                            )}
                          </div>
                          <span className="text-[11px] text-outline">
                            {new Date(comment.createdAt).toLocaleDateString(undefined, {
                              year: 'numeric',
                              month: 'short',
                              day: 'numeric',
                            })}
                          </span>
                        </div>
                        <p className="text-on-surface-variant text-body-md whitespace-pre-line">
                          {comment.comment}
                        </p>
                      </div>
                    ))
                  )}
                </div>

                {/* Add a Comment Form */}
                <div className="bg-surface rounded-2xl p-6 border border-border-hairline">
                  <h4 className="font-bold text-on-surface text-label-lg mb-4 flex items-center gap-2">
                    <span className="material-symbols-outlined text-[20px] text-primary">add_comment</span>
                    Leave a Comment or Inquiry
                  </h4>

                  {commentSuccess && (
                    <div className="mb-4 p-3 rounded-xl bg-green-50 border border-green-200 text-green-800 text-sm font-medium flex items-center gap-2">
                      <span className="material-symbols-outlined text-[20px]">check_circle</span>
                      {commentSuccess}
                    </div>
                  )}

                  {commentError && (
                    <div className="mb-4 p-3 rounded-xl bg-error/10 border border-error/20 text-error text-sm font-medium flex items-center gap-2">
                      <span className="material-symbols-outlined text-[20px]">error</span>
                      {commentError}
                    </div>
                  )}

                  <form onSubmit={handleCommentSubmit} className="space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-bold text-on-surface-variant mb-1 uppercase tracking-wider">
                          Your Name *
                        </label>
                        <input
                          type="text"
                          required
                          value={commentForm.name}
                          onChange={(e) => setCommentForm({ ...commentForm, name: e.target.value })}
                          placeholder="e.g., Dr. Mary Wangui"
                          className="w-full px-4 py-2.5 rounded-xl border border-border-hairline bg-surface-clinical text-on-surface text-body-md focus:outline-none focus:border-primary"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-on-surface-variant mb-1 uppercase tracking-wider">
                          Email (Optional, not published)
                        </label>
                        <input
                          type="email"
                          value={commentForm.email}
                          onChange={(e) => setCommentForm({ ...commentForm, email: e.target.value })}
                          placeholder="e.g., mary@domain.com"
                          className="w-full px-4 py-2.5 rounded-xl border border-border-hairline bg-surface-clinical text-on-surface text-body-md focus:outline-none focus:border-primary"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-on-surface-variant mb-1 uppercase tracking-wider">
                        Comment Content *
                      </label>
                      <textarea
                        rows={3}
                        required
                        value={commentForm.comment}
                        onChange={(e) => setCommentForm({ ...commentForm, comment: e.target.value })}
                        placeholder="Write your feedback, question, or partnership perspective here..."
                        className="w-full px-4 py-2.5 rounded-xl border border-border-hairline bg-surface-clinical text-on-surface text-body-md focus:outline-none focus:border-primary"
                      ></textarea>
                    </div>

                    <button
                      type="submit"
                      disabled={submittingComment}
                      className="px-6 py-2.5 rounded-xl bg-primary text-on-primary font-bold text-label-md hover:bg-primary-dark transition-all disabled:opacity-50 flex items-center gap-2 shadow-sm"
                    >
                      {submittingComment ? (
                        <>
                          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                          <span>Posting Comment...</span>
                        </>
                      ) : (
                        <>
                          <span className="material-symbols-outlined text-[18px]">send</span>
                          <span>Submit Comment</span>
                        </>
                      )}
                    </button>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
