import { useAuth } from '../contexts/AuthContext';

export default function ProfilePage() {
  const { user } = useAuth();

  return (
    <div className="app">
      <h1>My Profile</h1>
      <div className="card">
        <h2>Account Details</h2>
        <div className="profile-details">
          <div className="profile-row">
            <span className="profile-label">Name</span>
            <span className="profile-value">{user.name}</span>
          </div>
          <div className="profile-row">
            <span className="profile-label">Email</span>
            <span className="profile-value">{user.email}</span>
          </div>
          {user.current_stage && (
            <div className="profile-row">
              <span className="profile-label">Current Stage</span>
              <span className="profile-value">{user.current_stage}</span>
            </div>
          )}
          {user.target_career && (
            <div className="profile-row">
              <span className="profile-label">Target Career</span>
              <span className="profile-value">{user.target_career}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
