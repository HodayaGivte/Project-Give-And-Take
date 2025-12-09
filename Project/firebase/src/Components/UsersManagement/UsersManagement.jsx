import React, { useState } from "react";
import { Users, Shield, Calendar, Mail, User as UserIcon, Search } from "lucide-react";

export default function UsersManagement() {
  const [searchQuery, setSearchQuery] = useState("");

  // נתונים מדומים רק למטרת עיצוב
  const users = [
    { id: 1, full_name: "משתמש א", email: "a@test.com", role: "user", created_date: "2025-01-01" },
    { id: 2, full_name: "מנהל ב", email: "b@test.com", role: "admin", created_date: "2025-02-01" }
  ];

  return (
    <div className="space-y-8 p-6 max-w-5xl mx-auto">
      {/* כותרת */}
      <div className="flex items-center justify-between bg-indigo-50 p-6 rounded-lg shadow">
        <div className="flex items-center gap-3">
          <Users className="w-8 h-8 text-indigo-600" />
          <div>
            <h1 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-l from-indigo-600 to-purple-600">
              ניהול משתמשים
            </h1>
            <p className="text-slate-600 mt-1">צפייה במשתמשים רשומים</p>
          </div>
        </div>
        <button
          className="px-4 py-2 border border-indigo-200 rounded hover:bg-indigo-100 transition"
          onClick={() => alert("חזרה לפאנל")}
        >
          חזרה לפאנל
        </button>
      </div>

      {/* סטטיסטיקות */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="border rounded-lg shadow p-6 text-center">
          <div className="text-4xl font-bold text-indigo-600">2</div>
          <div className="text-slate-600">סך הכל משתמשים</div>
        </div>
        <div className="border rounded-lg shadow p-6 text-center">
          <div className="text-4xl font-bold text-purple-600">1</div>
          <div className="text-slate-600">מנהלים</div>
        </div>
        <div className="border rounded-lg shadow p-6 text-center">
          <div className="text-4xl font-bold text-green-600">1</div>
          <div className="text-slate-600">משתמשים פעילים</div>
        </div>
      </div>

      {/* חיפוש */}
      <div className="relative">
        <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
        <input
          type="text"
          placeholder="חיפוש לפי שם או אימייל..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pr-12 h-12 border rounded shadow-sm w-full"
        />
      </div>

      {/* רשימת משתמשים */}
      <div className="grid gap-4">
        {users.map((u) => (
          <div key={u.id} className="border rounded-lg shadow hover:shadow-xl transition p-6 flex items-center gap-6">
            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-indigo-100 to-purple-100 flex items-center justify-center flex-shrink-0">
              <UserIcon className="w-8 h-8 text-indigo-600" />
            </div>
            <div className="flex-1 space-y-3">
              <div className="flex items-start justify-between gap-4">
                <div className="space-y-2">
                  <div className="flex items-center gap-3">
                    <h3 className="text-xl font-bold text-slate-900">{u.full_name}</h3>
                    {u.role === "admin" && (
                      <span className="bg-purple-100 text-purple-700 px-2 py-1 rounded-full flex items-center gap-1 text-sm">
                        <Shield className="w-3 h-3" /> מנהל
                      </span>
                    )}
                  </div>
                  <div className="flex flex-wrap gap-3 text-sm text-slate-600">
                    <div className="flex items-center gap-1">
                      <Mail className="w-4 h-4" /> {u.email}
                    </div>
                    <div className="flex items-center gap-1">
                      <Calendar className="w-4 h-4" /> הצטרף {u.created_date}
                    </div>
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-indigo-600">1</div>
                  <div className="text-sm text-slate-500">פריטים</div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
