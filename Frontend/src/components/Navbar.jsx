// import { Link } from "react-router-dom";
// import { useAuth } from "../AuthContext";

// export default function Navbar() {
//   const { signin, logout, name, role } = useAuth();

//   return (
//     <nav className="bg-gray-900 border-b border-gray-800 shadow-sm">
//       <div className="px-6 py-4 flex items-center justify-between">
        
//         {/* Logo */}
//         <h1 className="text-2xl font-bold text-white tracking-wide">
//           TaskFlowSpirit
//         </h1>

//         {/* Profile */}
//         <div className="relative">
//           {signin ? (
//             <div className="group cursor-pointer">
//               <span className="px-3 py-2 rounded-md text-gray-300 hover:text-white hover:bg-gray-800">
//                 Profile
//               </span>

//               <div className="absolute right-0 mt-2 w-44 bg-gray-800 border border-gray-700 rounded-lg shadow-lg hidden group-hover:block">
//                 <p className="px-4 py-2 text-sm text-gray-300 border-b border-gray-700">
//                   {name}
//                 </p>

//                 <p className="px-4 py-2 text-sm text-gray-400 border-b border-gray-700 capitalize">
//                   {role}
//                 </p>

//                 <button
//                   onClick={logout}
//                   className="w-full text-left px-4 py-2 text-sm text-red-400 hover:bg-gray-700"
//                 >
//                   Logout
//                 </button>
//               </div>
//             </div>
//           ) : (
//             <Link
//               to="/login"
//               className="px-3 py-2 rounded-md text-gray-300 hover:text-white hover:bg-gray-800"
//             >
//               Login
//             </Link>
//           )}
//         </div>

//       </div>
//     </nav>
//   );
// }


import { Link } from "react-router-dom";
import { useState } from "react";
import { useAuth } from "../AuthContext";

export default function Navbar() {
  const { signin, logout, name, role } = useAuth();
  const [open, setOpen] = useState(false);

  return (
    <nav className="bg-gray-900 border-b border-gray-800 shadow-sm">
      <div className="px-6 py-4 flex items-center justify-between">

        <h1 className="text-2xl font-bold text-white tracking-wide">
          TaskFlowSpirit
        </h1>

        <div className="relative">
          {signin ? (
            <div>
              <button
                onClick={() => setOpen(!open)}
                className="px-3 py-2 rounded-md text-gray-300 hover:text-white hover:bg-gray-800"
              >
                {name} ▾
              </button>

              {open && (
                <div className="absolute right-0 mt-2 w-44 bg-gray-800 border border-gray-700 rounded-lg shadow-lg z-50">
                  <p className="px-4 py-2 text-sm text-gray-300 border-b border-gray-700">
                    {name}
                  </p>
                  <p className="px-4 py-2 text-sm text-gray-400 border-b border-gray-700 capitalize">
                    {role?.replace(/_/g, " ")}
                  </p>
                  <button
                    onClick={() => { logout(); setOpen(false); }}
                    className="w-full text-left px-4 py-2 text-sm text-red-400 hover:bg-gray-700 rounded-b-lg"
                  >
                    Logout
                  </button>
                </div>
              )}
            </div>
          ) : (
            <Link
              to="/login"
              className="px-3 py-2 rounded-md text-gray-300 hover:text-white hover:bg-gray-800"
            >
              Login
            </Link>
          )}
        </div>

      </div>
    </nav>
  );
}