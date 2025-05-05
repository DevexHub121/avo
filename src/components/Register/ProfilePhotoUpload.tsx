import React from 'react';

interface Props {
    imgUrl?: string;
    onFileSelect: (file: File) => void;
    onRemove: () => void;
}

export const ProfilePhotoUpload: React.FC<Props> = ({ imgUrl, onFileSelect, onRemove }) => (
    <div className="mb-3">
        <label className="form-label">Profile Photo</label>
        {imgUrl ? (
            <div>
                <img src={imgUrl} alt="Profile" className="img-thumbnail mb-2" style={{ width: 80 }} />
                <button type="button" className="btn btn-sm btn-danger" onClick={onRemove}>
                    Delete
                </button>
            </div>
        ) : (
            <input
                type="file"
                accept="image/*"
                className="form-control"
                onChange={e => e.target.files && onFileSelect(e.target.files[0])}
            />
        )}
    </div>
);
