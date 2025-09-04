import { useState } from 'react';
import { FaStar, FaPaperPlane } from 'react-icons/fa';

function ReviewsSection({
  reviews,
  user,
  rating,
  setRating,
  comment,
  setComment,
  reviewError,
  handleReviewSubmit,
  handleDeleteSubmit,
}) {
  const [showAll, setShowAll] = useState(false);

  // ✅ Sort reviews so latest appear first
  const sortedReviews = [...reviews].reverse();

  // ✅ Show only 5 unless "Show More" clicked
  const visibleReviews = showAll ? sortedReviews : sortedReviews.slice(0, 3);

  return (
    <div className='max-w-4xl mx-auto mt-10 px-4'>
      <h2 className='text-4xl font-semibold text-[#2a4125] mb-8'>
        Customer Reviews
      </h2>

      {/* ⭐ Review Form (Top) */}
      <div className='mb-8 border border-[#77846a] rounded-2xl p-5 shadow-sm '>
        <h3 className='font-medium mb-3 text-lg text-[#2a4125]'>
          Add your review
        </h3>

        {/* Rating stars */}
        <div className='flex gap-2 text-yellow-500 mb-3'>
          {Array.from({ length: 5 }).map((_, i) => (
            <FaStar
              key={i}
              size={22}
              className={`cursor-pointer ${
                rating > i ? 'fill-current' : 'text-[#c7cdc6]'
              }`}
              onClick={() => setRating(i + 1)}
            />
          ))}
        </div>

        {/* Input with send button */}
        <div className='relative'>
          <textarea
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            className='w-full border border-[#77846a] rounded-xl p-3 pr-12 resize-none focus:outline-none focus:ring-0 '
            placeholder='Write your review...'
            rows={3}
          />
          <button
            onClick={handleReviewSubmit}
            className='absolute right-3 bottom-3 bg-[#2a4125] text-white p-2 rounded-full hover:bg-[#1e2f19] transition cursor-pointer'
          >
            <FaPaperPlane size={16} />
          </button>
        </div>

        {reviewError && (
          <p className='text-red-500 text-sm mt-2'>{reviewError}</p>
        )}
      </div>

      {/* ⭐ Review List */}
      <div className='space-y-6'>
        {reviews.length === 0 && (
          <p className='text-center text-[#77846a] italic'>
            No reviews yet. Be the first! 😎
          </p>
        )}

        {visibleReviews.map((rev) => (
          <div
            key={rev._id}
            className='border border-[#77846a] rounded-2xl p-5 shadow-sm hover:shadow-md transition-all duration-300 '
          >
            <div className='flex items-center justify-between'>
              {/* Stars */}
              <div className='flex items-center gap-1 text-yellow-500'>
                {Array.from({ length: rev?.rating || 0 }).map((_, i) => (
                  <FaStar key={i} size={18} />
                ))}
              </div>

              {/* Name */}
              <p className='text-sm text-[#77846a] italic'>@{rev.name}</p>
            </div>

            {/* Comment */}
            <p className='mt-3 text-[#77846a] leading-relaxed'>
              {rev?.comment}
            </p>

            {/* Delete button */}
            {(rev.user?._id === user?._id || rev.user === user?._id) && (
              <button
                className='mt-3 text-sm text-[#3d081b] font-medium hover:underline transition-all cursor-pointer'
                onClick={() => handleDeleteSubmit(rev)}
              >
                🗑 Delete Review
              </button>
            )}
          </div>
        ))}
      </div>

      {/* Show More Button */}
      {/* Show More / Show Less Button */}
      {reviews.length > 3 && (
        <div className='text-center mt-6'>
          <button
            className='text-[#2a4125] font-medium hover:underline cursor-pointer'
            onClick={() => setShowAll(!showAll)}
          >
            {showAll ? 'Show less reviews ↑' : 'Show more reviews ↓'}
          </button>
        </div>
      )}
    </div>
  );
}

export default ReviewsSection;
