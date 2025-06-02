import React from 'react';
import { useAuth } from '../hooks/useAuth';
import recipeService from '../services/recipeService';

const PendingEdits = ({ recipe, onEditApproved }) => {
  const { user } = useAuth();
  const isOwner = recipe.owner._id === user?.id;

  const handleReview = async (editId, status) => {
    try {
      await recipeService.reviewEdit(recipe._id, editId, status);
      onEditApproved();
    } catch (error) {
      console.error('Failed to review edit:', error);
    }
  };

  if (!recipe.pendingEdits?.length) {
    return null;
  }

  return (
    <div className="pending-edits">
      <h3>Pending Edit Suggestions</h3>
      {recipe.pendingEdits.map(edit => (
        <div key={edit._id} className="edit-suggestion">
          <h4>Suggested by {edit.proposedBy.name}</h4>
          <div className="changes">
            {Object.entries(edit.changes).map(([field, value]) => (
              <div key={field} className="change-item">
                <span className="field">{field}:</span>
                <span className="value">{JSON.stringify(value)}</span>
              </div>
            ))}
          </div>
          {isOwner && edit.status === 'pending' && (
            <div className="review-actions">
              <button
                onClick={() => handleReview(edit._id, 'approved')}
                className="btn btn-success"
              >
                Approve
              </button>
              <button
                onClick={() => handleReview(edit._id, 'rejected')}
                className="btn btn-danger"
              >
                Reject
              </button>
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default PendingEdits;