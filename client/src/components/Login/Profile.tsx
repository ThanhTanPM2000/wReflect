import React from "react";
import { useAuth0 } from "@auth0/auth0-react";

const Profile = () => {
  const { user, isAuthenticated } = useAuth0();
  return (
    <div>
      {isAuthenticated && (
        <h2>
          {user?.given_name}&nbsp;{user?.family_name}
        </h2>
      )}
    </div>
  );
};

export default Profile;
