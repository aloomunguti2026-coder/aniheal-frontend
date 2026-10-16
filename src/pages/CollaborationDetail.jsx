import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import collaborationService from '../services/collaborationService';
import Navbar from '../components/navigation/Navbar';
import Footer from '../components/navigation/Footer';

export default function CollaborationDetail() {
  const { slug } = useParams();

  const [story, setStory] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Comment submission state
  const [commentName, setCommentName] = useState('');
  const [commentEmail, setCommentEmail] = useState('');
  const [commentBody, setCommentBody] = useState('');
  const [submittingComment, setSubmittingComment] = useState(false);
  const [commentSuccessMsg, setCommentSuccessMsg] = useState('');
  const [commentErrorMsg, setCommentErrorMsg] = useState('');

  useEffect(() => {
    fetchStory();
    window.scrollTo(0, 0);
  }, [slug]);

  const fetchStory = async () => {
    try {
      setLoading(true);
      setError('');
      const res = await collaborationService.getCollaborationBySlug(slug);
      if (res && res.success && res.data) {
        setStory(res.data);
      } else {
        setError('Collaboration article or research story not found.');
      }
    } catch (err) {
      console.error('Error fetching collaboration details:', err);
      setError('Unable to load collaboration article. Please verify your connection.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (story) {
      const prevTitle = document.title;
      document.title = `${story.header} | AniHeal Collaborations & Research`;

      let metaDesc = document.querySelector('meta[name="description"]');
      let createdDesc = false;
      if (!metaDesc) {
        metaDesc = document.createElement('meta');
        metaDesc.name = 'description';
        document.head.appendChild(metaDesc);
        createdDesc = true;
      }
      const prevDesc = metaDesc.getAttribute('content');
      metaDesc.setAttribute(
        'content',
        story.summary?.slice(0, 155) ||
          story.content?.slice(0, 155) ||
          `Read about AniHeal's collaboration: ${story.header}. Advancing One Health in Kenya.`
      );

      return () => {
        document.title = prevTitle;
        if (createdDesc) {
          metaDesc.remove();
        } else if (prevDesc) {
          metaDesc.setAttribute('content', prevDesc);
        }
      };
    }
  }, [story]);

  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    if (!commentName || !commentBody) {
      setCommentErrorMsg('Please provide your name and comment message.');
      return;
    }

    try {
      setSubmittingComment(true);
      setCommentErrorMsg('');
      setCommentSuccessMsg('');

      const res = await collaborationService.addComment(story._id, {
        name: commentName,
        email: commentEmail,
        comment: commentBody,
      });

      if (res.success) {
        setCommentSuccessMsg('Your comment has been submitted and is pending approval.');
        setCommentName('');
        setCommentEmail('');
        setCommentBody('');
      } else {
        setCommentErrorMsg(res.message || 'Failed to submit comment.');
      }
    } catch (err) {
      console.error('Comment error:', err);
      setCommentErrorMsg('Unable to submit comment. Please try again.');
    } finally {
      setSubmittingComment(false);
    }
  };

  return (
    <div className="min-h-screen bg-surface flex flex-col text-on-surface">
      <Navbar />

      <main className="flex-1 pt-24 pb-16">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-24 space-y-4">
            <div className="w-12 h-12 border-3 border-primary/20 border-t-primary rounded-full animate-spin"></div>
            <p className="font-body-md text-on-surface-variant font-medium">Loading research collaboration article...</p>
          </div>
        ) : error || !story ? (
          <div className="max-w-xl mx-auto px-4 py-20 text-center space-y-4">
            <div className="w-16 h-16 rounded-full bg-error-container/40 text-error flex items-center justify-center mx-auto">
              <span className="material-symbols-outlined text-[36px]">article</span>
            </div>
            <h2 className="font-headline-sm text-2xl font-bold text-on-surface">Collaboration Article Not Found</h2>
            <p className="text-body-md text-on-surface-variant">
              The requested research case study or partnership initiative may have been relocated.
            </p>
            <Link
              to="/collaborations"
              className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-primary text-on-primary font-label-md font-semibold"
            >
              <span className="material-symbols-outlined text-[18px]">arrow_back</span>
              <span>Back to Collaborations Desk</span>
            </Link>
          </div>
        ) : (
          <article className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
            {/* Breadcrumb Navigation */}
            <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-label-sm text-outline pt-2">
              <Link to="/" className="hover:text-primary transition-colors">Home</Link>
              <span>/</span>
              <Link to="/collaborations" className="hover:text-primary transition-colors">Collaborations &amp; Initiatives</Link>
              <span>/</span>
              <span className="text-primary font-semibold truncate">{story.header}</span>
            </nav>

            {/* Article Header */}
            <div className="space-y-4">
              <div className="flex flex-wrap items-center gap-2">
                <span className="px-3.5 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-primary/10 text-primary border border-primary/20">
                  {story.category || 'General Partnership'}
                </span>
                {story.partnerName && (
                  <span className="px-3 py-1 rounded-full text-xs font-semibold bg-surface-tinted text-secondary flex items-center gap-1.5 border border-border-hairline">
                    <span className="material-symbols-outlined text-[16px]">corporate_fare</span>
                    <span>Partner: {story.partnerName}</span>
                  </span>
                )}
                {story.publishedAt && (
                  <span className="text-xs text-outline font-medium">
                    {new Date(story.publishedAt).toLocaleDateString('en-KE', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                    })}
                  </span>
                )}
              </div>

              <h1 className="font-headline-xl text-3xl sm:text-4xl lg:text-5xl font-extrabold text-on-surface leading-tight tracking-tight">
                {story.header}
              </h1>
            </div>

            {/* Hero Image */}
            {story.imageUrl && (
              <div className="relative aspect-video rounded-3xl overflow-hidden shadow-lg border border-border-hairline bg-surface-tinted">
                <img
                  src={story.imageUrl}
                  alt={story.header}
                  className="w-full h-full object-cover"
                />
              </div>
            )}

            {/* Summary Lead Callout */}
            {story.summary && (
              <div className="p-6 rounded-3xl bg-surface-tinted/70 border-l-4 border-primary text-body-lg text-on-surface font-medium leading-relaxed italic">
                "{story.summary}"
              </div>
            )}

            {/* Article Body Content */}
            <div className="prose max-w-none text-on-surface font-body-md text-base sm:text-lg leading-relaxed whitespace-pre-line space-y-4">
              {story.content}
            </div>

            {/* External Partner Resource Link */}
            {story.externalUrl && (
              <div className="p-6 rounded-2xl bg-surface-clinical border border-border-hairline flex flex-col sm:flex-row items-center justify-between gap-4 shadow-sm">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-surface-tinted text-primary flex items-center justify-center">
                    <span className="material-symbols-outlined text-[24px]">link</span>
                  </div>
                  <div>
                    <h3 className="font-label-lg font-bold text-on-surface">Institutional External Resource</h3>
                    <p className="text-xs text-on-surface-variant">View joint portal or publication repository</p>
                  </div>
                </div>
                <a
                  href={story.externalUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-5 py-2.5 rounded-full bg-primary text-on-primary font-label-md text-sm font-semibold flex items-center gap-1.5 hover:bg-secondary transition-colors"
                >
                  <span>Visit Partner Website</span>
                  <span className="material-symbols-outlined text-[16px]">open_in_new</span>
                </a>
              </div>
            )}

            {/* Author / Practice Accreditation Box */}
            <div className="p-6 rounded-3xl bg-surface-tinted/40 border border-border-hairline flex items-center gap-4">
              <img src="/logo.png" alt="AniHeal Official Logo" className="w-12 h-12 object-contain" />
              <div>
                <h4 className="font-headline-sm text-base font-bold text-on-surface">AniHeal Veterinary Solutions</h4>
                <p className="text-xs text-on-surface-variant leading-relaxed">
                  Advancing sustainable One Health field initiatives, clinical trials, and agro-pastoral capacity building across Kenya.
                </p>
              </div>
            </div>

            {/* Comments & Discussion */}
            <div className="pt-8 border-t border-border-hairline space-y-6">
              <h2 className="font-headline-sm text-2xl font-bold text-on-surface flex items-center gap-2">
                <span className="material-symbols-outlined text-primary text-[28px]">forum</span>
                <span>Clinical Discussion &amp; Feedback ({(story.comments || []).length})</span>
              </h2>

              {/* Existing Comments */}
              <div className="space-y-4">
                {(story.comments || []).length === 0 ? (
                  <p className="text-sm text-on-surface-variant italic py-2">
                    No community discussions posted yet. Be the first to comment on this initiative.
                  </p>
                ) : (
                  story.comments.map((comm, idx) => (
                    <div key={idx} className="p-5 rounded-2xl bg-surface-clinical border border-border-hairline space-y-2">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div className="w-7 h-7 rounded-full bg-primary/10 text-primary font-bold flex items-center justify-center text-xs">
                            {comm.name?.charAt(0).toUpperCase()}
                          </div>
                          <span className="font-label-md font-bold text-on-surface">{comm.name}</span>
                          {comm.isStaff && (
                            <span className="px-2 py-0.5 rounded-md bg-primary text-on-primary text-[10px] font-bold uppercase">
                              AniHeal Staff
                            </span>
                          )}
                        </div>
                        <span className="text-[11px] text-outline font-medium">
                          {comm.createdAt ? new Date(comm.createdAt).toLocaleDateString() : ''}
                        </span>
                      </div>
                      <p className="text-body-sm text-on-surface-variant leading-relaxed pl-9">
                        {comm.comment}
                      </p>
                    </div>
                  ))
                )}
              </div>

              {/* Add Comment Form */}
              <div className="p-6 sm:p-8 rounded-3xl bg-surface-clinical border border-border-hairline shadow-sm space-y-4">
                <h3 className="font-headline-sm text-lg font-bold text-on-surface">Leave a Comment / Technical Query</h3>

                {commentSuccessMsg && (
                  <div className="p-3 rounded-xl bg-surface-tinted border border-primary/20 text-primary text-xs font-semibold flex items-center gap-2">
                    <span className="material-symbols-outlined text-[18px]">check_circle</span>
                    <span>{commentSuccessMsg}</span>
                  </div>
                )}
                {commentErrorMsg && (
                  <div className="p-3 rounded-xl bg-error-container/40 border border-error/20 text-error text-xs font-semibold flex items-center gap-2">
                    <span className="material-symbols-outlined text-[18px]">error</span>
                    <span>{commentErrorMsg}</span>
                  </div>
                )}

                <form onSubmit={handleCommentSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="font-label-sm text-xs font-semibold block mb-1">Your Full Name *</label>
                      <input
                        type="text"
                        required
                        placeholder="Dr. / Officer / Farmer Name"
                        value={commentName}
                        onChange={(e) => setCommentName(e.target.value)}
                        className="w-full px-3 py-2 rounded-xl bg-surface border border-border-hairline text-sm focus:border-primary focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="font-label-sm text-xs font-semibold block mb-1">Email Address (Optional)</label>
                      <input
                        type="email"
                        placeholder="contact@domain.com"
                        value={commentEmail}
                        onChange={(e) => setCommentEmail(e.target.value)}
                        className="w-full px-3 py-2 rounded-xl bg-surface border border-border-hairline text-sm focus:border-primary focus:outline-none"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="font-label-sm text-xs font-semibold block mb-1">Your Comment / Observation *</label>
                    <textarea
                      rows="3"
                      required
                      placeholder="Share your technical observation or question regarding this initiative..."
                      value={commentBody}
                      onChange={(e) => setCommentBody(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl bg-surface border border-border-hairline text-sm focus:border-primary focus:outline-none"
                    ></textarea>
                  </div>

                  <div className="flex justify-end">
                    <button
                      type="submit"
                      disabled={submittingComment}
                      className="px-6 py-2.5 rounded-full bg-primary text-on-primary font-label-md font-bold hover:bg-secondary transition-colors shadow-sm disabled:opacity-60"
                    >
                      {submittingComment ? 'Submitting...' : 'Post Comment'}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </article>
        )}
      </main>

      <Footer />
    </div>
  );
}
