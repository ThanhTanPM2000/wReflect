import React from "react";
import { useAuth0 } from "@auth0/auth0-react";

const LogoutButton = () => {
    const { logout, isAuthenticated } = useAuth0();
    return ( 
        <div>
            {isAuthenticated && ( 
                <a onClick={() => logout()}>
                    Logout
                </a>
            )}
        </div>
    )
}

export default LogoutButton;